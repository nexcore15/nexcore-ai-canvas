import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";

import { Generator } from "@/components/site/generator";
import { pageMeta } from "@/components/site/page";
import { promptCategories, promptLibrary, type PromptCategory } from "@/lib/prompts";

export const Route = createFileRoute("/prompts")({
  head: () =>
    pageMeta({
      title: "Prompt Library — 50+ Free AI Image Prompts | Pixflow AI",
      description:
        "A curated library of 50+ trending AI image prompts across portrait, landscape, fantasy, abstract, 3D and anime. Tap any prompt to generate it instantly.",
      path: "/prompts",
    }),
  component: PromptsPage,
});

function PromptsPage() {
  const [category, setCategory] = useState<PromptCategory | "All">("All");
  const [selected, setSelected] = useState("");

  const list =
    category === "All" ? promptLibrary : promptLibrary.filter((p) => p.category === category);

  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Prompt <span className="gradient-text">library</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Tap a prompt to load it into the generator below, then tweak it however you like.
        </p>
      </header>

      <div className="mt-8">
        <Generator key={selected} initialPrompt={selected} />
      </div>

      <nav aria-label="Prompt categories" className="mt-12 flex flex-wrap justify-center gap-2">
        {(["All", ...promptCategories] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              category === c
                ? "border-primary bg-primary/15 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </nav>

      <section aria-label="Prompts" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <motion.button
            key={p.text}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i, 12) * 0.02 }}
            onClick={() => {
              setSelected(p.text);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="card-soft lift p-4 text-left"
          >
            <span className="text-xs text-primary">{p.category}</span>
            <p className="mt-1 text-sm text-foreground">{p.text}</p>
          </motion.button>
        ))}
      </section>
    </main>
  );
}