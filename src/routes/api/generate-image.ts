import { createFileRoute } from "@tanstack/react-router";

/**
 * Text-to-image endpoint.
 *
 * Flow: prompt -> Gemini rewrites it into a detailed image prompt -> the best
 * available image engine renders it. All credentials stay server-side.
 */
type Body = {
  prompt?: string;
  style?: string;
  quality?: string;
  width?: number;
  height?: number;
  seed?: number;
  skipOptimize?: boolean;
};

const STYLES = ["realistic", "3d", "2d", "cartoon"] as const;

const clampSize = (n: unknown, fallback: number) => {
  const v = typeof n === "number" && Number.isFinite(n) ? Math.round(n) : fallback;
  return Math.min(1536, Math.max(256, v));
};

export const Route = createFileRoute("/api/generate-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as Body;
        const raw = (body.prompt ?? "").trim().slice(0, 1200);
        if (!raw) return Response.json({ error: "A prompt is required." }, { status: 400 });

        const style = (STYLES as readonly string[]).includes(body.style ?? "")
          ? (body.style as (typeof STYLES)[number])
          : "realistic";
        const quality = body.quality === "ultra" ? "ultra" : "hd";
        const width = clampSize(body.width, 1024);
        const height = clampSize(body.height, 1024);
        const seed = Number.isFinite(body.seed)
          ? Number(body.seed)
          : Math.floor(Math.random() * 1_000_000);

        const { optimizePrompt, renderImage } = await import("@/lib/ai-engine.server");

        let finalPrompt = raw;
        try {
          const { prompt, optimized } = body.skipOptimize
            ? { prompt: raw, optimized: false }
            : await optimizePrompt(raw, style, quality);
          finalPrompt = prompt;

          const result = await renderImage({ prompt, width, height, quality, seed });

          return Response.json({
            imageUrl: result.imageUrl,
            modelUsed: result.engine,
            finalPrompt: prompt,
            optimized,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Image generation failed. Try again.";
          console.error("generate-image failed", message);
          // Hand the optimized prompt back so the client fallback renders the
          // detailed prompt instead of the user's raw text.
          return Response.json({ error: message, finalPrompt }, { status: 502 });
        }
      },
    },
  },
});
