import { Feed } from "feed";

export function createFeed(site: URL) {
  return new Feed({
    id: site.origin,
    link: site.origin,
    title: "MacAppHQ",
    description: "Mac apps and workflows.",
    language: "zh-CN",
    favicon: new URL("/favicon.svg", site).toString(),
    updated: new Date()
  });
}

