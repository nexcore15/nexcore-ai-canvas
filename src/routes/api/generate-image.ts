import { createFileRoute } from "@tanstack/react-router";
import { analyzePrompt, RATIO_SIZES, type RatioId } from "@/lib/prompt-analysis";

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
  /** Set false to force the manual style/quality/size supplied in the body. */
  auto?: boolean;
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

        // Smart detection layer: the prompt decides the generation config.
        const analysis = analyzePrompt(raw);
        const auto = body.auto !== false;

        const manualStyle = (STYLES as readonly string[]).includes(body.style ?? "")
          ? (body.style as (typeof STYLES)[number])
          : "realistic";
        const style = auto ? analysis.style : manualStyle;
        const quality = auto ? analysis.quality : body.quality === "ultra" ? "ultra" : "hd";
        const ratioSize = RATIO_SIZES[analysis.ratio as RatioId];
        const width = auto ? ratioSize.width : clampSize(body.width, 1024);
        const height = auto ? ratioSize.height : clampSize(body.height, 1024);
        const seed = Number.isFinite(body.seed)
          ? Number(body.seed)
          : Math.floor(Math.random() * 1_000_000);

        const { optimizePrompt, renderImage } = await import("@/lib/ai-engine.server");

        let finalPrompt = raw;
        try {
          const { prompt, optimized } = body.skipOptimize
            ? { prompt: raw, optimized: false }
            : await optimizePrompt(raw, style, quality, {
                lighting: analysis.lighting,
                camera: analysis.camera,
                aspect: analysis.ratio,
              });
          finalPrompt = prompt;

          const result = await renderImage({ prompt, width, height, quality, seed });

          return Response.json({
            imageUrl: result.imageUrl,
            modelUsed: result.engine,
            finalPrompt: prompt,
            optimized,
            analysis,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Image generation failed. Try again.";
          console.error("generate-image failed", message);
          // Hand the optimized prompt back so the client fallback renders the
          // detailed prompt instead of the user's raw text.
          return Response.json({ error: message, finalPrompt, analysis }, { status: 502 });
        }
      },
    },
  },
});
