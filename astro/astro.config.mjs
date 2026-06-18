import { defineConfig } from "astro/config";
import fs from "node:fs";
import path from "node:path";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import yaml from "js-yaml";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

const TAG_ALIAS_TO_CANONICAL = {
  ORC: "OCR",
  Markdown: "Markdown编辑器",
  "mac卸载工具": "Mac应用卸载",
  "Mac剪贴板": "剪贴板管理器",
  "剪贴板工具": "剪贴板管理器",
  "屏幕录制": "录屏工具",
  "写作软件": "写作工具",
  "Mac办公": "办公效率"
};

const MIN_INDEXABLE_TAG_POSTS = 3;
const MIN_INDEXABLE_CATEGORY_POSTS = 3;

function normalizeTag(tag) {
  return TAG_ALIAS_TO_CANONICAL[tag] ?? tag;
}

function collectTaxonomyCounts() {
  const postsDir = path.join(process.cwd(), "src/content/posts");
  const tagCount = new Map();
  const categoryCount = new Map();

  for (const file of fs.readdirSync(postsDir)) {
    if (!file.endsWith(".md")) continue;
    const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
    const match = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!match) continue;
    const data = yaml.load(match[1]) ?? {};
    if (data.draft) continue;

    for (const tag of data.tags ?? []) {
      const canonicalTag = normalizeTag(String(tag));
      tagCount.set(canonicalTag, (tagCount.get(canonicalTag) ?? 0) + 1);
    }

    for (const category of data.categories ?? []) {
      const name = String(category);
      categoryCount.set(name, (categoryCount.get(name) ?? 0) + 1);
    }
  }

  return { tagCount, categoryCount };
}

function rehypeDemoteBodyH1() {
  const visit = (node) => {
    if (!node || typeof node !== "object") return;

    if (node.type === "element" && node.tagName === "h1") {
      node.tagName = "h2";
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) visit(child);
    }
  };

  return (tree) => {
    visit(tree);
  };
}

const { tagCount, categoryCount } = collectTaxonomyCounts();
const noindexTagPaths = new Set(
  [...tagCount.entries()]
    .filter(([, count]) => count < MIN_INDEXABLE_TAG_POSTS)
    .map(([tag]) => `/tag/${encodeURIComponent(tag)}`)
);
const noindexCategoryPaths = new Set(
  [...categoryCount.entries()]
    .filter(([, count]) => count < MIN_INDEXABLE_CATEGORY_POSTS)
    .map(([category]) => `/category/${encodeURIComponent(category)}`)
);

export default defineConfig({
  site: "https://www.macapphq.com",
  trailingSlash: "never",
  markdown: {
    processor: unified({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeDemoteBodyH1,
        [
          rehypePrettyCode,
          {
            theme: "github-light",
            keepBackground: false
          }
        ]
      ]
    })
  },
  integrations: [
    mdx(),
    sitemap({
      filter(page) {
        const pathname = new URL(page).pathname.replace(/\/$/, "") || "/";
        if (pathname === "/search" || pathname === "/archive" || pathname === "/tag") return false;
        if (pathname === "/thanks" || pathname === "/links") return false;
        if (pathname.startsWith("/en/")) return false;
        if (/^\/tag\/.+\/page\/\d+$/.test(pathname)) return false;
        if (/^\/category\/.+\/page\/\d+$/.test(pathname)) return false;
        if (noindexTagPaths.has(pathname)) return false;
        if (noindexCategoryPaths.has(pathname)) return false;
        return true;
      }
    })
  ]
});
