import type { NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/', '/chat/:path*', '/myPage/:path*', '/participation/:path*', '/recruit/:path*', '/login', '/signup']
};
