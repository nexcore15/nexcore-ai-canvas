import type { ReactNode } from "react";

/** Shared shell + typography for the content/legal pages. */
export function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {intro ? <p className="mt-3 text-muted-foreground">{intro}</p> : null}
      </header>
      <div className="prose-pixflow mt-8 space-y-5 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </main>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

/** Builds the standard per-route head() metadata. */
export function pageMeta(opts: { title: string; description: string; path: string }) {
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:url", content: opts.path },
      { name: "twitter:title", content: opts.title },
      { name: "twitter:description", content: opts.description },
    ],
    links: [{ rel: "canonical", href: opts.path }],
  };
}