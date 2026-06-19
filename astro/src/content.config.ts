import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    urlSlug: z.string().min(1),
    title: z.string().min(1),
    date: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    // Preferred cover image for lists/cards. If missing, we fall back to the
    // first image in markdown body (see PostCard).
    // New preferred hero image for article page + cards.
    heroImage: z.string().optional(),
    socialImage: z.string().optional(),
    cover: z.string().optional(),
    description: z.string().optional(),
    quickTake: z.string().optional(),
    bestFor: z.array(z.string().min(1)).optional(),
    officialUrl: z.string().url().optional(),
    faqs: z
      .array(
        z.object({
          question: z.string().min(1),
          answer: z.string().min(1)
        })
      )
      .optional(),
    categories: z.array(z.string().min(1)).default([]),
    tags: z.array(z.string().min(1)).default([]),
    featured: z.boolean().optional(),
    aliases: z.array(z.string().min(1)).optional(),
    draft: z.boolean().optional()
  })
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    urlSlug: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    noindex: z.boolean().optional(),
    aliases: z.array(z.string().min(1)).optional(),
    draft: z.boolean().optional()
  })
});

export const collections = { posts, pages };
