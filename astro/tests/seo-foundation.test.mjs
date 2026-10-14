import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import {
  collectArticleLastmods,
  getPublicImageMetadata,
  isSitemapPageAllowed
} from "../src/lib/seo-foundation.mjs";

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
