import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
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

test("sitemap dates cover articles, hubs, taxonomies, and static pages", () => {
  assert.equal(typeof seoFoundation.collectSitemapLastmods, "function");

  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "macapphq-sitemap-"));
  const postsDir = path.join(fixtureRoot, "posts");
  const pagesDir = path.join(fixtureRoot, "pages");
  fs.mkdirSync(postsDir);
  fs.mkdirSync(pagesDir);

  fs.writeFileSync(path.join(postsDir, "one.md"), `---
urlSlug: "App-Cleaner-&-Uninstaller"
title: "One"
date: "2026-01-01"
updatedAt: "2026-02-03"
categories: ["效率工具"]
tags: ["Markdown"]
---
`);
  fs.writeFileSync(path.join(postsDir, "two.md"), `---
urlSlug: "two"
title: "Two"
date: "2026-03-04"
categories: ["系统工具"]
tags: ["工作流"]
---
`);
  fs.writeFileSync(path.join(pagesDir, "about.md"), `---
urlSlug: "about"
title: "About"
updatedAt: "2025-12-01"
---
`);

  const lastmods = seoFoundation.collectSitemapLastmods(
    postsDir,
    pagesDir,
    (tag) => tag === "Markdown" ? "Markdown编辑器" : tag
  );

  assert.equal(lastmods.get("/article/App-Cleaner-&-Uninstaller")?.toISOString(), "2026-02-03T00:00:00.000Z");
  assert.equal(lastmods.get("/")?.toISOString(), "2026-03-04T00:00:00.000Z");
  assert.equal(lastmods.get("/category")?.toISOString(), "2026-03-04T00:00:00.000Z");
  assert.equal(lastmods.get("/category/效率工具")?.toISOString(), "2026-02-03T00:00:00.000Z");
  assert.equal(lastmods.get("/tag/Markdown编辑器")?.toISOString(), "2026-02-03T00:00:00.000Z");
  assert.equal(lastmods.get("/about")?.toISOString(), "2025-12-01T00:00:00.000Z");

  fs.rmSync(fixtureRoot, { recursive: true, force: true });
});

test("sitemap URL lookup matches encoded and reserved path characters", () => {
  assert.equal(typeof seoFoundation.getSitemapLastmod, "function");

  const articleDate = new Date("2026-02-03T00:00:00.000Z");
  const categoryDate = new Date("2026-03-04T00:00:00.000Z");
  const lastmods = new Map([
    ["/article/App-Cleaner-&-Uninstaller", articleDate],
    ["/category/效率工具", categoryDate]
  ]);

  assert.equal(
    seoFoundation.getSitemapLastmod(
      "https://www.macapphq.com/article/App-Cleaner-%26-Uninstaller",
      lastmods
    ),
    articleDate
  );
  assert.equal(
    seoFoundation.getSitemapLastmod(
      "https://www.macapphq.com/category/%E6%95%88%E7%8E%87%E5%B7%A5%E5%85%B7",
      lastmods
    ),
    categoryDate
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
