import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    if (pathname !== '/') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
