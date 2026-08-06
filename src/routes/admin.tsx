import { Link, createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { pageMeta } from "@/components/site/page";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_SECTIONS, useAuth, type Role } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    ...pageMeta({
      title: "Admin panel — Pixflow AI",
      description: "Owner and admin control centre for Pixflow AI users, credits and activity.",
      path: "/admin",
    }),
    meta: [
      ...pageMeta({
        title: "Admin panel — Pixflow AI",
        description: "Owner and admin control centre for Pixflow AI users, credits and activity.",
        path: "/admin",
      }).meta,
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  credits: number;
  created_at: string;
};
type RoleRow = { user_id: string; role: Role };
type PermRow = { user_id: string; section: string };
type GenRow = {
  id: string;
  user_id: string;
  prompt: string;
  style: string | null;
  engine: string | null;
  kind: string;
  created_at: string;
};

function AdminPage() {
  const { loading, isStaff, isOwner, permissions, user } = useAuth();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [perms, setPerms] = useState<PermRow[]>([]);
  const [gens, setGens] = useState<GenRow[]>([]);

  const load = useCallback(async () => {
    if (!isStaff) return;
    const [p, r, pm, g] = await Promise.all([
      supabase
        .from("profiles")
        .select("id,email,display_name,credits,created_at")
        .order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id,role"),
      supabase.from("admin_permissions").select("user_id,section"),
      supabase
        .from("generations")
        .select("id,user_id,prompt,style,engine,kind,created_at")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);
    setProfiles((p.data ?? []) as ProfileRow[]);
    setRoles((r.data ?? []) as RoleRow[]);
    setPerms((pm.data ?? []) as PermRow[]);
    setGens((g.data ?? []) as GenRow[]);
  }, [isStaff]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(
    () => ADMIN_SECTIONS.filter((s) => isOwner || permissions.includes(s.id)),
    [isOwner, permissions],
  );
  const [tab, setTab] = useState<string>("users");
  useEffect(() => {
    if (visible.length && !visible.some((v) => v.id === tab)) setTab(visible[0]!.id);
  }, [visible, tab]);

  const roleOf = (id: string): Role =>
    roles.find((r) => r.user_id === id && r.role === "owner")
      ? "owner"
      : roles.find((r) => r.user_id === id && r.role === "admin")
        ? "admin"
        : "user";

  async function setRole(userId: string, role: Role) {
    await supabase.from("user_roles").delete().eq("user_id", userId).neq("role", "owner");
    if (role !== "user") {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) {
        toast.error(error.message);
        return;
      }
    }
    if (role !== "admin") await supabase.from("admin_permissions").delete().eq("user_id", userId);
    toast.success("Role updated");
    void load();
  }

  async function togglePerm(userId: string, section: string, on: boolean) {
    if (on) {
      const { error } = await supabase.from("admin_permissions").insert({ user_id: userId, section });
      if (error) {
        toast.error(error.message);
        return;
      }
    } else {
      await supabase
        .from("admin_permissions")
        .delete()
        .eq("user_id", userId)
        .eq("section", section);
    }
    void load();
  }

  async function setCredits(userId: string, credits: number) {
    const { error } = await supabase.from("profiles").update({ credits }).eq("id", userId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Credits updated");
    void load();
  }

  if (loading) {
    return <main className="mx-auto max-w-6xl px-4 py-20 text-muted-foreground">Loading…</main>;
  }

  if (!user || !isStaff) {
    return (
      <main className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Restricted area</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only the Pixflow owner and approved admins can open this panel.
        </p>
        <Link
          to="/"
          className="press mt-6 inline-flex rounded-xl bg-[image:var(--gradient-brand)] px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Back home
        </Link>
      </main>
    );
  }

  const name = (id: string) =>
    profiles.find((p) => p.id === id)?.display_name ??
    profiles.find((p) => p.id === id)?.email ??
    id.slice(0, 8);

  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Admin panel</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isOwner
            ? "You are the owner — you see everything and decide what each admin can see."
            : "You see only the sections the owner granted you."}
        </p>
      </header>

      <nav className="mt-6 flex flex-wrap gap-2">
        {visible.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setTab(s.id)}
            aria-pressed={tab === s.id}
            className={`press rounded-xl border px-4 py-2 text-sm ${
              tab === s.id
                ? "border-transparent bg-[image:var(--gradient-brand-soft)]"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {visible.length === 0 ? (
        <p className="glass mt-8 p-8 text-center text-sm text-muted-foreground">
          The owner has not granted you access to any section yet.
        </p>
      ) : null}

      {tab === "users" && visible.some((v) => v.id === "users") ? (
        <section className="glass mt-6 overflow-x-auto p-4">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted-foreground uppercase">
              <tr>
                <th className="p-2">User</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Credits</th>
                <th className="p-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-t border-border/60">
                  <td className="p-2">{p.display_name ?? "—"}</td>
                  <td className="p-2 text-muted-foreground">{p.email}</td>
                  <td className="p-2">{roleOf(p.id)}</td>
                  <td className="p-2">{p.credits}</td>
                  <td className="p-2 text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {tab === "generations" && visible.some((v) => v.id === "generations") ? (
        <section className="glass mt-6 overflow-x-auto p-4">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted-foreground uppercase">
              <tr>
                <th className="p-2">User</th>
                <th className="p-2">Prompt</th>
                <th className="p-2">Style</th>
                <th className="p-2">Engine</th>
                <th className="p-2">When</th>
              </tr>
            </thead>
            <tbody>
              {gens.map((g) => (
                <tr key={g.id} className="border-t border-border/60">
                  <td className="p-2">{name(g.user_id)}</td>
                  <td className="max-w-md truncate p-2">{g.prompt}</td>
                  <td className="p-2">{g.style ?? "—"}</td>
                  <td className="p-2 text-muted-foreground">{g.engine ?? "—"}</td>
                  <td className="p-2 text-muted-foreground">
                    {new Date(g.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {gens.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No generations recorded yet.</p>
          ) : null}
        </section>
      ) : null}

      {tab === "credits" && visible.some((v) => v.id === "credits") ? (
        <section className="glass mt-6 p-4">
          <ul className="space-y-2">
            {profiles.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 border-b border-border/60 py-2">
                <span className="min-w-0 flex-1 truncate text-sm">{p.email}</span>
                <span className="text-sm text-muted-foreground">{p.credits} credits</span>
                {isOwner ? (
                  <>
                    <button
                      type="button"
                      onClick={() => void setCredits(p.id, p.credits + 100)}
                      className="press rounded-lg border border-border px-3 py-1 text-xs"
                    >
                      +100
                    </button>
                    <button
                      type="button"
                      onClick={() => void setCredits(p.id, 0)}
                      className="press rounded-lg border border-border px-3 py-1 text-xs"
                    >
                      Reset
                    </button>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "roles" && visible.some((v) => v.id === "roles") ? (
        <section className="glass mt-6 p-4">
          {!isOwner ? (
            <p className="text-sm text-muted-foreground">Only the owner can change roles.</p>
          ) : null}
          <ul className="space-y-4">
            {profiles.map((p) => {
              const role = roleOf(p.id);
              return (
                <li key={p.id} className="border-b border-border/60 pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="min-w-0 flex-1 truncate text-sm">{p.email}</span>
                    {isOwner && role !== "owner" ? (
                      <select
                        value={role}
                        onChange={(e) => void setRole(p.id, e.target.value as Role)}
                        className="rounded-lg border border-border bg-background/60 px-2 py-1 text-xs"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      <span className="text-xs text-muted-foreground">{role}</span>
                    )}
                  </div>
                  {isOwner && role === "admin" ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {ADMIN_SECTIONS.map((s) => {
                        const on = perms.some((x) => x.user_id === p.id && x.section === s.id);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => void togglePerm(p.id, s.id, !on)}
                            aria-pressed={on}
                            className={`press rounded-lg border px-3 py-1 text-xs ${
                              on
                                ? "border-transparent bg-[image:var(--gradient-brand-soft)]"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </main>
  );
}