import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // i18n: default locale is uz with no prefix
  if (pathname.startsWith("/en") || pathname.startsWith("/ru")) return NextResponse.next();
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"]
};
