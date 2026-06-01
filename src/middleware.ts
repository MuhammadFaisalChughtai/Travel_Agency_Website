import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get hostname (e.g., 'terrifictravelltd.com', 'roadtoumrah.co.uk')
  const hostname = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-site-domain', hostname);

  const url = request.nextUrl.clone();
  
  // Skip rewriting if the path is intended for admin, api, login, or password recovery
  if (
    url.pathname.startsWith('/admin') || 
    url.pathname.startsWith('/api') || 
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/forgot-password') ||
    url.pathname.startsWith('/reset-password')
  ) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Rewrite based on domain
  if (hostname.includes('roadtoumrah')) {
    url.pathname = `/road-to-umrah${url.pathname === '/' ? '' : url.pathname}`;
  } else {
    url.pathname = `/terrific-travel${url.pathname === '/' ? '' : url.pathname}`;
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
    '/((?!_next/static|_next/image|favicon.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
