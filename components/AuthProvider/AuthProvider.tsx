"use client";

import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

type Props = { children: ReactNode };

const PRIVATE_PREFIXES = ["/profile", "/notes"];
const PUBLIC_ONLY_PREFIXES = ["/sign-in", "/sign-up"];

function startsWithAny(path: string, prefixes: string[]) {
  return prefixes.some((p) => path === p || path.startsWith(p + "/"));
}

type SessionResponse = {
  success: boolean;
  user?: unknown | null;
};

async function fetchSession(): Promise<SessionResponse> {
  const res = await fetch("/api/auth/session", {
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) {
    return { success: false, user: null };
  }
  if (!res.ok) return { success: false, user: null };

  return res.json();
}

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname();

  const shouldCheck = useMemo(() => {
    const isPrivate = startsWithAny(pathname, PRIVATE_PREFIXES);
    const isPublicOnly = startsWithAny(pathname, PUBLIC_ONLY_PREFIXES);
    return isPrivate || isPublicOnly;
  }, [pathname]);

  // только проверяем сессию (для UI), но НЕ редиректим
  useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: shouldCheck,
  });

  return <>{children}</>;
}
