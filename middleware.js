import { NextResponse } from 'next/server'
import BLOG from '@/blog.config'

export function middleware(request) {
  const url = request.nextUrl.clone()
  
  // 移除多余的斜杠
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(url)
  }

  // 处理www和非www版本统一
  const hostname = request.headers.get('host')
  if (BLOG.LINK) {
    const preferredDomain = new URL(BLOG.LINK).hostname
    if (hostname !== preferredDomain && !hostname.includes('localhost')) {
      url.hostname = preferredDomain
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. 所有静态文件，如 /favicon.ico, /sitemap.xml, /robots.txt 等
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}
