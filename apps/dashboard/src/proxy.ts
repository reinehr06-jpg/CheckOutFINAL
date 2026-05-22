import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = [
  '/login',
  '/2fa',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/session-expired',
  '/restricted',
  '/_next',
  '/api',
  '/master-access',
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff2?)$/)
  );
}

export function proxy(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  if (isStaticAsset(pathname) || isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('basileia_session');
  const authHeader = request.headers.get('Authorization');

  if (!sessionCookie && !authHeader) {
    const loginUrl = new URL('/login', origin);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (sessionCookie && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', origin));
  }

  const response = NextResponse.next();

  if (sessionCookie) {
    response.headers.set('X-Session-Token', sessionCookie.value);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|images|fonts).*)',
  ],
};
