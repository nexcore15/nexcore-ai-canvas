import { Link } from "@tanstack/react-router";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "./theme-toggle";

const nav = [
  { to: "/", label: "Generate" },
  { to: "/gallery", label: "Gallery" },
  { to: "/prompts", label: "Prompts" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="Pixflow AI home">
          <span className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-brand)] text-primary-foreground">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Pixflow <span className="gradient-text">AI</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              activeProps={{ className: "bg-secondary/70 text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-secondary/50 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav aria-label="Mobile" className="border-t border-border/60 px-4 py-2 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}