import { Link } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Menu, Shield, X } from "lucide-react";
import { useState } from "react";

import { PixflowMark, PixflowWordmark } from "../brand/logo";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/lib/auth";

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
  const { user, isStaff, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/60 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link to="/" search={{}} className="flex items-center gap-2" aria-label="Pixflow AI home">
          <PixflowMark className="size-9" />
          <PixflowWordmark />
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
          {user ? (
            <>
              {isStaff ? (
                <Link
                  to="/admin"
                  aria-label="Admin panel"
                  className="press hidden size-9 items-center justify-center rounded-xl border border-border bg-secondary/50 sm:inline-flex"
                >
                  <Shield className="size-4" />
                </Link>
              ) : null}
              <Link
                to="/dashboard"
                aria-label="Dashboard"
                className="press hidden size-9 items-center justify-center rounded-xl border border-border bg-secondary/50 sm:inline-flex"
              >
                <LayoutDashboard className="size-4" />
              </Link>
              <button
                type="button"
                onClick={() => void signOut()}
                aria-label="Sign out"
                className="press hidden size-9 items-center justify-center rounded-xl border border-border bg-secondary/50 sm:inline-flex"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="press hidden rounded-xl bg-[image:var(--gradient-brand)] px-4 py-2 text-sm font-semibold text-primary-foreground sm:inline-flex"
            >
              Sign in
            </Link>
          )}
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
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              {isStaff ? (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  Admin panel
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void signOut();
                }}
                className="block w-full rounded-lg px-3 py-3 text-left text-sm text-muted-foreground hover:text-foreground"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm text-primary"
            >
              Sign in
            </Link>
          )}
        </nav>
      ) : null}
    </header>
  );
}