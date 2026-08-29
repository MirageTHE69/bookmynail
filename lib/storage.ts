import { randomBytes } from "node:crypto";

/**
 * Image storage — ImageKit.
 *
 * Uploads used to be written into `public/uploads`, which works locally but
 * not on Netlify: serverless filesystems are read-only and wiped between
 * requests. Everything else in the app only ever sees the returned URL, so
 * this file stays the single place storage is decided.
 */

const ALLOWED = new Set(["image/webp", "image/jpeg", "image/png", "image/avif"]);
const MAX_BYTES = 8 * 1024 * 1024;
const ENDPOINT = "https://upload.imagekit.io/api/v1/files/upload";

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/avif": "avif",
  "image/webp": "webp",
};

export type UploadFolder = "portfolio" | "payments";

export async function saveImage(file: File, folder: UploadFolder = "portfolio"): Promise<string> {
  if (!ALLOWED.has(file.type)) {
    throw new Error(`Unsupported image type: ${file.type || "unknown"}`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image is larger than 8MB.");
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "IMAGEKIT_PRIVATE_KEY is not set — uploads cannot be stored. " +
        "Add it from the ImageKit dashboard (Developer → API keys).",
    );
  }

  const name = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}.${
    EXT[file.type] ?? "webp"
  }`;

  const form = new FormData();
  form.append("file", file);
  form.append("fileName", name);
  // ImageKit rejects a leading slash on `folder`.
  form.append("folder", `bookmynail/${folder}`);
  // ImageKit would otherwise rename on collision; our names are already unique.
  form.append("useUniqueFileName", "false");

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      // ImageKit uses the private key as the Basic username, empty password.
      Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`,
    },
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`ImageKit upload failed (${res.status}). ${detail.slice(0, 200)}`);
  }

  const json = (await res.json()) as { url?: string };
  if (!json.url) throw new Error("ImageKit upload returned no URL.");
  return json.url;
}
