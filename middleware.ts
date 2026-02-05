import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const DEMO_HOST_MARKERS = ['vitae-demo.vercel.app', 'vitae-demo'];

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  if (pathname === '/') {
    const isDemoHost = DEMO_HOST_MARKERS.some((marker) =>
      hostname.includes(marker)
    );
    const isDemoEnv = process.env.NEXT_PUBLIC_APP_MODE === 'demo';

    if (isDemoHost || isDemoEnv) {
      const url = request.nextUrl.clone();
      url.pathname = '/demo';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
