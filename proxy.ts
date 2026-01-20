import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isAuthenticated = !!accessToken;

  if (!isAuthenticated && refreshToken) {
    try {
      const response = await checkSession();

      if (response.status === 200) {
        const responseRedirect = NextResponse.redirect(new URL(request.url));

        const setCookieHeader = response.headers["set-cookie"];
        if (setCookieHeader) {
          const cookieValue = Array.isArray(setCookieHeader)
            ? setCookieHeader.join(", ")
            : setCookieHeader;
          responseRedirect.headers.set("set-cookie", cookieValue);
        }

        const isAuthRoute = authRoutes.some((r) =>
          nextUrl.pathname.startsWith(r),
        );
        if (isAuthRoute) {
          const toHome = NextResponse.redirect(new URL("/", request.url));
          if (setCookieHeader) {
            const cookieValue = Array.isArray(setCookieHeader)
              ? setCookieHeader.join(", ")
              : setCookieHeader;
            toHome.headers.set("set-cookie", cookieValue);
          }
          return toHome;
        }

        return responseRedirect;
      }
    } catch (error) {
      console.error("Session refresh failed in proxy:", error);
    }
  }

  const isPrivateRoute = privateRoutes.some((r) =>
    nextUrl.pathname.startsWith(r),
  );
  const isAuthRoute = authRoutes.some((r) => nextUrl.pathname.startsWith(r));

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};