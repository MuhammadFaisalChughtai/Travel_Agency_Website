import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Get hostname (e.g., 'terrifictravelltd.com', 'roadtoumrah.co.uk')
  const hostname =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-domain", hostname);

  const url = request.nextUrl.clone();

  // Redirect UUID-based pages to their friendly slugs at the middleware level (to bypass Next.js streaming 200 OK issue)
  if (url.pathname.startsWith("/v/")) {
    const slug = url.pathname.substring(3);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    if (isUuid) {
      try {
        const resolveUrl = new URL(`/api/resolve-slug?id=${slug}`, request.url);
        const res = await fetch(resolveUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.slug) {
            return NextResponse.redirect(new URL(`/v/${data.slug}`, request.url), {
              status: 308,
            });
          }
        }
      } catch (e) {
        console.error("Failed to resolve slug in middleware:", e);
      }
    }
  }

  // Skip rewriting if the path is intended for admin, api, login, or password recovery
  if (
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/unsubscribe") ||
    url.pathname.startsWith("/forgot-password") ||
    url.pathname.startsWith("/reset-password")
  ) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Rewrite based on domain
  if (hostname.includes("roadtoumrah")) {
    url.pathname = `/road-to-umrah${url.pathname === "/" ? "" : url.pathname}`;
  } else {
    url.pathname = `/terrific-travel${url.pathname === "/" ? "" : url.pathname}`;
  }

  return NextResponse.rewrite(url, {
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files, plus robots/sitemap
    "/((?!_next/static|_next/image|favicon.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
