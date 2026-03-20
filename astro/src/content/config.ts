import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    urlSlug: z.string().min(1),
    title: z.string().min(1),
    date: z.coerce.date(),
    // Preferred cover image for lists/cards. If missing, we fall back to the
    // first image in markdown body (see PostCard).
    // New preferred hero image for article page + cards.
    heroImage: z.string().optional(),
    cover: z.string().optional(),
    description: z.string().optional(),
    categories: z.array(z.string().min(1)).default([]),
    tags: z.array(z.string().min(1)).default([]),
    featured: z.boolean().optional(),
    aliases: z.array(z.string().min(1)).optional(),
    draft: z.boolean().optional()
  })
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    urlSlug: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    aliases: z.array(z.string().min(1)).optional(),
    draft: z.boolean().optional()
  })
});

export const collections = { posts, pages };
