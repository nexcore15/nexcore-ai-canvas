import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Rewrites a short idea into a rich, professional image prompt. */
export const enhancePrompt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ prompt: z.string().trim().min(1).max(600) }).parse(input),
  )
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { prompt: data.prompt, enhanced: false };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You rewrite short image ideas into one vivid text-to-image prompt. Add subject detail, composition, lighting, lens or medium, mood and quality words. Reply with the prompt only, under 70 words, no quotes, no preamble.",
          },
          { role: "user", content: data.prompt },
        ],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Prompt enhancer failed", response.status, detail);
      if (response.status === 429) throw new Error("Too many requests. Try again in a moment.");
      if (response.status === 402) throw new Error("AI credits exhausted.");
      throw new Error("Could not enhance the prompt right now.");
    }

    const json = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = json.choices?.[0]?.message?.content?.trim();
    return { prompt: text && text.length > 0 ? text : data.prompt, enhanced: Boolean(text) };
  });