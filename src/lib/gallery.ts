/** Local-first gallery storage. Cloud sync arrives with accounts. */
import { useCallback, useEffect, useState } from "react";

export type GeneratedImage = {
  id: string;
  url: string;
  prompt: string;
  enhancedPrompt?: string | undefined;
  style?: string | undefined;
  quality?: string | undefined;
  model: string;
  ratio: string;
  width: number;
  height: number;
  createdAt: number;
  favorite?: boolean | undefined;
};

const KEY = "pixflow.gallery.v1";
const EVENT = "pixflow-gallery-change";

function read(): GeneratedImage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GeneratedImage[]) : [];
  } catch {
    return [];
  }
}

function write(items: GeneratedImage[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, 200)));
  window.dispatchEvent(new Event(EVENT));
}

export function useGallery() {
  const [items, setItems] = useState<GeneratedImage[]>([]);

  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((image: GeneratedImage) => write([image, ...read()]), []);
  const remove = useCallback((id: string) => write(read().filter((i) => i.id !== id)), []);
  const toggleFavorite = useCallback(
    (id: string) =>
      write(read().map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i))),
    [],
  );
  const clear = useCallback(() => write([]), []);

  return { items, add, remove, toggleFavorite, clear };
}

/** Re-encodes an image to the requested format and triggers a download. */
export async function downloadImage(url: string, format: "png" | "jpg" | "webp", name: string) {
  const response = await fetch(url, { mode: "cors" });
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  if (format === "jpg") {
    ctx.fillStyle = "#0b0b14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(bitmap, 0, 0);
  const mime = format === "png" ? "image/png" : format === "jpg" ? "image/jpeg" : "image/webp";
  const out: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Encoding failed"))), mime, 0.94),
  );
  const href = URL.createObjectURL(out);
  const a = document.createElement("a");
  a.href = href;
  a.download = `${name}.${format}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}

export const slugifyPrompt = (prompt: string) =>
  prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "pixflow-image";