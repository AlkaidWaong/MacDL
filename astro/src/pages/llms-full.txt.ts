import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const SITE = "https://www.macapphq.com";

const clean = (value: string) => value.replace(/\s+/g, " ").trim();

const truncate = (value: string, max = 160) =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

export const GET: APIRoute = async () => {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  const categories = new Map<string, typeof posts>();

  for (const post of posts) {
    const category = post.data.categories?.[0] ?? "未分类";
    categories.set(category, [...(categories.get(category) ?? []), post]);
  }

  const sections = [...categories.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "zh-CN"))
    .map(([category, entries]) => {
      const lines = entries
        .sort(
          (a, b) =>
            (b.data.updatedAt ?? b.data.date).getTime() -
            (a.data.updatedAt ?? a.data.date).getTime()
        )
        .map((post) => {
          const title = clean(post.data.seoTitle?.trim() || post.data.title).replace(/[[\]]/g, "");
          const description = post.data.description || post.data.quickTake || "";
          const updatedAt = (post.data.updatedAt ?? post.data.date).toISOString().slice(0, 10);
          const price = post.data.price?.trim() ? `；价格：${clean(post.data.price)}` : "";
          return `- [${title}](${SITE}/article/${post.data.urlSlug}): ${truncate(clean(description))}（更新：${updatedAt}${price}）`;
        });

      return `## ${category}\n\n${lines.join("\n")}`;
    });

  const body = `# MacAppHQ 完整文章目录

> MacAppHQ 是中文 Mac 软件评测与工作流指南。本文件列出全部已发布文章，按主要分类编排；每条包括标题、摘要、最后更新日期与文章链接。

- 站点：${SITE}/
- 语言：zh-CN
- 文章数量：${posts.length}
- 精简导航：[llms.txt](${SITE}/llms.txt)
- 站点地图：[sitemap-index.xml](${SITE}/sitemap-index.xml)

${sections.join("\n\n")}

## 使用说明

- 价格、版本和支持平台可能变化；引用前请以文章所列厂商当前页面为准。
- 下载链接优先指向开发者官方渠道；本站不托管安装包。
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
};
