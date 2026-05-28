import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get hostname (e.g., 'terrifictravelltd.com', 'roadtoumrah.co.uk')
  const hostname = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // Set a custom header so we can read it in Server Components
  requestHeaders.set('x-site-domain', hostname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
