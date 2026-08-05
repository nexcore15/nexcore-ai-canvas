import { createFileRoute } from "@tanstack/react-router";

/**
 * Conversational image editing: send an existing image plus a short
 * instruction ("make it night", "add sunglasses") and get the edited image.
 */
type Body = { imageUrl?: string; instruction?: string };

export const Route = createFileRoute("/api/edit-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as Body;
        const instruction = (body.instruction ?? "").trim().slice(0, 500);
        const imageUrl = (body.imageUrl ?? "").trim();
        if (!instruction || !imageUrl) {
          return Response.json(
            { error: "An image and an edit instruction are required." },
            { status: 400 },
          );
        }

        try {
          const base = await loadImage(imageUrl);
          const { renderImage } = await import("@/lib/ai-engine.server");
          const result = await renderImage({
            prompt: `Edit this image: ${instruction}. Keep everything else identical — same subject, framing, style and lighting. Return the edited image only.`,
            width: 1024,
            height: 1024,
            quality: "hd",
            seed: Math.floor(Math.random() * 1_000_000),
            baseImage: base,
          });
          return Response.json({ imageUrl: result.imageUrl, modelUsed: result.engine });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Edit failed. Try again.";
          console.error("edit-image failed", message);
          return Response.json({ error: message }, { status: 502 });
        }
      },
    },
  },
});

async function loadImage(url: string): Promise<{ data: string; mimeType: string }> {
  if (url.startsWith("data:")) {
    const match = /^data:([^;]+);base64,(.*)$/.exec(url);
    if (!match?.[1] || !match[2]) throw new Error("Unsupported image data.");
    return { mimeType: match[1], data: match[2] };
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not read the source image.");
  const mimeType = res.headers.get("content-type") ?? "image/png";
  const bytes = new Uint8Array(await res.arrayBuffer());
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return { mimeType, data: btoa(binary) };
}
