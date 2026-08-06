import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  credits: number;
};

export type Role = "owner" | "admin" | "user";

export const ADMIN_SECTIONS = [
  { id: "users", label: "Users" },
  { id: "generations", label: "Generations" },
  { id: "credits", label: "Credits" },
  { id: "roles", label: "Roles & access" },
] as const;

type AuthState = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: Role[];
  permissions: string[];
  loading: boolean;
  isOwner: boolean;
  isStaff: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      setRoles([]);
      setPermissions([]);
      return;
    }
    const [p, r, perms] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("admin_permissions").select("section").eq("user_id", userId),
    ]);
    setProfile((p.data as Profile | null) ?? null);
    setRoles(((r.data ?? []) as { role: Role }[]).map((x) => x.role));
    setPermissions(((perms.data ?? []) as { section: string }[]).map((x) => x.section));
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      void load(next?.user?.id).finally(() => setLoading(false));
    });
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      void load(data.session?.user?.id).finally(() => setLoading(false));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(() => {
    const isOwner = roles.includes("owner");
    return {
      user: session?.user ?? null,
      session,
      profile,
      roles,
      permissions,
      loading,
      isOwner,
      isStaff: isOwner || roles.includes("admin"),
      refresh: () => load(session?.user?.id),
      signOut: async () => {
        await supabase.auth.signOut();
        setProfile(null);
        setRoles([]);
        setPermissions([]);
      },
    };
  }, [session, profile, roles, permissions, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}