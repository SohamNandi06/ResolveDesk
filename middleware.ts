import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const path = req.nextUrl.pathname;

  // 1. Define protected routes
  const isAdminRoute = path.startsWith('/admin');
  const isUserRoute = path === '/' || path.startsWith('/api/complaints');
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register');

  // 2. If trying to access auth pages while logged in, redirect to home
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 3. If no token and trying to access protected routes, redirect to login
  if (!token && (isAdminRoute || isUserRoute)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 4. Verify Token & Role
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // If user tries to access admin, check role
      if (isAdminRoute && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url)); // Send back to home
      }
      
      // Pass user info to backend via headers (optional but useful)
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', payload.id as string);
      requestHeaders.set('x-user-role', payload.role as string);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });

    } catch (error) {
      // If token is invalid (expired/tampered), delete it and redirect
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

// Config: Match all paths except static files and images
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};