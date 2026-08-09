"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Point = { x: number; y: number; h: number; label: string };

const VIEW_H = 620; // height of the admin's scroll window

/**
 * Renders the real page in a same-origin iframe at true device size and paints
 * recorded clicks over it.
 *
 * The iframe is deliberately kept at the device *viewport* size rather than
 * stretched to the full document height: the page uses `100vh` sections, so a
 * stretched frame makes them grow, which remeasures taller, which grows them
 * again. Instead the outer container scrolls, and the iframe's content plus the
 * heat overlay are scrolled in step — the same approach commercial heatmap
 * tools use.
 *
 * Coordinates are stored device-relative (`x` as a 0–1 fraction of document
 * width, `y` absolute alongside the document height at capture), so replaying
 * is x × width and y × (currentDocH / recordedDocH).
 */
export default function HeatmapCanvas({
  path,
  width,
  height,
  points,
}: {
  path: string;
  width: number;
  height: number;
  points: Point[];
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [docH, setDocH] = useState(height);
  const [scale, setScale] = useState(1);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / width)));
    ro.observe(el);
    setScale(Math.min(1, el.clientWidth / width));
    return () => ro.disconnect();
  }, [width]);

  const measure = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;
    const h = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
    if (h > 100) setDocH(h);
  }, []);

  useEffect(() => {
    setScrollTop(0);
    const t = setInterval(measure, 500);
    const stop = setTimeout(() => clearInterval(t), 5000);
    return () => {
      clearInterval(t);
      clearTimeout(stop);
    };
  }, [path, width, measure]);

  // Drive the iframe's own scroll from the outer container.
  const onScroll = () => {
    const el = outerRef.current;
    if (!el) return;
    const top = el.scrollTop / scale;
    setScrollTop(top);
    frameRef.current?.contentWindow?.scrollTo(0, top);
  };

  // Paint only the visible slice, offset by the current scroll.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    if (!points.length) return;

    const radius = Math.max(26, Math.round(width * 0.04));
    ctx.globalCompositeOperation = "lighter";
    for (const p of points) {
      const scaleY = p.h > 0 ? docH / p.h : 1;
      const y = p.y * scaleY - scrollTop;
      if (y < -radius || y > height + radius) continue;
      const x = p.x * width;
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, "rgba(255,255,255,0.30)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";

    // Map accumulated intensity through a cool → warm ramp.
    const img = ctx.getImageData(0, 0, width, height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const a = d[i + 3];
      if (a === 0) continue;
      const t = Math.min(1, a / 255);
      let r: number, g: number, b: number;
      if (t < 0.35) {
        const k = t / 0.35;
        r = 68 + k * 112;
        g = 48 + k * 114;
        b = 94 + k * 118;
      } else if (t < 0.7) {
        const k = (t - 0.35) / 0.35;
        r = 180 + k * 51;
        g = 162 + k * 5;
        b = 212 - k * 53;
      } else {
        const k = (t - 0.7) / 0.3;
        r = 231 - k * 40;
        g = 167 - k * 81;
        b = 159 - k * 107;
      }
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
      d[i + 3] = Math.min(230, a * 2.8);
    }
    ctx.putImageData(img, 0, 0);
  }, [points, width, height, docH, scrollTop]);

  return (
    <div>
      <div
        ref={outerRef}
        onScroll={onScroll}
        className="relative w-full overflow-y-auto overflow-x-hidden rounded-md border border-ink/10 bg-ink/5"
        style={{ height: VIEW_H }}
      >
        {/* Spacer gives the scrollbar the full page's travel. */}
        <div style={{ height: docH * scale }} aria-hidden />
        <div
          className="pointer-events-none sticky left-0 origin-top-left"
          style={{
            top: 0,
            marginTop: -docH * scale,
            width,
            height,
            transform: `scale(${scale})`,
          }}
        >
          <iframe
            ref={frameRef}
            // `heatmap=1` makes the tracker no-op, so previewing the data never
            // pollutes the data being previewed.
            src={`${path}${path.includes("?") ? "&" : "?"}heatmap=1`}
            title={`Preview of ${path}`}
            width={width}
            height={height}
            onLoad={measure}
            className="block border-0"
            scrolling="no"
          />
          <canvas
            ref={canvasRef}
            className="absolute left-0 top-0"
            style={{ width, height, mixBlendMode: "multiply" }}
          />
        </div>
      </div>
      <p className="m-0 mt-2 text-xs text-ink/45">
        Scroll inside the frame to move through the page — the overlay follows.
      </p>
    </div>
  );
}
