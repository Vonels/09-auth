"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";

type Props = { children: ReactNode };

const PRIVATE_PREFIXES = ["/profile", "/notes"];
const PUBLIC_ONLY_PREFIXES = ["/login", "/register"];

function startsWithAny(path: string, prefixes: string[]) {
  return prefixes.some((p) => path === p || path.startsWith(p + "/"));
}

async function fetchSession() {
  const res = await fetch("/api/auth/session", { credentials: "include" });
  if (!res.ok) throw new Error("No session");
  return res.json();
}

async function logoutRequest() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const isPrivate = useMemo(
    () => startsWithAny(pathname, PRIVATE_PREFIXES),
    [pathname]
  );
  const isPublicOnly = useMemo(
    () => startsWithAny(pathname, PUBLIC_ONLY_PREFIXES),
    [pathname]
  );

  const {
    data: session,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: isPrivate || isPublicOnly,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
  });

  useEffect(() => {
    if (isPrivate) refetch();
  }, [isPrivate, pathname, refetch]);

  const authed = !!session && !isError;

  useEffect(() => {
    if (!isLoading && !isFetching && isPrivate && !authed) {
      logoutMutation.mutate();
      router.replace("/login");
    }
  }, [isLoading, isFetching, isPrivate, authed, router, logoutMutation]);

  useEffect(() => {
    if (!isLoading && !isFetching && isPublicOnly && authed) {
      router.replace("/profile");
    }
  }, [isLoading, isFetching, isPublicOnly, authed, router]);

  if ((isPrivate || isPublicOnly) && (isLoading || isFetching)) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (isPrivate && !authed) return null;

  return <>{children}</>;
}
