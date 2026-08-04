import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { pageMeta } from "@/components/site/page";
import { categories, posts } from "@/lib/blog";

export const Route = createFileRoute("/blog/")({
  head: () =>
    pageMeta({
      title: "Blog — AI Image Generation Tips & Guides | Pixflow AI",
      description:
        "Guides on prompt writing, aspect ratios, negative prompts, AI art copyright and getting better results from free AI image generators.",
      path: "/blog",
    }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-14">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          The Pixflow <span className="gradient-text">blog</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Practical guides on prompting, composition and making AI images you actually want to
          publish.
        </p>
        <ul className="mt-5 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <li
              key={c}
              className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground"
            >
              {c}
            </li>
          ))}
        </ul>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {posts.map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: Math.min(i, 6) * 0.05 }}
            className="card-soft lift p-6"
          >
            <p className="text-xs text-primary">
              {post.category} · {post.readingTime}
            </p>
            <h2 className="mt-2 text-lg font-semibold">
              <Link to="/blog/$slug" params={{ slug: post.slug }} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>{" "}
              · {post.author}
            </p>
          </motion.article>
        ))}
      </section>
    </main>
  );
}