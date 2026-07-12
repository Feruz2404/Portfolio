import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/lib/i18n/config";

const intlMiddleware = createMiddleware(routing);

// NextAuth v5 session cookie names (dev http / prod https).
const SESSION_COOKIES = ["authjs.session-token", "__Secure-authjs.session-token"];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Defense-in-depth backstop for the admin area: no session cookie → bounce to
  // login before any panel page renders. The authoritative check (validated
  // session + role + per-section permission) still runs in the (panel) layout
  // and each page's requireAdminPage(...).
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
      return NextResponse.next();
    }
    const hasSession = SESSION_COOKIES.some((name) => req.cookies.has(name));
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  // Run on everything except API routes, Next internals, metadata routes
  // (opengraph-image / twitter-image / icon — extension-less, so listed
  // explicitly) and static files. Admin is included so the backstop applies.
  matcher: ["/((?!api|_next|opengraph-image|twitter-image|icon|apple-icon|manifest|sitemap|robots|.*\\..*).*)"]
};
