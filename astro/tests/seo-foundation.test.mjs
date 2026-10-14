import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  collectArticleLastmods,
  getPublicImageMetadata,
  isSitemapPageAllowed
} from "../src/lib/seo-foundation.mjs";
import * as seoFoundation from "../src/lib/seo-foundation.mjs";

const projectRoot = path.resolve(import.meta.dirname, "..");

test("SEO report is excluded from the public sitemap", () => {
  assert.equal(isSitemapPageAllowed("https://www.macapphq.com/seo-report"), false);
});

test("article sitemap dates prefer updatedAt", () => {
  const lastmods = collectArticleLastmods(path.join(projectRoot, "src/content/posts"));

  assert.equal(
    lastmods.get("/article/betterstage-for-mac")?.toISOString().slice(0, 10),
    "2026-09-10"
  );
});

test("local public images expose intrinsic dimensions", async () => {
  const metadata = await getPublicImageMetadata(
    "/media/betterstage/betterstage.png",
    path.join(projectRoot, "public")
  );

  assert.deepEqual(metadata, { width: 1536, height: 1024 });
});

test("remote images do not attempt local metadata lookup", async () => {
  const metadata = await getPublicImageMetadata(
    "https://example.com/image.png",
    path.join(projectRoot, "public")
  );

  assert.equal(metadata, undefined);
});

test("local markdown images reserve space and defer offscreen loading", async () => {
  assert.equal(typeof seoFoundation.applyPublicImageAttributes, "function");

  const image = {
    type: "element",
    tagName: "img",
    properties: { src: "/media/betterstage/tabstack-workspace.png" },
    children: []
  };
  const tree = { type: "root", children: [image] };

  await seoFoundation.applyPublicImageAttributes(
    tree,
    path.join(projectRoot, "public")
  );

  assert.deepEqual(image.properties, {
    src: "/media/betterstage/tabstack-workspace.png",
    width: 3840,
    height: 2160,
    loading: "lazy",
    decoding: "async"
  });
});

test("article markdown does not reference missing local images", () => {
  const postsDir = path.join(projectRoot, "src/content/posts");
  const missing = [];

  for (const file of fs.readdirSync(postsDir)) {
    if (!file.endsWith(".md")) continue;
    const markdown = fs.readFileSync(path.join(postsDir, file), "utf8");
    for (const match of markdown.matchAll(/!\[[^\]]*\]\((\/[^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const imagePath = path.join(projectRoot, "public", decodeURIComponent(match[1]));
      if (!fs.existsSync(imagePath)) missing.push(`${file}: ${match[1]}`);
    }
  }

  assert.deepEqual(missing, []);
});
