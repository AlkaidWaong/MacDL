import fs from "node:fs";
import path from "node:path";

import yaml from "js-yaml";
import sharp from "sharp";

const EXCLUDED_SITEMAP_PATHS = new Set([
  "/search",
  "/archive",
  "/tag",
  "/thanks",
  "/links",
  "/seo-report"
]);

export function isSitemapPageAllowed(page, noindexTagPaths = new Set(), noindexCategoryPaths = new Set()) {
  const pathname = new URL(page).pathname.replace(/\/$/, "") || "/";
  if (EXCLUDED_SITEMAP_PATHS.has(pathname)) return false;
  if (pathname.startsWith("/en/")) return false;
  if (/^\/category\/page\/\d+$/.test(pathname)) return false;
  if (/^\/tag\/.+\/page\/\d+$/.test(pathname)) return false;
  if (/^\/category\/.+\/page\/\d+$/.test(pathname)) return false;
  if (noindexTagPaths.has(pathname)) return false;
  if (noindexCategoryPaths.has(pathname)) return false;
  return true;
}

export function collectArticleLastmods(postsDir) {
  const lastmods = new Map();

  for (const file of fs.readdirSync(postsDir)) {
    if (!file.endsWith(".md")) continue;
    const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
    const match = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!match) continue;

    const data = yaml.load(match[1]) ?? {};
    if (data.draft || !data.urlSlug) continue;

    const lastmod = new Date(data.updatedAt ?? data.date);
    if (Number.isNaN(lastmod.getTime())) continue;
    lastmods.set(`/article/${encodeURIComponent(String(data.urlSlug))}`, lastmod);
  }

  return lastmods;
}

export async function getPublicImageMetadata(src, publicDir) {
  if (!src?.startsWith("/") || src.startsWith("//")) return undefined;

  const pathname = decodeURIComponent(src.split(/[?#]/, 1)[0]);
  const absolutePath = path.resolve(publicDir, `.${pathname}`);
  const publicRoot = path.resolve(publicDir) + path.sep;
  if (!absolutePath.startsWith(publicRoot) || !fs.existsSync(absolutePath)) return undefined;

  try {
    const { width, height } = await sharp(absolutePath).metadata();
    return width && height ? { width, height } : undefined;
  } catch {
    return undefined;
  }
}
