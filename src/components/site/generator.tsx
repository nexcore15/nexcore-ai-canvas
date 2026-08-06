import { AnimatePresence, motion } from "framer-motion";
import { Aperture, Loader2, Sparkles, Upload, Wand2, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ImageCard } from "@/components/site/image-card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useGallery, type GeneratedImage } from "@/lib/gallery";
import { quickPrompts } from "@/lib/prompts";
import styleRealistic from "@/assets/style-realistic.png";
import style3d from "@/assets/style-3d.png";
import style2d from "@/assets/style-2d.png";
import styleCartoon from "@/assets/style-cartoon.png";

/** Aspect ratios offered to the user, mapped to generation dimensions. */
const ratios = [
  { id: "1:1", label: "Square", hint: "1:1", width: 1024, height: 1024 },
  { id: "16:9", label: "Wide", hint: "16:9", width: 1344, height: 768 },
  { id: "9:16", label: "Phone", hint: "9:16", width: 768, height: 1344 },
  { id: "4:3", label: "Classic", hint: "4:3", width: 1152, height: 864 },
  { id: "3:4", label: "Portrait", hint: "3:4", width: 864, height: 1152 },
] as const;

const styles = [
  { id: "realistic", label: "Realistic", art: styleRealistic, note: "Photoreal" },
  { id: "3d", label: "3D", art: style3d, note: "Rendered" },
  { id: "2d", label: "2D", art: style2d, note: "Illustration" },
  { id: "cartoon", label: "Cartoon", art: styleCartoon, note: "Playful" },
] as const;

const qualities = [
  { id: "hd", label: "HD", note: "Fast · sharp", Icon: Zap },
  { id: "ultra", label: "Ultra", note: "Slower · finest detail", Icon: Aperture },
] as const;

export function Generator({ initialPrompt = "" }: { initialPrompt?: string }) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [style, setStyle] = useState<string>("realistic");
  const [quality, setQuality] = useState<string>("hd");
  const [ratio, setRatio] = useState<string>("1:1");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState<GeneratedImage | null>(null);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [upload, setUpload] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const { add, toggleFavorite } = useGallery();
  const { user, refresh } = useAuth();

  /** Records a generation against the signed-in account and spends one credit. */
  async function track(image: GeneratedImage, kind: "generate" | "edit") {
    if (!user) return;
    try {
      await supabase.from("generations").insert({
        user_id: user.id,
        prompt: image.prompt,
        final_prompt: image.enhancedPrompt ?? null,
        style: image.style ?? null,
        quality: image.quality ?? null,
        width: image.width,
        height: image.height,
        engine: image.model,
        kind,
      });
      await supabase.rpc("spend_credit", { _amount: 1 });
      await refresh();
    } catch {
      /* history sync is best-effort — never block the image */
    }
  }

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  const startProgress = () => {
    setProgress(6);
    setStage("Gemini is reading your idea…");
    timer.current = setInterval(() => {
      setProgress((p) => {
        const next = p < 94 ? p + Math.max(0.7, (96 - p) / 22) : p;
        if (next > 26) setStage("Composing a detailed prompt…");
        if (next > 52) setStage("Rendering your image…");
        if (next > 82) setStage("Polishing the final details…");
        return next;
      });
    }, 220);
  };
  const stopProgress = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setProgress(100);
  };

  const size = ratios.find((r) => r.id === ratio) ?? ratios[0];

  const preload = (url: string) =>
    new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = url;
    });

  async function generate() {
    const text = prompt.trim();
    if (!text) {
      toast.error("Describe your image first");
      return;
    }
    setLoading(true);
    setCurrent(null);
    startProgress();

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          style,
          quality,
          width: size.width,
          height: size.height,
        }),
      });
      const json = (await response.json()) as {
        imageUrl?: string;
        modelUsed?: string;
        finalPrompt?: string;
        error?: string;
      };
      if (!response.ok || !json.imageUrl) throw new Error(json.error ?? "Generation failed");

      await preload(json.imageUrl);

      const image: GeneratedImage = {
        id: crypto.randomUUID(),
        url: json.imageUrl,
        prompt: text,
        enhancedPrompt: json.finalPrompt,
        style,
        quality,
        model: json.modelUsed ?? "Pixflow",
        ratio: size.id,
        width: size.width,
        height: size.height,
        createdAt: Date.now(),
      };
      setCurrent(image);
      add(image);
      void track(image, "generate");
      toast.success(`Image ready — ${image.model}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      stopProgress();
      setLoading(false);
      setStage("");
      setTimeout(() => setProgress(0), 700);
    }
  }

  async function applyEdit() {
    const instruction = editText.trim();
    const source = current?.url ?? upload;
    if (!source || !instruction) return;
    setEditing(true);
    try {
      const response = await fetch("/api/edit-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: source, instruction }),
      });
      const json = (await response.json()) as {
        imageUrl?: string;
        modelUsed?: string;
        error?: string;
      };
      if (!response.ok || !json.imageUrl) throw new Error(json.error ?? "Edit failed");
      await preload(json.imageUrl);

      const edited: GeneratedImage = {
        ...(current ?? {
          style,
          quality,
          ratio: size.id,
          width: size.width,
          height: size.height,
        }),
        id: crypto.randomUUID(),
        url: json.imageUrl,
        prompt: current ? `${current.prompt} — ${instruction}` : `Uploaded photo — ${instruction}`,
        model: json.modelUsed ?? current?.model ?? "Pixflow",
        createdAt: Date.now(),
      } as GeneratedImage;
      setCurrent(edited);
      add(edited);
      setUpload(null);
      void track(edited, "edit");
      setEditText("");
      toast.success("Edit applied");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Edit failed");
    } finally {
      setEditing(false);
    }
  }

  function pickFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 8_000_000) {
      toast.error("Please choose an image under 8 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUpload(String(reader.result));
      setCurrent(null);
      toast.success("Photo added — describe the change below");
    };
    reader.readAsDataURL(file);
  }

  const chip =
    "press relative flex items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-sm";
  const chipOn = "border-transparent bg-[image:var(--gradient-brand-soft)] text-foreground";
  const chipOff = "border-border/70 text-muted-foreground hover:text-foreground";

  return (
    <div className="mx-auto w-full max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass gradient-border noise p-4 sm:p-6"
      >
        <label htmlFor="prompt" className="sr-only">
          Describe your dream image
        </label>
        <div className="relative">
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void generate();
            }}
            rows={3}
            placeholder="Describe anything — Gemini turns it into a pro prompt for you…"
            className="w-full resize-none rounded-2xl border border-border/70 bg-background/50 p-4 text-base outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary/70 focus:shadow-[0_0_0_4px_oklch(0.66_0.24_296/18%)]"
          />
          <span className="pointer-events-none absolute right-3 bottom-3 hidden text-[11px] text-muted-foreground sm:block">
            ⌘/Ctrl + ↵
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <fieldset>
            <legend className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Style
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {styles.map(({ id, label, Icon, note }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setStyle(id)}
                  aria-pressed={style === id}
                  className={`${chip} ${style === id ? chipOn : chipOff}`}
                >
                  <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-left leading-tight">
                    {label}
                    <span className="block text-[11px] opacity-70">{note}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Quality
            </legend>
            <div className="grid gap-2">
              {qualities.map(({ id, label, note, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setQuality(id)}
                  aria-pressed={quality === id}
                  className={`${chip} justify-between ${quality === id ? chipOn : chipOff}`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="size-4 text-accent" aria-hidden="true" />
                    <span className="font-medium">{label}</span>
                  </span>
                  <span className="text-[11px] opacity-70">{note}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <fieldset className="mt-4">
          <legend className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Shape
          </legend>
          <div className="flex flex-wrap gap-2">
            {ratios.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRatio(r.id)}
                aria-pressed={ratio === r.id}
                className={`press rounded-xl border px-3 py-2 text-xs ${
                  ratio === r.id ? chipOn : chipOff
                }`}
              >
                {r.label} <span className="opacity-60">{r.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={() => void generate()}
          disabled={loading}
          className="press mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[image:var(--gradient-brand)] px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Wand2 className="size-4" />
          )}
          {loading ? "Creating…" : "Generate image"}
        </button>

        <div className="mt-4 flex flex-wrap gap-2">
          {quickPrompts.slice(0, 6).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setPrompt(q)}
              className="glass-soft press rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {q}
            </button>
          ))}
        </div>

        {progress > 0 ? (
          <div className="mt-4">
            <div
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Generation progress"
              className="h-1.5 overflow-hidden rounded-full bg-secondary/70"
            >
              <div
                className="h-full rounded-full bg-[image:var(--gradient-brand)] transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            {stage ? <p className="mt-2 text-xs text-muted-foreground">{stage}</p> : null}
          </div>
        ) : null}
      </motion.div>

      <div className="mt-6" aria-live="polite">
        {loading ? (
          <div
            className="shimmer glass grid w-full place-items-center text-muted-foreground"
            style={{ aspectRatio: `${size.width} / ${size.height}` }}
          >
            <div className="flex flex-col items-center gap-3 text-sm">
              <Sparkles className="size-6 animate-pulse text-primary" aria-hidden="true" />
              {stage || "Painting your idea…"}
            </div>
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          {!loading && current ? (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ImageCard image={current} onToggleFavorite={toggleFavorite} />

              <div className="glass gradient-border mt-4 p-4">
                <p className="text-sm font-medium">Tweak it with AI</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Type a change — “make it night”, “add sunglasses”, “warmer colours”.
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <label htmlFor="edit" className="sr-only">
                    Edit instruction
                  </label>
                  <input
                    id="edit"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void applyEdit();
                    }}
                    placeholder="What should change?"
                    className="flex-1 rounded-xl border border-border/70 bg-background/50 px-3 py-2.5 text-sm outline-none focus:border-primary/70"
                  />
                  <button
                    type="button"
                    onClick={() => void applyEdit()}
                    disabled={editing || !editText.trim()}
                    className="press inline-flex items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-brand)] px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    {editing ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Wand2 className="size-4" />
                    )}
                    Apply edit
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
