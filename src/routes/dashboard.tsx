import { Link, createFileRoute } from "@tanstack/react-router";
import { Coins, ImageIcon, Sparkles, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { pageMeta } from "@/components/site/page";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  head: () =>
    pageMeta({
      title: "Dashboard — Credits & History | Pixflow AI",
      description:
        "See your Pixflow AI credit balance, your generation history and manage or delete past creations.",
      path: "/dashboard",
    }),
  component: Dashboard,
});

type Row = {
  id: string;
  prompt: string;
  style: string | null;
  quality: string | null;
  engine: string | null;
  kind: string;
  created_at: string;
};

function Dashboard() {
  const { user, profile, loading, isStaff, refresh } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("generations")
      .select("id,prompt,style,quality,engine,kind,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);
    setRows((data ?? []) as Row[]);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(id: string) {
    const { error } = await supabase.from("generations").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
    toast.success("Removed from history");
  }

  async function clearAll() {
    if (!user) return;
    const { error } = await supabase.from("generations").delete().eq("user_id", user.id);
    if (error) return toast.error(error.message);
    setRows([]);
    toast.success("History cleared");
  }

  if (loading) {
    return <main className="mx-auto max-w-5xl px-4 py-20 text-muted-foreground">Loading…</main>;
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Sign in to see your dashboard</h1>
        <Link
          to="/auth"
          className="press mt-6 inline-flex rounded-xl bg-[image:var(--gradient-brand)] px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Sign in
        </Link>
      </main>
    );
  }

  const stats = [
    { Icon: Coins, label: "Credits left", value: profile?.credits ?? 0 },
    { Icon: ImageIcon, label: "Images created", value: rows.length },
    {
      Icon: Sparkles,
      label: "AI edits",
      value: rows.filter((r) => r.kind === "edit").length,
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Hi, {profile?.display_name ?? user.email}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your credits, your history — everything synced to your account.
          </p>
        </div>
        <div className="flex gap-2">
          {isStaff ? (
            <Link
              to="/admin"
              className="press rounded-xl border border-border px-4 py-2 text-sm hover:bg-secondary/60"
            >
              Admin panel
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => void refresh()}
            className="press rounded-xl border border-border px-4 py-2 text-sm hover:bg-secondary/60"
          >
            Refresh
          </button>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map(({ Icon, label, value }) => (
          <div key={label} className="glass tilt-3d p-5">
            <Icon className="size-5 text-primary" aria-hidden="true" />
            <p className="mt-3 text-3xl font-extrabold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">History</h2>
          {rows.length > 0 ? (
            <button
              type="button"
              onClick={() => void clearAll()}
              className="press rounded-xl border border-border px-3 py-1.5 text-xs hover:bg-secondary/60"
            >
              Clear all
            </button>
          ) : null}
        </div>
        {rows.length === 0 ? (
          <p className="glass p-8 text-center text-sm text-muted-foreground">
            No generations yet. Create your first image on the home page.
          </p>
        ) : (
          <ul className="space-y-2">
            {rows.map((row) => (
              <li key={row.id} className="glass flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{row.prompt}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(row.created_at).toLocaleString()} · {row.style ?? "—"} ·{" "}
                    {row.quality ?? "—"} · {row.engine ?? "Pixflow"}
                    {row.kind === "edit" ? " · edit" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void remove(row.id)}
                  aria-label="Delete from history"
                  className="press rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}