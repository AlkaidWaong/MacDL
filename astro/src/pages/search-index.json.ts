import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  const items = posts
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((p) => ({
      url: `/article/${p.data.urlSlug}`,
      title: p.data.title,
      description: p.data.description ?? "",
      date: p.data.date ? p.data.date.toISOString().slice(0, 10) : "",
      tags: p.data.tags ?? []
    }));

  return new Response(JSON.stringify(items), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
};

