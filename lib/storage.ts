import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

/**
 * Image storage adapter.
 *
 * Local/VPS deployments write straight into `public/uploads`. Serverless hosts
 * (Vercel, Netlify) have a read-only filesystem — swap the body of `saveImage`
 * for Vercel Blob, S3 or Cloudinary there. Everything else in the app only
 * knows about the returned URL, so this file is the single place to change.
 */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED = new Set(["image/webp", "image/jpeg", "image/png", "image/avif"]);
const MAX_BYTES = 8 * 1024 * 1024;

export async function saveImage(file: File): Promise<string> {
  if (!ALLOWED.has(file.type)) {
    throw new Error(`Unsupported image type: ${file.type || "unknown"}`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image is larger than 8MB.");
  }

  const ext =
    file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/png"
        ? "png"
        : file.type === "image/avif"
          ? "avif"
          : "webp";
  const name = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}.${ext}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));

  return `/uploads/${name}`;
}
