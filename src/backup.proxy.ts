import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/auth/signin", "/auth/signup"];
const COOKIE_NAME = "session";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAuthenticated = request.cookies.has(COOKIE_NAME);
    const isAuthRoute = AUTH_ROUTES.includes(pathname);

    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!isAuthRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/auth/signin", "/auth/signup"],
};
