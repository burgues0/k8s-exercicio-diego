import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLoginRoute = pathname.startsWith('/login');
  const isLogged = request.cookies.get('auth-token');

  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || 
      pathname.includes('.') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/icon')) {
    return NextResponse.next();
  }

  if (!isLoginRoute && !isLogged) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = `?redirect=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && isLogged) {
    const redirectTo = request.nextUrl.searchParams.get('redirect');
    if (redirectTo) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = redirectTo;
      redirectUrl.search = '';
      return NextResponse.redirect(redirectUrl);
    }
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = '/';
    homeUrl.search = '';
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon|icon|.*\\.).*)', '/((?!public).*)'],
};
