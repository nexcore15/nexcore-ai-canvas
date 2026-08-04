import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Gauge, Lock, Sparkles, Wand2 } from "lucide-react";

import { Generator } from "@/components/site/generator";
import { ImageCard } from "@/components/site/image-card";
import { useGallery } from "@/lib/gallery";

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
  { Icon: Wand2, title: "Prompt enhancer", text: "One tap turns a short idea into a pro prompt." },
  { Icon: Gauge, title: "Seconds, not minutes", text: "Turbo engine renders while you blink." },
  { Icon: Lock, title: "Private by default", text: "Keys stay server-side, images stay yours." },
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
