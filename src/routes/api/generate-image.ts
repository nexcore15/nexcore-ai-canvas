import { createFileRoute } from "@tanstack/react-router";

/**
 * Secure image-generation proxy.
 *
 * The browser never talks to an image provider directly and never sees a key:
 * it POSTs { prompt, negativePrompt, model, width, height } here, and this
 * handler adds any server-side credentials before calling the provider.
 */
type Body = {
  prompt?: string;
  negativePrompt?: string;
  model?: string;
  width?: number;
  height?: number;
  seed?: number;
};

const clampSize = (n: unknown, fallback: number) => {
  const v = typeof n === "number" && Number.isFinite(n) ? Math.round(n) : fallback;
  return Math.min(1536, Math.max(256, v));
};

function pollinationsUrl(opts: {
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  seed: number;
  model: "flux" | "turbo";
}) {
  const params = new URLSearchParams({
    width: String(opts.width),
    height: String(opts.height),
    seed: String(opts.seed),
    model: opts.model,
    nologo: "true",
    referrer: "pixflow-ai",
  });
  const prompt = opts.negativePrompt
    ? `${opts.prompt} --no ${opts.negativePrompt}`
    : opts.prompt;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;
}

export const Route = createFileRoute("/api/generate-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as Body;
        const prompt = (body.prompt ?? "").trim().slice(0, 1200);
        if (!prompt) {
          return Response.json({ error: "A prompt is required." }, { status: 400 });
        }

        const width = clampSize(body.width, 1024);
        const height = clampSize(body.height, 1024);
        const seed = Number.isFinite(body.seed)
          ? Number(body.seed)
          : Math.floor(Math.random() * 1_000_000);
        const negativePrompt = (body.negativePrompt ?? "").trim().slice(0, 400);
        const model = body.model ?? "pollinations";

        // Premium path: Nexcore HD renders through the Lovable AI gateway.
        if (model === "nexcore-hd") {
          const key = process.env["LOVABLE_API_KEY"];
          if (key) {
            try {
              const upstream = await fetch(
                "https://ai.gateway.lovable.dev/v1/images/generations",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${key}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    model: "google/gemini-2.5-flash-image",
                    messages: [
                      {
                        role: "user",
                        content: negativePrompt
                          ? `${prompt}. Avoid: ${negativePrompt}. Aspect ratio ${width}x${height}.`
                          : `${prompt}. Aspect ratio ${width}x${height}.`,
                      },
                    ],
                    modalities: ["image", "text"],
                    stream: false,
                  }),
                },
              );
              if (upstream.ok) {
                const json = (await upstream.json()) as {
                  choices?: { message?: { images?: { image_url?: { url?: string } }[] } }[];
                  data?: { b64_json?: string; url?: string }[];
                };
                const url =
                  json.choices?.[0]?.message?.images?.[0]?.image_url?.url ??
                  json.data?.[0]?.url ??
                  (json.data?.[0]?.b64_json
                    ? `data:image/png;base64,${json.data[0].b64_json}`
                    : undefined);
                if (url) {
                  return Response.json({ imageUrl: url, modelUsed: "Nexcore HD" });
                }
              } else {
                console.error("Nexcore HD upstream error", upstream.status, await upstream.text());
              }
            } catch (error) {
              console.error("Nexcore HD request failed", error);
            }
          }
          // Fall through to the always-free provider.
        }

        const pollModel = model === "turbo" ? "turbo" : "flux";
        return Response.json({
          imageUrl: pollinationsUrl({ prompt, negativePrompt, width, height, seed, model: pollModel }),
          modelUsed: pollModel === "turbo" ? "Pixflow Turbo" : "Pixflow Free",
        });
      },
    },
  },
});