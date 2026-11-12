import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const SITE = "https://www.macapphq.com";

const clean = (value: string) => value.replace(/\s+/g, " ").trim();

const truncate = (value: string, max = 120) =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

const link = (title: string, href: string, description?: string) => {
  const safeTitle = clean(title).replace(/[[\]]/g, "");
  const line = `- [${safeTitle}](${href})`;
  return description ? `${line}: ${truncate(clean(description))}` : line;
};

export const GET: APIRoute = async () => {
  const posts = await getCollection("posts", ({ data }) => !data.draft);

  const sortedPosts = [...posts].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  const latestDate = sortedPosts.reduce((latest, post) => {
    const date = post.data.updatedAt ?? post.data.date;
    return date > latest ? date : latest;
  }, new Date(0));

  const categoryCounts = new Map<string, number>();
  for (const post of posts) {
    for (const category of post.data.categories ?? []) {
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    }
  }

  const categories = [...categoryCounts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN")
  );

  const bySlug = new Map(posts.map((post) => [post.data.urlSlug, post]));

  const articleLine = (slug: string) => {
    const post = bySlug.get(slug);
    if (!post) return "";
    const title = post.data.seoTitle?.trim() || post.data.title;
    return link(
      title,
      `${SITE}/article/${post.data.urlSlug}`,
      post.data.description || post.data.quickTake
    );
  };

  const recentLines = sortedPosts.slice(0, 10).map((post) =>
    link(
      post.data.seoTitle?.trim() || post.data.title,
      `${SITE}/article/${post.data.urlSlug}`,
      post.data.description || post.data.quickTake
    )
  );

  const comparisonSlugs = [
    "mac-window-manager-tools",
    "mac-screenshot-tools-comparison",
    "mac-clipboard-tools-comparison",
    "mac-browser-comparison",
    "free-cleanmymac-alternative",
    "mac-window-switchers"
  ];

  const comparisonLines = comparisonSlugs.map(articleLine).filter(Boolean);

  const body = `# MacAppHQ

> MacAppHQ 是中文 Mac 软件评测与工作流指南，覆盖效率工具、AI 工具、开发工具、浏览器扩展和系统工具。

MacAppHQ 通过实际使用、资料核对和同类产品比较，说明一款 Mac 工具能做什么、适合谁，以及价格是否与价值匹配。内容以简体中文为主，面向 Mac 用户、内容创作者、开发者和需要软件选型的团队。

- 站点：${SITE}/
- 语言：zh-CN
- 内容类型：软件评测、同类对比、使用方法、工作流指南
- 最近更新：${latestDate.toISOString().slice(0, 10)}

## 核心页面

${link("首页", `${SITE}/`, "最新文章、精选内容和专题入口")}
${link("全部文章", `${SITE}/archive/`, "按时间浏览 MacAppHQ 的全部文章")}
${link("关于 MacAppHQ", `${SITE}/about/`, "站点定位、评估方法和适合的读者")}
${link("作者与编辑团队", `${SITE}/author/`, "站点作者、编辑原则和联系方式")}
${link("我们如何评测", `${SITE}/how-we-review/`, "资料来源、评估维度、价格核对和更新规则")}
${link("提交软件", `${SITE}/submit/`, "向 MacAppHQ 提交 Mac 软件或独立开发者作品")}

## 分类

${categories
  .map(
    ([name, count]) =>
      link(name, `${SITE}/category/${encodeURIComponent(name)}`, `${count} 篇文章`)
  )
  .join("\n")}

## 近期文章

${recentLines.join("\n")}

## 常用对比指南

${comparisonLines.join("\n")}

## 政策与说明

${link("隐私政策", `${SITE}/privacy-policy/`, "Cookie、统计和第三方服务说明")}
${link("风险提示", `${SITE}/Risk-Warning/`, "下载和使用第三方软件前的注意事项")}
${link("RSS 订阅", `${SITE}/rss.xml`, "文章更新订阅")}
${link("站点地图", `${SITE}/sitemap-index.xml`, "供搜索引擎和抓取工具使用的完整 URL 列表")}

## 使用说明

- 本站文章以公开资料、产品官网和实际使用为基础；价格、版本和支持平台可能变化，引用前请以厂商当前页面为准。
- 下载链接优先指向开发者官方渠道；本站不托管安装包，下载信息请以开发者官方页面为准。
- 文章页面使用 canonical 链接，站点地图列出可索引页面。标签页、搜索页和归档分页不应作为主要引用来源。
- 引用文章时请保留原文链接；批量抓取请控制频率，避免影响站点可用性。

## 联系方式

- 站点：${SITE}/
- 关于与联系：${SITE}/about/
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
};
