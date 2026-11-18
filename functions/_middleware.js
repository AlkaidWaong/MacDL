// Cloudflare Pages middleware
// 1) 旧站遗留的 .html 地址 301 到无扩展名地址
// 2) 目录型页面（/article/xxx）直接返回 index.html，避免 Pages 自动跳到带斜杠版本，
//    保证内链、canonical 与实际 URL 一致。
export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const { pathname } = url;

  if (pathname.endsWith(".html")) {
    const target = new URL(url);
    target.pathname = pathname.slice(0, -5) || "/";
    return Response.redirect(target.toString(), 301);
  }

  if (pathname.startsWith("/api/")) return next();

  if (pathname.endsWith("/")) return next();

  const lastSegment = pathname.split("/").pop() ?? "";
  if (lastSegment.includes(".")) return next();

  if (env?.ASSETS) {
    const indexUrl = new URL(url);
    indexUrl.pathname = `${pathname}/index.html`;
    const asset = await env.ASSETS.fetch(indexUrl.toString());
    if (asset.status === 200) return asset;
  }

  return next();
}
