---
urlSlug: "t3-code"
title: "T3 Code：统一管理 Claude Code、Codex 和 OpenCode 的开源控制中心"
date: "2026-11-19"
updatedAt: "2026-11-19"
description: "T3 Code 是一个开源的编程智能体控制中心，可在同一界面中管理 Claude Code、Codex、OpenCode、Cursor 和其他 Agent，支持桌面、网页和手机端访问，并使用用户已有的订阅。"
quickTake: "T3 Code 不提供模型或转售 token。它在本机运行已安装并已登录的编程 Agent，将线程、Git worktree、diff、提交、PR 和远程访问集中到一个界面。多 Agent、多项目或需要从手机处理任务时，T3 Code 的作用最明确。"
bestFor:
  - "同时使用 Claude Code、Codex、OpenCode 或其他编程 Agent 的开发者"
  - "需要为不同 Agent 线程隔离 Git worktree、审查 diff 和创建 PR 的人"
  - "希望从桌面、浏览器或手机继续查看和处理本机 Agent 任务的人"
price: "免费开源（MIT License）；模型与 Agent 费用由已有订阅或提供商决定"
platform: "macOS（Apple Silicon 与 Intel）、Windows、Linux；iOS 与 Android 客户端"
officialUrl: "https://t3.codes/zh"
sources:
  - name: "T3 Code 中文官网"
    url: "https://t3.codes/zh"
    note: "产品定位、支持 Agent、订阅方式、Git 工作流与开源许可"
  - name: "T3 Code 下载页"
    url: "https://t3.codes/download"
    note: "桌面、移动端和命令行安装方式"
  - name: "T3 Code GitHub 仓库"
    url: "https://github.com/pingdotgg/t3code"
    note: "产品能力、支持 Agent、远程访问与安装说明"
  - name: "T3 Code MIT License"
    url: "https://github.com/pingdotgg/t3code/blob/main/LICENSE"
    note: "开源许可原文"
faqs:
  - question: "T3 Code 是免费的吗？"
    answer: "是。T3 Code 官网和 GitHub 仓库都说明该项目采用 MIT License。T3 Code 本身不转售 token，但 Claude Code、Codex、OpenCode 或其他 Agent 的使用费用仍由相应订阅或提供商决定。"
  - question: "T3 Code 支持哪些 AI 编程 Agent？"
    answer: "官网列出 Claude Code、Codex、Antigravity、OpenCode、Cursor 和 Grok。GitHub 仓库还列出 Kiro、Pi、Muse Code、fx 和兼容 ACP 的 Agent。实际可用性取决于 Agent 是否已在本机安装并登录。"
  - question: "T3 Code 需要 API Key 吗？"
    answer: "T3 Code 使用你已登录的 Agent 或订阅。它不转售 token，也不为 Agent 设置自己的用量上限。具体登录方式由各 Agent 决定，例如 Claude Code 使用 claude auth login，Codex CLI 使用 codex login。"
  - question: "T3 Code 可以从手机使用吗？"
    answer: "可以。T3 Code 提供 iOS 和 Android 客户端。Agent 仍在运行它们的机器上，手机端用于查看线程和处理后续操作。远程访问可通过局域网、Tailscale 或 T3 Connect 配置。"
  - question: "T3 Code 和 OpenCode、Orca ADE 的区别是什么？"
    answer: "OpenCode 是可直接执行编码任务的 Agent；Orca ADE 以多 Agent worktree 工作台为重点；T3 Code 的重点是控制和调度本机已安装的多个 Agent。三者可以同时使用，选择取决于你需要的是 Agent、本机多任务管理，还是统一控制界面。"
categories:
  - "开发工具"
  - "AI"
tags:
  - "T3 Code"
  - "Claude Code"
  - "Codex"
  - "OpenCode"
  - "AI Agent"
  - "Git worktree"
  - "工作流"
aliases: []
draft: false
heroImage: "/media/t3-code/hero.webp"
---

T3 Code 是一个编程智能体控制中心。它在本机运行已安装的 Agent，并在同一界面中管理线程、代码变更、Git worktree、提交和远程访问

T3 Code 不提供模型，也不转售 token。它使用你已经登录的 Claude Code、Codex、OpenCode、Cursor、Grok 和其他 Agent。模型费用、订阅额度和登录状态仍由对应服务处理

## T3 Code 可以管理哪些 Agent

T3 Code 官网列出 Claude Code、Codex、Antigravity、OpenCode、Cursor 和 Grok。GitHub 仓库还列出 Kiro、Pi、Muse Code、fx 及兼容 ACP 的 Agent

前提是 Agent 已在运行 T3 Code 的机器上安装并登录。例如：

```bash
claude auth login
```

或：

```bash
codex login
```

T3 Code 接入这些已登录的 Agent。它不替代 Agent 的安装、授权或模型订阅

## T3 Code 的主要功能

| 功能 | 用途 |
| --- | --- |
| 多 Agent 线程 | 在一个界面中启动和查看不同 Agent 的线程 |
| Agent 切换 | 在线程进行时切换 Agent 或模型 |
| Git worktree | 让每个线程在独立 worktree 中处理代码 |
| Diff 审查 | 查看变更后决定是否保留 |
| GitHub PR | 提交、推送并创建 Pull Request |
| 桌面、网页和手机端 | 在不同设备查看同一服务器上的线程 |
| 远程访问 | 通过局域网、Tailscale 或 T3 Connect 连接运行 Agent 的机器 |
| Fork 与自托管 | 项目采用 MIT License，可以 fork、修改和自行分发 |

Git worktree 用于隔离不同任务的工作目录。多个 Agent 同时修改同一仓库时，独立 worktree 可以避免它们直接写入同一份工作文件。完成后仍需要人工审查 diff、测试和合并代码

## T3 Code 不做什么

T3 Code 不负责提供 Claude、OpenAI、Google 或其他模型的订阅额度

它也不替代编程 Agent 本身。没有安装和登录 Claude Code、Codex、OpenCode 或其他兼容 Agent 时，T3 Code 没有可调度的 Agent

它不保证每个 Agent 都有完全一致的功能。不同 Agent 的权限、工具调用、会话恢复和账户限制由各自实现决定

## T3 Code、OpenCode 和 Orca ADE 的区别

| 工具 | 主要作用 | 适合的情况 |
| --- | --- | --- |
| [OpenCode](/article/opencode-go) | 开源 AI 编程 Agent，可连接免费模型、自有提供商或 OpenCode Go | 需要直接执行编码任务，并选择模型和提供商 |
| [Orca ADE](/article/orca-ade) | 多 Agent 的桌面开发环境和 worktree 工作台 | 需要在桌面中管理并行 Agent、终端、差异和远程运行 |
| T3 Code | 已安装 Agent 的控制和调度界面 | 已使用多个 Agent，需要统一线程、worktree、Git 与手机端访问 |

这些工具可以同时使用。例如，可以将 OpenCode 作为 T3 Code 管理的 Agent，也可以为不同任务选择 Claude Code、Codex 或 OpenCode

三款工具按执行、调度和 worktree 隔离的完整分工见 [OpenCode、T3 Code 与 Orca ADE 横评](/article/opencode-t3-code-orca-comparison)

## 在 macOS 上安装 T3 Code

T3 Code 提供 Apple Silicon 和 Intel Mac 的桌面安装包。也可以使用 Homebrew：

```bash
brew install --cask t3-code
```

命令行版本会安装 `t3` 命令：

```bash
curl -fsSL https://t3.codes/install.sh | sh
```

安装后运行：

```bash
t3
```

T3 Code 会启动服务器并打开网页应用。首次使用时，应先安装并登录至少一个 Agent，再在 T3 Code 中创建线程

## 从手机或另一台电脑访问

T3 Code 有 iOS 和 Android 客户端。Agent 和代码仍在原来的电脑或远程机器上运行

GitHub 仓库说明可以通过以下方式连接到运行 T3 Code 的机器：

- 同一局域网
- Tailscale
- T3 Connect

远程访问前应确认代码所在机器的网络、账户和权限设置。手机端可以处理线程和后续操作，但不能替代代码审查、测试或本机环境验证

## 适合哪些工作流

T3 Code 适合以下情况：

1. 同一项目同时运行 Claude Code、Codex 和 OpenCode
2. 每个任务需要独立分支或 Git worktree
3. Agent 完成后需要集中查看 diff、提交和创建 PR
4. 离开电脑后需要从网页或手机查看线程、批准操作或继续任务

如果只使用一个 Agent，并且只在终端中工作，直接使用该 Agent 的 CLI 可能更简单。T3 Code 的价值来自统一管理多个线程、多个 Agent 和多个访问设备

## 价格和费用

T3 Code 本身免费，采用 MIT License

使用成本主要来自 Agent 和模型提供商：

- Claude Code 使用 Anthropic 账户或相应 API、订阅
- Codex 使用 OpenAI 账户或相应 API、订阅
- OpenCode 可以使用免费模型、自有提供商，或 [OpenCode Go](/article/opencode-go)
- 其他 Agent 按各自的登录和计费方式处理

T3 Code 官网说明它不转售 token，也不设自己的额度上限。使用前应分别确认每个 Agent 的套餐、地区和数据处理规则

## 常见问题

### T3 Code 是否需要购买额外套餐

不需要购买 T3 Code 套餐。T3 Code 是免费开源项目，但你使用的 Agent 或模型可能需要单独订阅或按量付费

### T3 Code 是否能让多个 Agent 同时修改同一个项目

可以运行多个 Agent 线程。T3 Code 支持让每个线程使用独立 Git worktree。代码仍应经过 diff 审查、测试和合并，避免把并行输出直接写入主分支

### T3 Code 能否替代 Cursor 或编辑器

不能直接替代。T3 Code 负责控制和调度 Agent。编辑代码、运行调试器和使用编辑器扩展仍需要 Cursor、[Zed](/article/zed-editor) 或其他编辑器

### T3 Code 的手机端是否在手机上运行 Agent

不是。Agent 运行在已安装它们的电脑或远程机器上。手机端用于远程查看和处理这些线程

## 资料来源

- [T3 Code 中文官网](https://t3.codes/zh)
- [T3 Code 下载页](https://t3.codes/download)
- [T3 Code GitHub 仓库](https://github.com/pingdotgg/t3code)
- [T3 Code MIT License](https://github.com/pingdotgg/t3code/blob/main/LICENSE)

封面图片来自 [T3 Code 官网](https://t3.codes/zh)
