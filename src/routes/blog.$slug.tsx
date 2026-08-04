import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";

import { getPost, posts, type Post } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }): { post: Post } => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article not found | Pixflow AI" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    const url = `/blog/${params.slug}`;
    return {
      meta: [
        { title: `${post.title} | Pixflow AI` },
        { name: "description", content: post.description },
        { name: "keywords", content: post.tags.join(", ") },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            keywords: post.tags.join(", "),
            author: { "@type": "Organization", name: post.author },
            publisher: { "@type": "Organization", name: "Nexcore" },
          }),
        },
      ],
    };
  },
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const share = async () => {
    const url = typeof window === "undefined" ? "" : window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.description, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      /* dismissed */
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All articles
      </Link>

      <article className="mt-6">
        <header>
          <p className="text-xs text-primary">
            {post.category} · {post.readingTime}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{post.title}</h1>
          <p className="mt-3 text-muted-foreground">{post.description}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            By {post.author} ·{" "}
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </p>
        </header>

        <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-muted-foreground">
          {post.body.map((line: string) =>
            line.startsWith("## ") ? (
              <h2 key={line} className="pt-2 text-xl font-semibold text-foreground">
                {line.slice(3)}
              </h2>
            ) : (
              <p key={line}>{line}</p>
            ),
          )}
        </div>

        <footer className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground"
              >
                #{tag}
              </li>
            ))}
          </ul>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => void share()}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-secondary/60"
            >
              <Share2 className="size-4" /> Share
            </button>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied");
              }}
              aria-label="Copy link"
              className="grid size-10 place-items-center rounded-xl border border-border hover:bg-secondary/60"
            >
              <Link2 className="size-4" />
            </button>
          </div>
        </footer>
      </article>

      <section aria-labelledby="related" className="mt-12">
        <h2 id="related" className="text-lg font-semibold">
          Keep reading
        </h2>
        <ul className="mt-4 grid gap-3">
          {related.map((p) => (
            <li key={p.slug}>
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="card-soft lift block p-4 text-sm"
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}