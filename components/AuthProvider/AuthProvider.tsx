"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe } from "@/lib/api/clientApi";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isPrivateRoute =
      pathname.startsWith("/profile") || pathname.startsWith("/notes");

    const isAuthPages =
      pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

    const initAuth = async () => {
      try {
        // Если уже авторизован в сторе — не дёргаем API.
        // Если при этом на страницах логина — отправляем в профиль.
        if (isAuthenticated) {
          if (isAuthPages) router.replace("/profile");
          return;
        }

        // checkSession у тебя boolean
        const ok = await checkSession();

        if (!ok) {
          clearAuth();
          if (isPrivateRoute) router.replace("/sign-in");
          return;
        }

        // Только если сессия ок — получаем пользователя
        const user = await getMe();

        if (user) {
          setUser(user);
          if (isAuthPages) router.replace("/profile");
          return;
        }

        // Сессия "ок", но user не получили -> считаем разлогинен
        clearAuth();
        if (isPrivateRoute) router.replace("/sign-in");
      } catch {
        clearAuth();
        if (isPrivateRoute) router.replace("/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [pathname, router, isAuthenticated, setUser, clearAuth]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
