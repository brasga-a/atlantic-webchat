import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/auth/signin", "/auth/signup"];
const COOKIE_NAME = "session";
const PRIVATE_ROUTES = ["/", "/profile", "/settings", "/chat/*"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAuthenticated = request.cookies.has(COOKIE_NAME);
    const isAuthRoute = PUBLIC_ROUTES.includes(pathname);
    const isPrivateRoute = PRIVATE_ROUTES.includes(pathname);

    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isPrivateRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}