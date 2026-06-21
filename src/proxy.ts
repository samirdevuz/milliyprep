import { NextResponse, type NextRequest } from "next/server";
import { verifySessionEdge } from "@/lib/server/session-edge";
import { SESSION_COOKIE } from "@/lib/server/session-constants";

/**
 * Route protection (runs in the Edge runtime, Next.js 16 "proxy" convention):
 *  - /dashboard/**  requires a valid session, else redirect to /login?next=...
 *  - /login, /register: if already authenticated, redirect to /dashboard
 */
export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionEdge(token);

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isDashboard && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  if (isAuthPage && session) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
