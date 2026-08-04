import { Link } from "@tanstack/react-router";
import { Github, Instagram, Sparkles, Twitter } from "lucide-react";

const groups = [
  {
    title: "Product",
    links: [
      { to: "/", label: "Image Generator" },
      { to: "/gallery", label: "Gallery" },
      { to: "/prompts", label: "Prompt Library" },
      { to: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/contact", label: "Contact" },
      { to: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms of Service" },
      { to: "/cookies", label: "Cookie Policy" },
      { to: "/disclaimer", label: "Disclaimer" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-[image:var(--gradient-brand)] text-primary-foreground">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <span className="font-semibold">Pixflow AI</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Free AI image generation for everyone. Built by Nexcore — no sign-up, no
            watermarks, no nonsense.
          </p>
          <div className="mt-4 flex gap-2">
            {[
              { Icon: Twitter, label: "Twitter" },
              { Icon: Instagram, label: "Instagram" },
              { Icon: Github, label: "GitHub" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="/contact"
                aria-label={`Pixflow AI on ${label}`}
                className="grid size-9 place-items-center rounded-xl border border-border bg-secondary/40 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {groups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-sm font-semibold">{group.title}</h2>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border/60 px-4 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Pixflow AI by Nexcore. All rights reserved.
      </div>
    </footer>
  );
}