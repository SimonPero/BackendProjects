import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") || "";

  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  const authCookie = request.cookies.get("auth");

  const publicRoutes = ["/user/login", "/user/register", "/"];

  const url = new URL(request.url);

  if (!authCookie && !publicRoutes.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/user/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next|api).*)"],
};
