"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./AuthNavigation.module.css";

type SessionResponse = {
  success: boolean;
  user?: { email?: string } | null;
};

async function fetchSession(): Promise<SessionResponse> {
  const res = await fetch("/api/auth/session", { credentials: "include" });

  if (res.status === 401 || res.status === 403) {
    return { success: false, user: null };
  }
  if (!res.ok) throw new Error("Session request failed");

  return res.json();
}

async function logoutRequest() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}

export default function AuthNavigation() {
  const router = useRouter();
  const qc = useQueryClient();

  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["session"] });
      router.push("/sign-in");
    },
  });

  if (isLoading) return null;

  const authed = Boolean(session?.success);

  return (
    <ul className={css.navigationList}>
      {authed ? (
        <>
          <li className={css.navigationItem}>
            <Link href="/profile" className={css.navigationLink}>
              Profile
            </Link>
          </li>

          <li className={css.navigationItem}>
            <p className={css.userEmail}>{session?.user?.email}</p>
            <button
              type="button"
              className={css.logoutButton}
              onClick={() => logoutMutation.mutate()}
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link href="/sign-in" className={css.navigationLink}>
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link href="/sign-up" className={css.navigationLink}>
              Sign up
            </Link>
          </li>
        </>
      )}
    </ul>
  );
}
