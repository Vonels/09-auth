import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;

  const isAuthenticated = cookies.has("accessToken") || cookies.has("session");

  const isPrivateRoute = privateRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
