import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for the subscription page
  if (request.nextUrl.pathname.startsWith('/subscription')) {
    // Check for auth cookie
    const isAuthenticated = request.cookies.get('subscription-auth')?.value === 'authenticated'
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/subscription-login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/subscription/:path*'
}