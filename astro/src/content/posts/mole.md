---
urlSlug: "mole"
title: "Mole：把清理、卸载、磁盘分析和系统监控放进一个 Mac 应用"
seoTitle: "Mole：Mac 清理、卸载、磁盘分析与系统监控工具"
date: "2026-11-15"
featured: true
featuredRank: 1
updatedAt: "2026-11-15"
description: "Mole 是一款 macOS 系统优化工具，整合缓存清理、应用卸载、系统维护、磁盘分析和实时状态监控，另有免费开源 CLI。本文整理功能、价格、限制和适合人群。"
quickTake: "Mole 把以前分散在 CleanMyMac、AppCleaner、DaisyDisk、iStat Menus 里的常用功能放进一个 Mac 应用。它先扫描再确认，Mac 版 19 美元买断，命令行版免费开源。"
price: "19 美元买断，两台 Mac"
platform: "macOS 14+"
officialUrl: "https://mole.fit/zh"
lizhiUrl: "https://lizhi.shop/products/mole?cid=j13endai&utm_medium=z6zyprgn"
lizhiName: "Mole"
sources:
  - name: "Mole 中文官网"
    url: "https://mole.fit/zh"
    note: "功能、价格、试用与系统要求"
  - name: "Mole CLI 与 Mac 版对比"
    url: "https://mole.fit/zh/blog/mole-cli-vs-mac-app"
    note: "两个版本的功能差异和共同数据"
  - name: "Mole GitHub 仓库"
    url: "https://github.com/tw93/Mole"
    note: "开源命令行版、版本与贡献者信息"
quotes:
  - text: "几十 GB 系统数据，逐项确认后再清。"
    source: "Mole 中文官网"
    url: "https://mole.fit/zh"
bestFor:
  - "Mac 磁盘空间经常不足的人"
  - "需要清理 AI 编程工具缓存和旧会话的人"
  - "想统一管理应用卸载、更新和残留的人"
  - "希望用可视化方式分析磁盘占用的人"
  - "需要菜单栏查看 CPU、温度、风扇和网络的人"
faqs:
  - question: "Mole 是什么？"
    answer: "Mole 是一款 macOS 系统优化工具，整合缓存清理、应用卸载与更新、系统维护、磁盘分析和实时状态监控。另有免费开源的命令行版本。"
  - question: "Mole 免费吗？"
    answer: "命令行版免费开源。Mac 应用 19 美元买断，可用在两台 Mac 上，提供 14 天退款。扫描免费，删除等操作在购买前有试用次数。"
  - question: "Mole Mac 版和命令行版有什么区别？"
    answer: "命令行版通过 mo clean、mo uninstall、mo optimize、mo analyze 和 mo status 操作；Mac 版提供图形界面、磁盘地图、菜单栏状态、风扇控制、启动项管理和应用更新。"
  - question: "Mole 会删除个人文件吗？"
    answer: "Mole 的清理范围以缓存、日志、临时文件、卸载残留和可重新生成的数据为主，个人文档、照片和对话记录不应出现在一键清理清单里。删除前仍应逐项确认。"
  - question: "Mole 支持哪些 macOS 版本？"
    answer: "Mac 版要求 macOS 14 或更高版本。命令行版的支持范围以 GitHub 仓库说明为准。"
  - question: "Mole 能清理 AI 工具的数据吗？"
    answer: "可以清理 Claude Code、Codex、Cursor 等工具的缓存和旧版本；旧会话、worktree 和闲置命令行工具需要用户确认后再删除。"
  - question: "Mole 有 Windows 版吗？"
    answer: "有，Windows 版单独销售，19 美元买断，可用在两台电脑上。Mac 版许可证不能激活 Windows 版。"
categories:
  - "系统工具"
  - "效率工具"
tags:
  - "Mole"
  - "Mac 清理"
  - "磁盘分析"
  - "系统监控"
  - "开源"
aliases: []
draft: false
heroImage: "/media/mole/hero.jpg"
---

Mac 用久了，空间会被几类东西慢慢吃掉：应用缓存、日志、旧安装包、开发工具构建产物，以及最近越来越多 AI 编程工具留下的会话和缓存。

Mole 把这些清理、卸载、分析和监控功能放进了一个 Mac 应用。它的命令行版免费开源，Mac 版 19 美元买断，要求 macOS 14 或更高版本。

## Mole 是什么？

Mole 是一款 macOS 系统优化工具，主要包含五个部分：

- 清理：缓存、日志、临时文件、系统数据、卸载残留
- 软件：卸载应用、检查更新、管理登录项和后台项目
- 优化：维护 Quick Look、缓存、元数据和系统服务
- 分析：用色块展示磁盘占用，定位大文件和文件夹
- 状态：实时查看 CPU、内存、GPU、磁盘、网络、温度和风扇

官网把它概括为“一个软件顶五个”，对应以前需要分别安装的 CleanMyMac、AppCleaner、DaisyDisk、iStat Menus 等工具。

## 清理：先看清单，再决定删什么

Mole 的清理页面会先扫描，再把结果按类别列出。你可以逐项查看、跳过，或加入保护清单。

清理范围包括：

- App 和系统缓存
- 日志和临时文件
- 浏览器、云盘和通讯工具缓存
- 开发工具构建产物
- 旧安装包和过期系统文件
- 卸载残留

官网把磁盘内容分成三类：可重新生成、重建代价高、不可替代。缓存和构建产物属于第一类；本地模型、设备支持文件属于第二类；文档、照片、邮件和项目状态属于第三类，不应进入一键清理。

个人数据不在清理范围内，本地模型默认不清理。旧 Ollama 模型和 AI 会话只在用户勾选后才处理。

## AI 工具清理

Mole 单独处理 Claude Code、Codex、Cursor 等 AI 工具留下的数据：

- 工具缓存和旧版本
- 很久没打开的 Codex 旧会话
- 可清理的 worktree
- 闲置的 AI 命令行工具

缓存默认勾选，工作会话和工具由用户决定。对经常同时跑多个 Agent 的开发者和内容创作者，这部分比普通系统缓存更实际。

## 软件：卸载、更新和残留

Mole 可以从 Sparkle、App Store、Homebrew 等来源检查应用更新。

卸载应用时，它会一并展示残留文件、命令行工具和占用空间，确认后再移除。支持的登录项和后台项目也可以在同一页管理。

它不会直接替用户判断所有后台项目是否安全。无法确认身份的项目会转到系统设置处理。

## 优化：需要权限的操作集中授权

系统维护包括 Quick Look、缓存、元数据和系统服务。需要管理员权限的操作会集中授权一次，不需要反复输入密码。

有风险或不适合当前系统的维护项目会自动跳过，并在完成后列出执行结果和跳过原因。

## 分析：看清磁盘被谁占用

Mole 的磁盘分析使用矩形树图，按色块大小显示文件和文件夹的占用。鼠标移到文件夹上，可以查看里面装了什么；重复扫描后，还能看出哪些 App 比上次更大。

右键可以在 Finder 中显示或移到废纸篓。系统目录只能查看，只有废纸篓里的项目会在永久删除前再次确认。

## 状态：菜单栏和实时面板

Mole 可以查看：

- CPU、内存、GPU、磁盘和网络
- 温度和风扇转速
- Apple 芯片的频率和功耗
- Mac、iPhone、iPad 和蓝牙配件电量
- 可排序、可钉选的进程

网络卡片可以查看各 App 流量、测速，并打开 Wi-Fi 低延迟模式。

## 免费命令行版和 Mac 版怎么选？

Mole 的命令行版免费开源，可以通过 Homebrew 安装：

```bash
brew install mole
```

常用命令包括 `mo clean`、`mo uninstall`、`mo optimize`、`mo analyze` 和 `mo status`。

命令行版适合已经习惯终端、需要 `--dry-run`、`--json` 或脚本化的人。Mac 版增加了图形界面、磁盘地图、菜单栏状态、风扇控制、启动项管理和应用更新，更适合不想在终端里操作的人。

两个版本共享保护清单和操作日志。在一边保护的路径，另一边也会跳过。

## 价格与试用

Mac 版售价 19 美元，一次买断，可用在两台 Mac 上，提供 14 天退款。

扫描免费。Mac 应用只对删除等破坏性操作收费，每项工具在激活前有试用次数，方便先比较扫描结果。

Windows 版单独销售，也是 19 美元买断，可用在两台电脑上。Mac 版许可证不能激活 Windows 版。

## 用户评价与争议

官网收录了不少公开帖子。[Peter Steinberger](https://x.com/steipete/status/2003922592001036760) 的评价很直接：“Mole is brilliant.”

[数字生命卡兹克](https://x.com/Khazix0918/status/2110286329993171042) 提到，AI Agent 时代产生了大量缓存和 CLI 工具，Mole 是他用过最好的清理工具之一。[猫总](https://x.com/catmangox/status/2091753679376596997) 则表示，用 Mole 后不再续费 CleanMyMac。

也有用户提到清理范围偏激进。[Jahir Fiquitiva](https://x.com/jahirfiquitiva/status/2054334536985575676) 说他很喜欢 Mole，但清理时重置了 Spotify 设置和系统屏幕保护程序设置。这类反馈说明，删除前逐项查看清单仍然必要，尤其是带自定义设置的应用。

## 有哪些限制？

- Mac 版要求 macOS 14 或更高版本
- 清理工具不可能对所有 App 的自定义设置都判断准确，删除前需要看清单
- 它不是备份工具，也不能替代恶意软件清理
- 系统目录只能查看，部分分析结果可能是部分扫描
- 命令行版和 Mac 版的删除范围不完全相同，不能把两者当成完全相同的工具
- Windows 版需要单独购买

## 适合谁？

更适合：

- Mac 磁盘空间经常不足的人
- 经常使用 Claude Code、Codex、Cursor 等 AI 工具的人
- 想统一管理应用卸载、更新和残留的人
- 希望用可视化方式分析磁盘占用的人
- 需要菜单栏查看 CPU、温度、风扇和网络的人

不太适合：

- 仍在使用 macOS 13 或更早系统的人
- 只需要偶尔清理一次缓存的人
- 希望清理工具自动处理所有设置、不需要确认的人
- 需要备份、杀毒或专业磁盘修复的人

## 最后判断

Mole 把清理、卸载、优化、分析和监控放进了一个应用，覆盖了 Mac 日常维护里最常见的一组动作。它的核心不是“扫出多大的数字”，而是先列出文件，再让用户决定删什么。

如果你经常被磁盘空间和 AI 工具缓存困扰，Mac 版的图形界面和菜单栏状态会比命令行更省事。如果你习惯终端，免费开源的 CLI 已经能完成大部分基础工作。

封面图片来自 Mole 官网。
