---
urlSlug: "macmd-viewer"
title: "MacMD Viewer：Mac 上的只读 Markdown 阅读器"
seoTitle: "MacMD Viewer 评测：只读 Markdown 阅读器，19.99 美元"
date: "2026-11-18"
updatedAt: "2026-11-18"
description: "MacMD Viewer 是一款 macOS 只读 Markdown 阅读器，支持 Finder 空格预览、Mermaid 图表、实时刷新和 PDF 导出。本文整理功能、价格、设置步骤和局限。"
quickTake: "MacMD Viewer 只做渲染和阅读：原生应用、打开快、在访达按空格就能看整篇文档。它不能编辑，也没有笔记库，适合每天读 README、spec 和 AI 生成文档的人。"
price: "19.99 美元买断，一台 Mac 一个授权"
platform: "macOS 14 Sonoma 及以上"
officialUrl: "https://macmdviewer.com/features"
sources:
  - name: "MacMD Viewer 功能页"
    url: "https://macmdviewer.com/features"
    note: "Quick Look、Mermaid、PDF 导出与缩放"
  - name: "MacMD Viewer 产品事实"
    url: "https://macmdviewer.com/product-facts.md"
    note: "授权、价格、体积与支持平台"
  - name: "MacMD Viewer 更新日志"
    url: "https://macmdviewer.com/changelog"
    note: "当前版本 1.8.3 与近期改动"
  - name: "MacMD Viewer 下载页"
    url: "https://macmdviewer.com/download"
    note: "系统要求与安装步骤"
quotes:
  - text: "Your agents write markdown. MacMD Viewer reads it."
    source: "MacMD Viewer 功能页"
    url: "https://macmdviewer.com/features"
  - text: "MacMD Viewer is a viewer, not a Markdown editor."
    source: "MacMD Viewer 产品事实"
    url: "https://macmdviewer.com/product-facts.md"
bestFor:
  - "每天要读 README、spec、AI 生成计划的人"
  - "用 Claude Code、Cursor 等工具写代码的人"
  - "需要把 Markdown 投屏或导出 PDF 的人"
  - "在别的编辑器写作、只想找个阅读器的人"
faqs:
  - question: "MacMD Viewer 是什么？"
    answer: "MacMD Viewer 是一款 macOS 只读 Markdown 阅读器，支持 Finder 空格预览、Mermaid 图表、代码高亮、实时刷新和 PDF 导出。"
  - question: "能编辑 Markdown 吗？"
    answer: "不能。它是纯阅读器，源文件只读。写作需要在 Typora、MarkEdit、VS Code 等工具里完成，保存后 MacMD Viewer 会自动刷新。"
  - question: "多少钱？"
    answer: "19.99 美元一次买断，一个授权对应一台 Mac，没有订阅。官网不提供试用版和免费版。"
  - question: "支持哪些系统？"
    answer: "需要 macOS 14 Sonoma 或更高版本，支持 Apple 芯片和 Intel。安装包 5.4 MB，安装后约 16 MB。"
  - question: "Finder 里按空格就能看吗？"
    answer: "可以，但需要先在系统设置里启用 MacMD Viewer 的快速查看扩展。启用后，任何 .md 文件按空格都会渲染标题、表格和图表。"
  - question: "支持 Mermaid 图表吗？"
    answer: "支持流程图、时序图、状态图、甘特图、饼图等，渲染在本地完成。1.8.2 起也能直接打开 .mmd 和 .mermaid 文件。"
  - question: "能导出 PDF 吗？"
    answer: "可以，⇧⌘P 导出为单页连续 PDF，保留图表、代码高亮、表格和链接，没有水印。需要分页时用 ⌘P 走系统打印。"
  - question: "适合做笔记管理吗？"
    answer: "不适合。它没有编辑器、文件夹、双链或标签，定位是单文件阅读，不是知识库。"
categories:
  - "文本编辑"
tags:
  - "MacMD Viewer"
  - "Markdown"
  - "阅读器"
  - "Mermaid"
  - "Mac 工具"
aliases: []
draft: false
heroImage: "/media/macmd-viewer/hero.png"
---

MacMD Viewer 是一款 macOS 上的 Markdown 阅读器，当前版本 1.8.3，需要 macOS 14 或更高版本。

它渲染 `.md` 文件，不修改源文件。没有编辑器，没有文件库，也没有双链。

## MacMD Viewer 是什么？

官方对产品的定义是：阅读器，不是编辑器。

这个定义对应几个具体行为：

- 源文件只读，打开不会改动内容
- 原生 macOS 应用，安装包 5.4 MB，安装后约 16 MB
- 渲染在本地完成，不联网也能看
- 19.99 美元一次买断，一个授权对应一台 Mac

官网首页写的是：AI 代理负责写 Markdown，MacMD Viewer 负责读。Claude Code、Cursor、ChatGPT 输出的计划、说明和文档，通常都是 `.md` 文件。

## 怎么开始用？

1. 从官网下载 DMG，把应用拖进「应用程序」
2. 打开应用，输入授权码激活（没有试用版）
3. 打开「系统设置 → 通用 → 登录项与扩展」，启用 MacMD Viewer 的快速查看扩展
4. 如需双击打开 `.md` 时默认用它，右键文件 →「显示简介」→「打开方式」选择 MacMD Viewer，再点「全部更改」

第 3 步和第 4 步是两件独立的事：启用扩展只影响空格预览，不改变默认打开方式。

## 在访达里按空格预览

启用快速查看扩展后，选中任意 `.md` 文件按空格，直接显示渲染结果：标题层级、表格、代码块、Mermaid 图表都在预览窗口中。

用途是找文件时不用先打开应用：在文件夹里翻文档，看标题和结构就能判断是哪一份。

![在访达里按空格，用快速查看直接渲染整篇需求文档](/media/macmd-viewer/quicklook.jpg)

快速查看同样适用于聚焦搜索和应用的打开对话框。

## 图表与缩放

MacMD Viewer 支持标准 Mermaid 语法，写在代码块里即可渲染：

- 流程图
- 时序图
- 状态机
- 甘特图
- 饼图
- ER 图

不需要插件或额外配置，渲染离线完成。1.8.2 起可以直接打开 `.mmd` 和 `.mermaid` 文件。

缩放范围是 50%–300%，快捷键 `⌘+`、`⌘−`、`⌘0` 复位。配合左侧目录，可以在投屏时放大某张架构图，讲完再缩回全篇。

## 和编辑器怎么配合？

MacMD Viewer 不接管写作，只监听文件变化：

- 在 VS Code、Zed、Vim 或其他编辑器里修改并保存
- MacMD Viewer 中打开的文档自动刷新
- `⇧⌘E` 用外部编辑器打开当前文件
- `⌥⌘C` 复制当前文档的 Markdown 源码

对 AI 编程工具，这条流程的差别在于省掉手动刷新：生成的计划文件一落盘，阅读器里就更新了。

1.8.3 补充了跨文件夹链接：文档里写 `../business_rules.md` 这类相对路径，点击会在新标签页打开，带 `#heading` 时跳到对应标题。首次访问会请求该文件夹的访问权限。

## 导出 PDF

`⇧⌘P` 导出为 PDF，保留当前主题下的图表、代码高亮、表格、本地图片和可点击链接。导出结果是单页连续排版，没有水印和页脚。

需要 A4 分页时用 `⌘P` 走系统打印对话框。

## 其他功能

- **12 套主题**：明暗版本跟随系统外观切换
- **目录侧栏**：自动提取标题，滚动时高亮当前章节，底部显示字数和阅读时长
- **代码块**：语法高亮、一键复制、可选自动换行
- **URL Scheme**：`markdownviewer://`，可从 Alfred、Raycast 或脚本打开文件
- **分发渠道**：官网、Mac App Store、Homebrew、Setapp

## 价格与授权

- 19.99 美元，一次买断
- 一个授权同时用于一台 Mac
- 没有订阅，没有内购
- **没有免费试用，也没有免费版**

最后一条需要提前确认：官网明确不提供试用，购买前只能看官网的截图和视频。

## 和同类工具的分工

| 工具 | 类型 | 主要用途 |
| --- | --- | --- |
| [Typora](/article/typra-v1-9-5/) | 编辑器 | 写作与阅读一体，所见即所得 |
| [MarkEdit](/article/markedit/) | 编辑器 | 轻量纯文本写作 |
| Obsidian | 知识库 | 双链、标签、插件与长期积累 |
| VS Code | 编辑器 | 写作、预览、调试在同一窗口 |
| MacMD Viewer | 阅读器 | 只渲染本地 Markdown，交给别的工具写作 |

同类里还有 Marked 2 这类预览工具，官网提供了[与 Typora、MacDown、Marked 2、MarkText 的对比页](https://macmdviewer.com/vs)。

## 有哪些限制？

- 不能编辑，改一个字也要切到其他工具
- 没有文件库、文件夹管理、双链、标签
- 没有 iOS 版，只在 Mac 上
- 没有试用，19.99 美元买前无法验证
- 一个授权一台 Mac，多设备需要另买
- 依赖 macOS 快速查看机制，扩展未启用时只能应用内打开
- 需要 macOS 14 或更高版本

## 适合谁？

适合：

- 每天读 README、技术方案、API 文档的开发者
- 用 AI 编程工具、需要查看生成文档的人
- 要把 Markdown 投屏讲解或导出 PDF 的人
- 已经在别的工具里写作、只缺阅读器的人

不适合：

- 想用一款软件同时写作和阅读的人
- 需要笔记库、双链、标签管理的人
- 使用 macOS 13 或更早系统的用户
- 不接受无试用付费的人
- 主要在 iPhone 或 iPad 上看文档的人

## 最后判断

MacMD Viewer 去掉编辑，把阅读相关的部分做完整：空格预览、图表、缩放、实时刷新、PDF 导出。

如果 Markdown 主要来自别人或 AI，你只需要读，这个范围够用。如果你自己写文档，写作仍然要回到编辑器，它只负责显示结果。

购买前只需要确认一件事：每天打开 `.md` 文件的次数，是否多到值得为阅读单独买一个应用。

封面与界面图片来自 MacMD Viewer 官网。
