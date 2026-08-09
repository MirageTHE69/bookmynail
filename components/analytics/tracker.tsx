"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * First-party analytics. Captures clicks (with coordinates), hover dwell,
 * section dwell and scroll depth so the admin heatmap can show which parts of
 * the page actually earn attention.
 *
 * Privacy: anonymous ids only. No names, no IP, no input values, no session
 * recording. Honours Do Not Track, and never runs inside /admin or the admin's
 * own `?heatmap=1` preview iframe.
 */

type Payload = {
  type: string;
  section?: string | null;
  targetId?: string | null;
  targetLabel?: string | null;
  xRatio?: number;
  yPx?: number;
  docH?: number;
  value?: number;
  meta?: Record<string, unknown>;
};

const FLUSH_MS = 5000;
const FLUSH_AT = 20;

function id() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  );
}

function deviceOf(w: number) {
  if (w < 761) return "mobile";
  if (w < 1101) return "tablet";
  return "desktop";
}

/** A short, readable label for whatever was clicked. */
function labelOf(el: Element): string {
  const aria = el.getAttribute("aria-label");
  if (aria) return aria.slice(0, 80);
  const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
  if (text) return text.slice(0, 80);
  const tag = el.tagName.toLowerCase();
  if (tag === "img") return (el as HTMLImageElement).alt || "image";
  return tag;
}

export default function Tracker() {
  const pathname = usePathname();
  const queue = useRef<Payload[]>([]);
  const ids = useRef<{ visitor: string; session: string } | null>(null);
  const enabled = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isPreview = params.has("heatmap");
    const isAdmin = pathname?.startsWith("/admin");
    const dnt =
      navigator.doNotTrack === "1" ||
      (window as unknown as { doNotTrack?: string }).doNotTrack === "1";

    enabled.current = !isPreview && !isAdmin && !dnt;
    if (!enabled.current) return;

    let visitor = localStorage.getItem("bmn_vid");
    if (!visitor) {
      visitor = id();
      localStorage.setItem("bmn_vid", visitor);
    }
    let session = sessionStorage.getItem("bmn_sid");
    if (!session) {
      session = id();
      sessionStorage.setItem("bmn_sid", session);
    }
    ids.current = { visitor, session };

    const push = (p: Payload) => {
      queue.current.push(p);
      if (queue.current.length >= FLUSH_AT) flush();
    };

    const flush = (final = false) => {
      if (!queue.current.length || !ids.current) return;
      const batch = queue.current.splice(0, queue.current.length);
      const body = JSON.stringify({
        visitorId: ids.current.visitor,
        sessionId: ids.current.session,
        path: pathname,
        vw: window.innerWidth,
        vh: window.innerHeight,
        device: deviceOf(window.innerWidth),
        events: batch,
      });
      // sendBeacon survives page unload; fetch is the fallback while active.
      if (final && navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    };

    const docH = () =>
      Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

    push({ type: "pageview", docH: docH() });

    /* ── clicks ──────────────────────────────────────────────────── */
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target || !(target instanceof Element)) return;
      const H = docH();
      const sectionEl = target.closest("[data-track-section]");
      const idEl = target.closest("[data-track-id]");
      const interactive = target.closest("a, button, [role=button]") ?? target;
      push({
        type: "click",
        section: sectionEl?.getAttribute("data-track-section") ?? null,
        targetId: idEl?.getAttribute("data-track-id") ?? null,
        targetLabel: labelOf(interactive),
        xRatio: e.pageX / Math.max(1, document.documentElement.scrollWidth),
        yPx: Math.round(e.pageY),
        docH: H,
      });
    };

    /* ── hover dwell per section ─────────────────────────────────── */
    const hoverStart = new Map<string, number>();
    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element)?.closest?.("[data-track-section]");
      if (!el) return;
      const name = el.getAttribute("data-track-section")!;
      if (!hoverStart.has(name)) hoverStart.set(name, performance.now());
    };
    const onOut = (e: MouseEvent) => {
      const el = (e.target as Element)?.closest?.("[data-track-section]");
      if (!el) return;
      const name = el.getAttribute("data-track-section")!;
      const started = hoverStart.get(name);
      if (started == null) return;
      hoverStart.delete(name);
      const ms = performance.now() - started;
      if (ms > 400) push({ type: "hover", section: name, value: Math.round(ms) });
    };

    /* ── section dwell in viewport ───────────────────────────────── */
    const visibleSince = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          const name = en.target.getAttribute("data-track-section");
          if (!name) continue;
          if (en.isIntersecting) {
            if (!visibleSince.has(en.target)) visibleSince.set(en.target, performance.now());
          } else {
            const since = visibleSince.get(en.target);
            if (since != null) {
              visibleSince.delete(en.target);
              const ms = performance.now() - since;
              if (ms > 500)
                push({ type: "section_dwell", section: name, value: Math.round(ms) });
            }
          }
        }
      },
      { threshold: 0.35 },
    );
    document.querySelectorAll("[data-track-section]").forEach((el) => io.observe(el));

    /* ── scroll depth ────────────────────────────────────────────── */
    // Emitted as each quarter is crossed rather than only on exit: `pagehide`
    // is unreliable on mobile, and depth is the one signal you cannot
    // reconstruct afterwards.
    let maxDepth = 0;
    const sent = new Set<number>();
    const onScroll = () => {
      const H = docH();
      const seen = window.scrollY + window.innerHeight;
      const depth = Math.min(100, Math.round((seen / Math.max(1, H)) * 100));
      if (depth <= maxDepth) return;
      maxDepth = depth;
      for (const step of [25, 50, 75, 100]) {
        if (depth >= step && !sent.has(step)) {
          sent.add(step);
          push({ type: "scroll", value: step, docH: H });
        }
      }
    };
    onScroll();

    /* ── custom events from the rest of the app ──────────────────── */
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<Payload>).detail;
      if (detail?.type) push(detail);
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("mouseout", onOut, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("bmn:track", onCustom as EventListener);

    const timer = setInterval(() => flush(), FLUSH_MS);

    const finalise = () => {
      // Close out anything still open so dwell isn't lost on exit.
      for (const [el, since] of Array.from(visibleSince.entries())) {
        const name = el.getAttribute("data-track-section");
        if (name) push({ type: "section_dwell", section: name, value: Math.round(performance.now() - since) });
      }
      visibleSince.clear();
      flush(true);
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") finalise();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", finalise);

    return () => {
      finalise();
      clearInterval(timer);
      io.disconnect();
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("mouseout", onOut, true);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("bmn:track", onCustom as EventListener);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", finalise);
    };
  }, [pathname]);

  return null;
}

/** Fire a custom analytics event from anywhere in the app. */
export function track(payload: Payload) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("bmn:track", { detail: payload }));
}
