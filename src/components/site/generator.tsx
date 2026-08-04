import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ImageIcon, Loader2, Sparkles, Wand2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ImageCard } from "@/components/site/image-card";
import { enhancePrompt } from "@/lib/enhance.functions";
import { useGallery, type GeneratedImage } from "@/lib/gallery";
import { quickPrompts } from "@/lib/prompts";

/** Aspect ratios offered to the user, mapped to generation dimensions. */
const ratios = [
  { id: "1:1", label: "1:1", width: 1024, height: 1024 },
  { id: "16:9", label: "16:9", width: 1280, height: 720 },
  { id: "9:16", label: "9:16", width: 720, height: 1280 },
  { id: "4:3", label: "4:3", width: 1152, height: 864 },
  { id: "3:4", label: "3:4", width: 864, height: 1152 },
] as const;

const models = [
  { id: "pollinations", label: "Pixflow Free — best all-round (no limits)" },
  { id: "turbo", label: "Pixflow Turbo — fastest" },
  { id: "nexcore-hd", label: "Nexcore HD — highest quality" },
] as const;

export function Generator({ initialPrompt = "" }: { initialPrompt?: string }) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [negative, setNegative] = useState("");
  const [model, setModel] = useState<string>("pollinations");
  const [ratio, setRatio] = useState<string>("1:1");
  const [advanced, setAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState<GeneratedImage | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const { add, toggleFavorite } = useGallery();
  const enhance = useServerFn(enhancePrompt);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const startProgress = () => {
    setProgress(8);
    timer.current = setInterval(() => {
      setProgress((p) => (p < 92 ? p + Math.max(1, (95 - p) / 14) : p));
    }, 220);
  };
  const stopProgress = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setProgress(100);
  };

  async function generate(overridePrompt?: string) {
    const text = (overridePrompt ?? prompt).trim();
    if (!text) {
      toast.error("Describe your image first");
      return;
    }
    const size = ratios.find((r) => r.id === ratio) ?? ratios[0];
    setLoading(true);
    setCurrent(null);
    startProgress();

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          negativePrompt: negative,
          model,
          width: size.width,
          height: size.height,
        }),
      });
      const json = (await response.json()) as {
        imageUrl?: string;
        modelUsed?: string;
        error?: string;
      };
      if (!response.ok || !json.imageUrl) throw new Error(json.error ?? "Generation failed");

      // Wait for the bytes so the reveal is instant instead of a slow paint.
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Image could not be loaded"));
        img.src = json.imageUrl as string;
      });

      const image: GeneratedImage = {
        id: crypto.randomUUID(),
        url: json.imageUrl,
        prompt: text,
        negativePrompt: negative || undefined,
        model: json.modelUsed ?? "Pixflow Free",
        ratio: size.id,
        width: size.width,
        height: size.height,
        createdAt: Date.now(),
      };
      setCurrent(image);
      add(image);
      toast.success(`Image ready — ${image.model}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      stopProgress();
      setLoading(false);
      setTimeout(() => setProgress(0), 600);
    }
  }

  async function runEnhance() {
    if (!prompt.trim()) {
      toast.error("Write a short idea first, then enhance it");
      return;
    }
    setEnhancing(true);
    try {
      const result = await enhance({ data: { prompt: prompt.trim() } });
      setPrompt(result.prompt);
      toast.success(result.enhanced ? "Prompt enhanced" : "Prompt kept as is");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enhancer unavailable");
    } finally {
      setEnhancing(false);
    }
  }

  const size = ratios.find((r) => r.id === ratio) ?? ratios[0];

  return (
    <div className="mx-auto w-full max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="card-soft p-4 sm:p-5"
      >
        <label htmlFor="prompt" className="sr-only">
          Describe your dream image
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void generate();
          }}
          rows={3}
          placeholder="Describe your dream image..."
          className="w-full resize-none rounded-xl border border-border bg-background/60 p-4 text-base outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary focus:shadow-[0_0_0_4px_oklch(0.62_0.22_295/20%)]"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Shape</span>
          {ratios.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRatio(r.id)}
              aria-pressed={ratio === r.id}
              className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                ratio === r.id
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div>
            <label htmlFor="model" className="sr-only">
              AI model
            </label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void runEnhance()}
              disabled={enhancing}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-60"
            >
              {enhancing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Wand2 className="size-4" />
              )}
              Enhance
            </button>
            <button
              type="button"
              onClick={() => void generate()}
              disabled={loading}
              className="lift inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-brand)] px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {loading ? "Creating..." : "Generate"}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAdvanced((v) => !v)}
          aria-expanded={advanced}
          className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className={`size-3.5 transition-transform ${advanced ? "rotate-180" : ""}`} />
          Negative prompt (what you don't want)
        </button>
        <AnimatePresence initial={false}>
          {advanced ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <label htmlFor="negative" className="sr-only">
                Negative prompt
              </label>
              <input
                id="negative"
                value={negative}
                onChange={(e) => setNegative(e.target.value)}
                placeholder="blurry, watermark, text, extra fingers"
                className="mt-2 w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-4 flex flex-wrap gap-2">
          {quickPrompts.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setPrompt(q)}
              className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {q}
            </button>
          ))}
        </div>

        {progress > 0 ? (
          <div
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Generation progress"
            className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary"
          >
            <div
              className="h-full rounded-full bg-[image:var(--gradient-brand)] transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}
      </motion.div>

      <div className="mt-6" aria-live="polite">
        {loading ? (
          <div
            className="shimmer card-soft grid w-full place-items-center text-muted-foreground"
            style={{ aspectRatio: `${size.width} / ${size.height}` }}
          >
            <div className="flex flex-col items-center gap-2 text-sm">
              <ImageIcon className="size-6 animate-pulse" aria-hidden="true" />
              Painting your idea...
            </div>
          </div>
        ) : null}

        <AnimatePresence>
          {!loading && current ? (
            <ImageCard image={current} onToggleFavorite={toggleFavorite} />
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}