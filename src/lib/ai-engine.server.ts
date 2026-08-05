/**
 * Server-only AI engine for Pixflow.
 *
 * Two stages:
 *  1. `optimizePrompt` — Gemini reads the user's short idea and rewrites it into
 *     a rich, camera-accurate image-generation prompt in the requested style.
 *  2. `renderImage` — the optimized prompt is sent to the best available image
 *     engine. Providers are tried in quality order and the first success wins.
 *
 * Keys are read inside the functions (never at module scope) and never leave
 * the server.
 */

export type StyleId = "realistic" | "3d" | "2d" | "cartoon";
export type QualityId = "hd" | "ultra";

const STYLE_BRIEF: Record<StyleId, string> = {
  realistic:
    "photorealistic photography: real-world lighting, natural skin and material texture, shallow depth of field, shot on a full-frame camera with a prime lens",
  "3d": "polished 3D render: octane/redshift quality, soft studio HDRI lighting, subsurface scattering, glossy materials, cinematic depth",
  "2d": "clean 2D digital illustration: flat vector-like shapes, bold confident linework, harmonious limited palette, poster composition",
  cartoon:
    "playful cartoon art: expressive stylised characters, thick outlines, bright saturated colours, animated-film energy",
};

const QUALITY_BRIEF: Record<QualityId, string> = {
  hd: "high definition, crisp detail, clean edges",
  ultra: "ultra-detailed 8K masterpiece, razor-sharp micro detail, perfect composition, award-winning",
};

const FALLBACK_SUFFIX =
  "highly detailed, professional quality, balanced composition, no watermark, no text";

/** Rewrites a raw idea into a detailed prompt using Gemini. */
export async function optimizePrompt(
  raw: string,
  style: StyleId,
  quality: QualityId,
): Promise<{ prompt: string; optimized: boolean }> {
  const instruction = `You are the prompt engineer for a premium AI image studio.
Read the user's idea, work out what they actually want to see, then write ONE image-generation prompt for it.

Rules:
- Target style: ${STYLE_BRIEF[style]}.
- Quality: ${QUALITY_BRIEF[quality]}.
- Keep every subject, object, count, colour, text and relationship the user asked for. Never swap the subject.
- Add what is missing: setting, camera angle, lens, lighting, mood, colour palette, materials, level of detail.
- Describe only what should be visible. No negatives, no "avoid", no lists of don'ts.
- Output the prompt only: one paragraph, 45-80 words, plain text, no quotes, no labels.`;

  const text = await callGemini(instruction, raw);
  if (!text) {
    return {
      prompt: `${raw}, ${STYLE_BRIEF[style]}, ${QUALITY_BRIEF[quality]}, ${FALLBACK_SUFFIX}`,
      optimized: false,
    };
  }
  return { prompt: text, optimized: true };
}

/** Calls Gemini text: user-supplied key first, Lovable AI gateway as backup. */
async function callGemini(system: string, user: string): Promise<string | null> {
  const direct = process.env["GEMINI_API_KEY"];
  if (direct) {
    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
        {
          method: "POST",
          headers: { "x-goog-api-key": direct, "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ role: "user", parts: [{ text: user }] }],
            generationConfig: { temperature: 0.9, maxOutputTokens: 900 },
          }),
        },
      );
      if (res.ok) {
        const json = (await res.json()) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        const out = json.candidates?.[0]?.content?.parts
          ?.map((p) => p.text ?? "")
          .join(" ")
          .trim();
        if (out) return clean(out);
      } else {
        console.error("Gemini direct failed", res.status, (await res.text()).slice(0, 300));
      }
    } catch (error) {
      console.error("Gemini direct request error", error);
    }
  }

  const gatewayKey = process.env["LOVABLE_API_KEY"];
  if (!gatewayKey) return null;
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${gatewayKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      console.error("Gemini gateway failed", res.status, (await res.text()).slice(0, 300));
      return null;
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const out = json.choices?.[0]?.message?.content?.trim();
    return out ? clean(out) : null;
  } catch (error) {
    console.error("Gemini gateway request error", error);
    return null;
  }
}

const clean = (t: string) =>
  t
    .replace(/^["'`\s]+|["'`\s]+$/g, "")
    .replace(/^(prompt|image prompt)\s*:\s*/i, "")
    .replace(/\s+/g, " ")
    .slice(0, 1400);

export type RenderResult = {
  imageUrl: string;
  engine: string;
};

/**
 * Renders an image. Engines are attempted best-first; each returns a data URL
 * or a direct image URL.
 */
export async function renderImage(opts: {
  prompt: string;
  width: number;
  height: number;
  quality: QualityId;
  seed: number;
  /** Optional base image (data URL) for edit requests. */
  baseImage?: { data: string; mimeType: string } | undefined;
}): Promise<RenderResult> {
  const errors: string[] = [];

  for (const engine of imageEngines(opts.quality, Boolean(opts.baseImage))) {
    try {
      const url = await engine.run(opts);
      if (url) return { imageUrl: url, engine: engine.label };
    } catch (error) {
      errors.push(`${engine.label}: ${error instanceof Error ? error.message : "failed"}`);
      console.error("Image engine failed", engine.label, error);
    }
  }

  throw new Error(
    errors.length
      ? `Image generation is temporarily unavailable — every engine refused the request. Details: ${errors.join(" | ")}`
      : "No image engine is available right now.",
  );
}

type Engine = {
  label: string;
  run: (opts: {
    prompt: string;
    width: number;
    height: number;
    seed: number;
    baseImage?: { data: string; mimeType: string } | undefined;
  }) => Promise<string | null>;
};

function imageEngines(quality: QualityId, isEdit: boolean): Engine[] {
  const gatewayModel = quality === "ultra" ? "google/gemini-3-pro-image" : "google/gemini-3.1-flash-image";
  const engines: Engine[] = [
    {
      label: quality === "ultra" ? "Pixflow Ultra" : "Pixflow HD",
      run: (o) => gatewayImage(gatewayModel, o),
    },
    {
      label: "Pixflow Studio",
      run: (o) => geminiDirectImage(o),
    },
  ];
  // Text-to-image only fallback.
  if (!isEdit) {
    engines.push({
      label: "Pixflow Lite",
      run: (o) => pollinationsImage(o),
    });
  }
  return engines;
}

async function gatewayImage(
  model: string,
  o: {
    prompt: string;
    width: number;
    height: number;
    baseImage?: { data: string; mimeType: string } | undefined;
  },
): Promise<string | null> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return null;

  const content: unknown = o.baseImage
    ? [
        { type: "text", text: o.prompt },
        { type: "image_url", image_url: { url: `data:${o.baseImage.mimeType};base64,${o.baseImage.data}` } },
      ]
    : `${o.prompt} Aspect ratio ${aspectLabel(o.width, o.height)}.`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content }],
      modalities: ["image", "text"],
      stream: false,
    }),
  });

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 200);
    if (res.status === 402) throw new Error("AI credits exhausted for the premium engine.");
    if (res.status === 429) throw new Error("Premium engine is busy, try again shortly.");
    throw new Error(`gateway ${res.status} ${detail}`);
  }

  const json = (await res.json()) as {
    choices?: { message?: { images?: { image_url?: { url?: string } }[] } }[];
    data?: { b64_json?: string; url?: string }[];
  };
  return (
    json.choices?.[0]?.message?.images?.[0]?.image_url?.url ??
    json.data?.[0]?.url ??
    (json.data?.[0]?.b64_json ? `data:image/png;base64,${json.data[0].b64_json}` : null)
  );
}

async function geminiDirectImage(o: {
  prompt: string;
  width: number;
  height: number;
  baseImage?: { data: string; mimeType: string } | undefined;
}): Promise<string | null> {
  const key = process.env["GEMINI_API_KEY"];
  if (!key) return null;

  const parts: unknown[] = [
    { text: `${o.prompt} Aspect ratio ${aspectLabel(o.width, o.height)}.` },
  ];
  if (o.baseImage) {
    parts.push({ inlineData: { mimeType: o.baseImage.mimeType, data: o.baseImage.data } });
  }

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
    {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: { responseModalities: ["IMAGE"] },
      }),
    },
  );

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 200);
    if (res.status === 429) throw new Error("Studio engine quota reached on the connected Google key.");
    throw new Error(`studio ${res.status} ${detail}`);
  }

  const json = (await res.json()) as {
    candidates?: {
      content?: { parts?: { inlineData?: { mimeType?: string; data?: string } }[] };
    }[];
  };
  const inline = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData;
  return inline?.data ? `data:${inline.mimeType ?? "image/png"};base64,${inline.data}` : null;
}

async function pollinationsImage(o: {
  prompt: string;
  width: number;
  height: number;
  seed: number;
}): Promise<string | null> {
  const params = new URLSearchParams({
    width: String(o.width),
    height: String(o.height),
    seed: String(o.seed),
    model: "flux",
    nologo: "true",
    referrer: "pixflow-ai",
  });
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(o.prompt)}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok || !(res.headers.get("content-type") ?? "").startsWith("image/")) {
    throw new Error(`lite ${res.status}`);
  }
  const buffer = await res.arrayBuffer();
  return `data:image/jpeg;base64,${bytesToBase64(new Uint8Array(buffer))}`;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function aspectLabel(width: number, height: number): string {
  const r = width / height;
  if (Math.abs(r - 1) < 0.05) return "1:1 square";
  if (Math.abs(r - 16 / 9) < 0.08) return "16:9 widescreen";
  if (Math.abs(r - 9 / 16) < 0.08) return "9:16 vertical";
  if (Math.abs(r - 4 / 3) < 0.08) return "4:3";
  if (Math.abs(r - 3 / 4) < 0.08) return "3:4 portrait";
  return `${width}x${height}`;
}
