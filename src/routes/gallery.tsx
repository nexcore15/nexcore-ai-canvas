import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { ImageCard } from "@/components/site/image-card";
import { pageMeta } from "@/components/site/page";
import { useGallery } from "@/lib/gallery";

export const Route = createFileRoute("/gallery")({
  head: () =>
    pageMeta({
      title: "Gallery — Your AI Images | Pixflow AI",
      description:
        "Browse, favourite, download and regenerate every image you have created with Pixflow AI.",
      path: "/gallery",
    }),
  component: GalleryPage,
});

function GalleryPage() {
  const { items, toggleFavorite, remove, clear } = useGallery();
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [visible, setVisible] = useState(24);
  const navigate = useNavigate();

  const filtered = onlyFavorites ? items.filter((i) => i.favorite) : items;
  const shown = filtered.slice(0, visible);

  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Your gallery</h1>
          <p className="mt-2 text-muted-foreground">
            {items.length} image{items.length === 1 ? "" : "s"} saved on this device.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOnlyFavorites((v) => !v)}
            aria-pressed={onlyFavorites}
            className={`rounded-xl border px-4 py-2 text-sm transition-colors ${
              onlyFavorites ? "border-primary bg-primary/15" : "border-border hover:bg-secondary/60"
            }`}
          >
            Favourites
          </button>
          {items.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="rounded-xl border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary/60"
            >
              Clear all
            </button>
          ) : null}
        </div>
      </header>

      {shown.length === 0 ? (
        <p className="card-soft mt-10 p-10 text-center text-muted-foreground">
          Nothing here yet. Generate your first image on the home page.
        </p>
      ) : (
        <>
          <section className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {shown.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onToggleFavorite={toggleFavorite}
                onRemove={remove}
                onRegenerate={(img) => navigate({ to: "/", search: { prompt: img.prompt } })}
              />
            ))}
          </section>
          {visible < filtered.length ? (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + 24)}
                className="lift rounded-xl bg-[image:var(--gradient-brand)] px-6 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Load more
              </button>
            </div>
          ) : null}
        </>
      )}
    </main>
  );
}