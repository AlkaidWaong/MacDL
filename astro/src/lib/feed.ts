import { Feed } from "feed";

export function createFeed(site: URL) {
  return new Feed({
    id: site.origin,
    link: site.origin,
    title: "MacAppHQ",
    description: "MacAppHQ 持续更新 Mac 应用评测、效率工具、开发工作流与独立开发者软件推荐。",
    language: "zh-CN",
    favicon: new URL("/favicon.svg", site).toString(),
    updated: new Date()
  });
}
