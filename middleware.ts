import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if accessing admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('authToken')?.value;
    
    // No token = redirect to login
    if (!token) {
      console.log('Middleware: No token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Basic token format validation
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('Middleware: Invalid token format');
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('authToken');
        return response;
      }
      
      console.log('Middleware: Token validation passed');
    } catch (error) {
      console.log('Middleware: Token validation error:', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('authToken');
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
};