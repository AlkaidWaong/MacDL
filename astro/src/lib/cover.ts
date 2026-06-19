import type { CollectionEntry } from "astro:content";

export function pickFirstBodyImage(markdown: string): string | null {
  if (!markdown) return null;

  const skip = (url: string) => {
    const u = url.trim().toLowerCase();
    if (!u || u.startsWith("data:")) return true;
    if (u.includes("notion.so/icons/arrow-down-line")) return true;
    return false;
  };

  // Match in-order: <img src="..."> or markdown images.
  const pattern =
    /<img\s+[^>]*src=["']([^"']+)["'][^>]*>|!\[[^\]]*]\(\s*<([^>]+)>\s*\)|!\[[^\]]*]\(\s*([^) \t\n]+)\s*\)/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(markdown))) {
    const url = (match[1] || match[2] || match[3] || "").trim();
    if (!skip(url)) return url;
  }

  return null;
}

export function pickEntryImage(post: CollectionEntry<"posts"> | null | undefined): string | null {
  if (!post) return null;
  const body = (post as unknown as { body?: string }).body ?? "";

  return (
    post.data.socialImage?.trim() ||
    post.data.heroImage?.trim() ||
    post.data.cover?.trim() ||
    pickFirstBodyImage(body) ||
    null
  );
}

export function pickFirstAvailableEntryImage(
  posts: CollectionEntry<"posts">[]
): string | null {
  for (const post of posts) {
    const image = pickEntryImage(post);
    if (image) return image;
  }

  return null;
}

export function toAbsoluteUrl(src: string, site: URL): string {
  const s = (src ?? "").trim();
  if (!s) return s;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("//")) return `${site.protocol}${s}`;
  return new URL(s.startsWith("/") ? s : `/${s}`, site).toString();
}
