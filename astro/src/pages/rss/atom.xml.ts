import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { createFeed } from "../../lib/feed";

export const prerender = true;

export const GET: APIRoute = async (context) => {
  const site = context.site ?? new URL("https://www.macapphq.com");
  const feed = createFeed(site);

  const posts = await getCollection("posts", ({ data }) => !data.draft);
  posts
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .forEach((post) => {
      const link = new URL(`/article/${post.data.urlSlug}`, site).toString();
      feed.addItem({
        id: link,
        link,
        title: post.data.title,
        description: post.data.description ?? "",
        date: post.data.date
      });
    });

  return new Response(feed.atom1(), {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" }
  });
};

