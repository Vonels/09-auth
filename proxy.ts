import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const PRIVATE_ROUTES = ["/profile", "/notes"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let isAuthenticated = !!accessToken;
  let justRefreshed = false;
  let newCookies: string[] = [];

  if (!isAuthenticated && refreshToken) {
    try {
      const response = await checkSession(`refreshToken=${refreshToken}`);

      if (response.status === 200) {
        isAuthenticated = true;
        justRefreshed = true;
        const setCookieHeader = response.headers["set-cookie"];
        if (setCookieHeader) {
          newCookies = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];
        }
      }
    } catch (error) {
      console.error("Session refresh failed in proxy:", error);
    }
  }

  const isPrivateRoute = PRIVATE_ROUTES.some((r) =>
    nextUrl.pathname.startsWith(r),
  );
  const isAuthRoute = AUTH_ROUTES.some((a) => nextUrl.pathname.startsWith(a));

  if (justRefreshed) {
    const targetUrl = isAuthRoute ? new URL("/", request.url) : request.url;
    const redirectResponse = NextResponse.redirect(targetUrl);

    newCookies.forEach((cookie) => {
      redirectResponse.headers.append("set-cookie", cookie);
    });

    return redirectResponse;
  }

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
