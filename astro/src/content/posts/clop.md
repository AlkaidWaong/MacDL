---
urlSlug: "clop"
title: "Clop：免费开源的 Mac 剪贴板压缩工具，复制图片视频自动优化大小"
date: "2024-10-17"
updatedAt: "2026-06-26"
description: "Clop 是一款 macOS 剪贴板优化工具，自动压缩图片、视频、PDF 文件大小。官网定位：Copy large, paste small, send fast。免费开源，Pro 版 €15。"
quickTake: "Clop 官网一句话说清自己的价值：Copy large, paste small, send fast。它不是剪贴板管理器，不负责帮你找历史记录。它的任务更简单：你复制一张截图或一段视频，它自动压缩文件大小，让你粘贴出去时更快。"
bestFor:
  - "经常分享截图和视频到邮件/社媒的人"
  - "在意文件大小和上传速度的人"
  - "想要免费开源方案的用户（Pro €15）"
officialUrl: "https://lowtechguys.com/clop/"
faqs:
  - question: "Clop 和剪贴板管理器有什么区别？"
    answer: "Clop 不是剪贴板管理器（不记录复制历史），而是剪贴板优化器。你复制图片/视频后它自动压缩大小。和 Maccy/CleanClip 互补，可以一起装。"
  - question: "Clop 压缩后图片质量会下降吗？"
    answer: "「质量损失极小甚至没有。」可以自定义压缩参数。Clop 使用开源且经过长期验证的编码器。"
  - question: "Clop Pro 多少钱？"
    answer: "Clop Pro €15 终身授权。免费版（GPLv3）也够用。"
  - question: "Clop 安全/隐私吗？"
    answer: "官网强调：一切发生在你的设备上。不使用云服务，不发送文件数据到互联网。"
  - question: "Clop 支持哪些格式？"
    answer: "图片、视频、PDF。自动转换不兼容格式（HEIC→JPG, MOV→MP4）。"
  - question: "Clop 怎么安装？"
    answer: "可以直接从官网下载，也可以 brew install clop（Homebrew 已支持）。macOS 13.0+。"
categories:
  - "效率工具"
tags:
  - "图片压缩"
  - "剪贴板优化"
  - "Clop"
  - "开源"
aliases: []
draft: false
heroImage: "/media/clop/hero.png"
---

# Clop：复制图片视频自动压缩，分享更快

Clop 官网定位：**「Image, video, PDF and clipboard optimiser. Copy large, paste small, send fast.」**

**版本：2.6.3** | **价格：免费（GPLv3）/ Pro €15 终身**

**软件官网：**[https://lowtechguys.com/clop/](https://lowtechguys.com/clop/)

**系统要求：macOS 13.0+（Ventura 及以上）**

**安装：官网下载 或 $ brew install clop**

---

## 核心功能详解

### 复制即优化
「只要 Clop 在运行，每次复制图片到剪贴板，Clop 都会将其优化到尽可能小的尺寸。质量损失极小甚至没有，随时可以在任何应用中粘贴。」

### 屏幕录制优化
「发送屏幕录制变快 10 倍。Clop 会在你停止录制后立即优化视频。」

支持的操作：
- 裁剪视频到任意尺寸或比例
- 转换为 GIF
- 加速/减速
- 静音或移除音频
- 编码为兼容格式（如 MP4）

**Apple Silicon 优化**：使用专用媒体引擎，实现低功耗视频编码。

### 缩放（Downscale in a pinch）
通过快捷键或浮动按钮将图片/视频缩放到任意分辨率。快捷键支持增量缩小（90%→10%）。

### 拖放优化
将文件拖到 Clop 浮窗即可原地优化。URL 会自动下载后再优化。

### 预设区域（Preset Zones）
通过 Shortcuts 设置特定操作，例如：
- 缩放 50% + 转换为 webp
- 用 Dropshare 上传并复制 Markdown 链接
- 加水印
- 裁剪成 16:9 并加入笔记

### Dropshare 集成
优化后直接上传到各类服务。

### Yoink / Dockside 集成
优化后加入文件搁架，方便后续使用。

### 格式转换
自动将 HEIC、tiff、mov 等不兼容格式转换为通用格式。转换完全可配置，原始文件保留在备份文件夹中。

---

## 隐私

官网强调：**「一切都发生在你的设备上。Clop 不使用任何云服务，不发送任何文件数据到互联网。使用的编码器是开源的，经过数十年的实战验证。」**

---

## 适合什么人

- 经常分享截图到邮件、Slack、社媒的人
- 上传视频前希望自动缩小体积的人
- 对文件大小敏感的用户
- 想要免费开源方案的人（Pro €15 解锁完整功能）

---

## 总结

Clop 不是必需品，但在适合的场景下非常好用。如果你经常截图分享，和任意一款剪贴板管理器一起装，体验互补。

> **试试 Clop** —— 免费开源，brew install clop 就装好了。和 Maccy 或 CleanClip 一起装不冲突。

### 延伸阅读
- [Mac 剪贴板工具横评](/article/mac-clipboard-tools-comparison)
- [Maccy 详细体验](/article/maccy)
- [CleanClip 详细体验](/article/cleanclip-for-mac)

*最后更新：2026-06-26*
