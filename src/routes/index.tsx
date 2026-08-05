import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Gauge, Lock, Sparkles, Wand2 } from "lucide-react";

import { Generator } from "@/components/site/generator";
import { ImageCard } from "@/components/site/image-card";
import { useGallery } from "@/lib/gallery";
import showcase1 from "@/assets/showcase-1.jpg";
import showcase2 from "@/assets/showcase-2.jpg";
import showcase3 from "@/assets/showcase-3.jpg";
import showcase4 from "@/assets/showcase-4.jpg";

const title = "Pixflow AI — Free AI Image Generator, No Sign-Up";
const description =
  "Turn any idea into a stunning image in seconds. Free forever, no account, no watermark. Built by Nexcore.";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    prompt: typeof search["prompt"] === "string" ? (search["prompt"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const features = [
  { Icon: Sparkles, title: "Free forever", text: "Unlimited generations, no card, no watermark." },
  { Icon: Wand2, title: "Gemini prompt brain", text: "Every idea is rewritten into a pro prompt." },
  { Icon: Gauge, title: "Seconds, not minutes", text: "Turbo engine renders while you blink." },
  { Icon: Lock, title: "Private by default", text: "Keys stay server-side, images stay yours." },
];

const showcase = [
  { src: showcase1, w: 768, h: 1024, label: "Photoreal portrait", style: "Realistic" },
  { src: showcase2, w: 1024, h: 1024, label: "Crystal prism render", style: "3D" },
  { src: showcase3, w: 1344, h: 768, label: "Neon city at night", style: "Cinematic" },
  { src: showcase4, w: 1024, h: 1024, label: "Astronaut cat", style: "Cartoon" },
];

function Index() {
  const { items, toggleFavorite } = useGallery();
  const { prompt } = Route.useSearch();
  const recent = items.slice(0, 6);

  return (
    <main>
      <section className="relative overflow-hidden px-4 pt-14 pb-10 sm:pt-20">
        <div
          aria-hidden="true"
          className="float-slow pointer-events-none absolute -top-40 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        />
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground"
          >
            <Sparkles className="size-3.5 text-primary" aria-hidden="true" /> A Nexcore product
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl"
          >
            Turn words into <span className="gradient-text">art</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Type an idea, press Generate. Free AI image generation for everyone — no sign-up,
            no watermarks, no learning curve.
          </motion.p>
        </div>

        <div className="mt-8">
          <Generator key={prompt ?? "new"} initialPrompt={prompt ?? ""} />
        </div>
      </section>

      <section aria-labelledby="why" className="mx-auto max-w-6xl px-4 py-12">
        <h2 id="why" className="sr-only">
          Why Pixflow AI
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ Icon, title: t, text }, i) => (
            <motion.article
              key={t}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06 }}
              className="card-soft lift p-5"
            >
              <Icon className="size-5 text-primary" aria-hidden="true" />
              <h3 className="mt-3 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section aria-labelledby="showcase" className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center">
          <h2 id="showcase" className="text-2xl font-bold tracking-tight sm:text-3xl">
            Made with <span className="gradient-text">Pixflow AI</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Real renders straight out of the engine — photoreal, 3D, cinematic and cartoon.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {showcase.map((item, i) => (
            <motion.figure
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60"
            >
              <img
                src={item.src}
                alt={`${item.label} generated with Pixflow AI`}
                width={item.w}
                height={item.h}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-background to-transparent p-3 text-xs text-foreground">
                <span className="font-medium">{item.label}</span>
                <span className="rounded-full bg-secondary/70 px-2 py-0.5 backdrop-blur-sm">
                  {item.style}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {recent.length > 0 ? (
        <section aria-labelledby="recent" className="mx-auto max-w-6xl px-4 pb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="recent" className="text-2xl font-bold tracking-tight">
              Your recent creations
            </h2>
            <Link to="/gallery" className="text-sm text-primary hover:underline">
              View gallery
            </Link>
          </div>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {recent.map((image) => (
              <ImageCard key={image.id} image={image} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="how" className="mx-auto max-w-6xl px-4 py-12">
        <h2 id="how" className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Three steps. That's it.
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Describe it", "Write anything — 'a cute cat astronaut' works fine."],
            ["Pick a shape", "Square for profiles, wide for wallpapers, tall for phones."],
            ["Download", "Save as PNG, JPG or WebP. Yours to use."],
          ].map(([t, text], i) => (
            <li key={t} className="card-soft p-6">
              <span className="gradient-text text-3xl font-extrabold">{i + 1}</span>
              <h3 className="mt-2 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
