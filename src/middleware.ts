import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "aerisnacks-super-secret-key-change-in-production";

export async function middleware(request: NextRequest) {
  // Current URL path check karte hain
  const path = request.nextUrl.pathname;

  // Sirf /admin routes ko protect karte hain
  if (path.startsWith('/admin')) {
    // Agar login page pe hain, toh skip karte hain validation
    if (path === '/admin/login') {
      return NextResponse.next();
    }

    // Token check karte hain cookies se
    const token = request.cookies.get('admin_token')?.value;

    // Agar token nahi hai, toh login page pe redirect karte hain
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      // Puraane URL ko query param mein save karte hain
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Token verify karte hain jose se
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      // Request headers modify kar sakte hain future user state pass karne ke liye
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.sub as string);
      requestHeaders.set('x-user-role', payload.role as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error("JWT Verification failed:", error);
      // Invalid token ke case mein bhi redirect
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', path);
      // Purana invalid cookie delete karne ke liye response modify karte hain
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // Baki saare public routes aise hi pass hone do
  return NextResponse.next();
}

// Ensure middleware sirf specific paths pe chale for performance
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * But we want to explicitly run it on /admin paths
     */
    '/admin/:path*',
  ],
};
