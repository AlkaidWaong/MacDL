import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { createFeed } from "../lib/feed";
import { pickFirstBodyImage, toAbsoluteUrl } from "../lib/cover";

export const GET: APIRoute = async (context) => {
  const site = context.site ?? new URL("https://www.macapphq.com");
  const feed = createFeed(site);

  const posts = await getCollection("posts", ({ data }) => !data.draft);
  posts
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .forEach((post) => {
      const link = new URL(`/article/${post.data.urlSlug}`, site).toString();
      const body = (post as unknown as { body?: string }).body ?? "";
      const coverSrc =
        post.data.heroImage?.trim() ||
        post.data.cover?.trim() ||
        pickFirstBodyImage(body) ||
        "";
      feed.addItem({
        id: link,
        link,
        title: post.data.title,
        description: post.data.description ?? "",
        date: post.data.date,
        image: coverSrc ? toAbsoluteUrl(coverSrc, site) : undefined
      });
    });

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
};
