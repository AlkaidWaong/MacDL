---
urlSlug: "zed-editor"
title: "Zed 编辑器适合谁：从 VS Code 或 Cursor 切换前，先看这 5 件事"
date: "2026-11-19"
updatedAt: "2026-11-19"
description: "Zed 是一款开源代码编辑器，支持 macOS、Linux 和 Windows，并把多人协作、AI Agent、终端和 Git 放进同一个工作区。本文说明它适合谁、免费版和 Pro 的区别，以及从 VS Code 或 Cursor 切换前需要接受的限制。"
quickTake: "如果你想要更轻的编辑器、愿意把 AI 模型和 Agent 自己接进来，Zed 值得试；如果工作依赖大量 VS Code 扩展，或想直接获得一个配置最少的 AI IDE，先别急着迁移。"
bestFor:
  - "想从 VS Code 迁移部分日常编码工作、但愿意保留原有编辑器作为后备的人"
  - "使用 Claude Agent、Codex CLI、OpenCode 等外部 Agent，并希望在编辑器内管理线程的人"
  - "在意原生编辑响应、内置终端、Git 和多人协作，又不想依赖大量扩展的人"
price: "个人版免费；Pro 为 10 美元/月，含 5 美元 token 额度；Business 为 30 美元/人/月"
platform: "macOS 12.0+（Intel 与 Apple Silicon）；同时支持 Linux 和 Windows"
officialUrl: "https://zed.dev/"
sources:
  - name: "Zed 官网"
    url: "https://zed.dev/"
    note: "产品定位、内置功能与支持平台"
  - name: "Zed 定价页"
    url: "https://zed.dev/pricing"
    note: "个人版、Pro 与 Business 的当前价格和额度"
  - name: "Zed 安装与系统要求"
    url: "https://zed.dev/docs/installation"
    note: "macOS 版本与硬件支持范围、Homebrew 安装方式"
  - name: "Zed：从 VS Code 迁移"
    url: "https://zed.dev/docs/migrate/vs-code"
    note: "可导入设置、不能导入的内容及扩展差异"
  - name: "Zed AI 概览"
    url: "https://zed.dev/docs/ai/overview"
    note: "Zed Agent、外部 Agent、终端线程和模型接入方式"
  - name: "Zed GitHub 仓库"
    url: "https://github.com/zed-industries/zed"
    note: "开源仓库与 GPL-3.0-or-later 授权说明"
faqs:
  - question: "Zed 是免费的吗？"
    answer: "个人版免费，可以使用自己的 API 密钥，或接入 Claude Agent、Codex CLI 等外部 Agent。Pro 为每月 10 美元，包含不限量编辑预测和 5 美元 token 额度；超出额度后按使用量计费。"
  - question: "Zed 支持 macOS 吗？"
    answer: "支持。官方要求 macOS 12.0 Monterey 或更高版本，并支持符合要求的 Intel Mac 和 Apple Silicon Mac。可从官网下载，或通过 Homebrew 执行 brew install --cask zed 安装。"
  - question: "Zed 能直接迁移 VS Code 设置吗？"
    answer: "可以导入字体、缩进、保存格式化、终端、Git、文件排除等常用设置，也可选择 VS Code 键位。但官方明确不导入扩展和自定义快捷键，依赖扩展的工作流需要逐项核对。"
  - question: "Zed 和 Cursor 的关系是什么？"
    answer: "两者都提供 AI 编码能力，但选择时应先看工作流。Zed 的个人免费版允许接入自有 API 和外部 Agent；其 Pro 提供 Zed 托管模型。若你依赖 Cursor 已配置好的模型、规则和扩展生态，迁移成本需要单独评估。"
  - question: "Zed 可以使用 Claude Code 或 Codex 吗？"
    answer: "可以。Zed 文档将外部 Agent 和终端线程列为 AI 工作流的一部分；官网还说明可以通过 ACP 接入 Claude Agent、Codex 或 OpenCode 等 Agent。不同外部 Agent 可用的线程恢复、用量展示等能力会有所不同。"
categories:
  - "开发工具"
  - "AI"
tags:
  - "Zed"
  - "代码编辑器"
  - "VS Code"
  - "Cursor"
  - "Claude Code"
  - "Codex"
  - "AI 编程"
aliases: []
draft: false
heroImage: "/media/zed/hero.webp"
---

Zed 不只是“又一个代码编辑器”。它把编辑、终端、Git、多人协作和 AI Agent 放进同一个原生工作区，想解决的是开发者在编辑器、终端和多个 Agent 之间来回切换的问题。

但它并不自动适合所有人。Zed 最大的吸引力是轻、快和把 AI 工作流做进核心界面；最大的迁移成本则是扩展生态不能照搬。你若已经有一套依赖 VS Code 扩展的环境，先用它打开一个真实项目，而不是立刻替换主力编辑器。

## 先说结论

- **值得先试**：你想把 Claude Agent、Codex CLI 等工具留在编辑器工作流里，同时愿意自己选择模型、API 或外部 Agent。
- **可以从 VS Code 迁移一部分工作**：你主要依赖语言服务、终端、Git、任务和常见编辑设置，而不是一长串专用扩展。
- **不适合作为唯一编辑器**：你必须依赖 VS Code 扩展、Dev Container 工作流或某个没有等价 Zed 扩展的团队工具。
- **不要把它当作自动免费的 AI 服务**：编辑器本体免费，但模型调用仍取决于你自己的 API、外部 Agent 账户，或 Zed Pro 的 token 用量。

## 关键数据

| 项目 | 当前信息 | 核对日期 | 来源 |
| --- | --- | --- | --- |
| 开源许可 | 主要采用 GPL-3.0-or-later；标注部分组件采用 Apache-2.0 | 2026-11-19 | [GitHub 仓库](https://github.com/zed-industries/zed) |
| macOS 要求 | macOS 12.0 Monterey 或更高；支持 Intel 与 Apple Silicon | 2026-11-19 | [安装文档](https://zed.dev/docs/installation) |
| 安装方式 | 官网下载，或 `brew install --cask zed` | 2026-11-19 | [安装文档](https://zed.dev/docs/installation) |
| 个人版 | 免费；可使用自有 API 或外部 Agent | 2026-11-19 | [定价页](https://zed.dev/pricing) |
| Pro | 10 美元/月；包含不限量编辑预测与 5 美元 token 额度 | 2026-11-19 | [定价页](https://zed.dev/pricing) |
| Business | 30 美元/人/月；提供组织级 AI 策略、数据治理和用量可见性 | 2026-11-19 | [定价页](https://zed.dev/pricing) |

## Zed 解决的不是“不会写代码”，而是上下文不断断开

很多人的 AI 编程流程仍是：在编辑器里看文件，切到终端启动 Claude Code 或 Codex，再回编辑器检查 diff；项目一多，终端标签、任务上下文和 Agent 对话很快就散开。

Zed 的思路是把这几件事并列放在一个工作区里。它有自己的 Agent Panel，也支持外部 Agent 和 Terminal Threads；线程可以按项目组织，并可同时运行多个线程。对需要看着 Agent 改代码、随时打开 diff 或切回手动编辑的人，这个布局比“一个聊天侧栏”更完整。

如果你的需求是管理多个独立 worktree 和多个 Agent 的生命周期，[Orca ADE](/article/orca-ade) 仍是更专门的选择；Zed 的重点首先是编辑器本身。

## 从 VS Code 过来，哪些东西能带走

Zed 官方提供 VS Code 迁移指南。首次设置时可导入字体、字号、缩进、自动保存、保存时格式化、文件排除、终端字体与环境变量、Git 显示等常见配置；也可以选择 VS Code 键位。

这意味着“编辑习惯”通常可以较快迁过去。但有两项不能混为一谈：

1. **扩展不会自动导入。** Zed 官方明确说明不会导入 VS Code 扩展或自定义快捷键。
2. **不是每个扩展都有一对一替代。** Zed 的扩展主要覆盖语言支持、主题和语法等核心能力；官方也提示，依赖 DevOps、容器或测试运行器扩展的用户，未必能找到对应替代品。

所以最稳妥的迁移方式是：拿一个真实仓库跑一周，列出每天必开的扩展、调试方式和任务命令，再决定是否替换主力编辑器。

## AI 功能怎么选：自带 Agent、外部 Agent，还是自己的 API

Zed 的 AI 文档把工作流分成三条路：

| 方式 | 适合什么情况 | 你需要准备什么 |
| --- | --- | --- |
| Zed Agent | 想在编辑器中直接让 Agent 读、写和运行项目代码 | 配置 Zed 托管模型、API、订阅、网关或本地模型 |
| External Agents | 已经有自己的 Agent 工具和配置 | 安装支持 ACP 的外部 Agent |
| Terminal Threads | 习惯在终端里运行 CLI/TUI Agent | 在 Zed 的 Agent Panel 中打开终端线程 |

个人免费版并不包含无限量托管模型调用。它更适合两类人：已有 API 预算的人，或本来就使用 Claude Agent、Codex CLI 等外部工具的人。需要 Zed 托管模型、编辑预测和统一账单时，再看 Pro 是否值得。

如果你当前主要任务是给 Claude Code、Codex、OpenCode 切换模型和管理配置，先看 [CC Switch](/article/cc-switch-for-mac) 这类配置工具；Zed 是承接编码和审查的编辑器，不替你处理所有账户与模型选择。

## Zed、VS Code 和 Cursor 该怎么选

这里不适合给出“谁最好”的答案。三者的优势不在同一层：

| 你的主要问题 | 更值得优先试的方向 |
| --- | --- |
| 已有很多 VS Code 扩展，团队文档和调试流程都围绕它 | 继续用 VS Code，先把 Zed 当作小项目或特定语言的试用编辑器 |
| 想要原生编辑器体验，并愿意自行选择 AI 提供商或外部 Agent | Zed |
| 希望开箱就把 AI 模型、规则、补全和编辑器体验放在一个商业产品里 | 继续评估 Cursor 的现有工作流和成本 |
| 已经在终端驱动 Agent，但希望让对话、项目、diff 和手动编辑靠得更近 | Zed，或搭配 [Orca ADE](/article/orca-ade) |

这个表不是性能排名。尤其“快不快”取决于项目规模、语言服务、扩展、硬件和网络，不能只根据官网宣传下结论。

## 你应该先验证的 5 件事

在把 Zed 设为默认编辑器前，用同一个项目检查下面五项：

1. **语言服务**：补全、跳转定义、重命名、格式化和诊断是否符合你的语言栈。
2. **扩展缺口**：列出 VS Code 中每天使用的扩展，确认 Zed 是否已有内置功能或可用替代。
3. **调试与任务**：检查当前的测试、构建和调试命令能否通过任务或终端完成。
4. **AI 账单路径**：明确使用自己的 API、现有订阅、外部 Agent，还是 Zed Pro；不要把“能接入模型”理解成“模型免费”。
5. **团队协作**：如果你要用内置协作，先用小范围项目测试账户、权限、屏幕共享和网络环境。

## 值不值得装

值得安装，但不值得盲目迁移。

对想减少编辑器与 Agent 之间切换的人，Zed 已经提供了明确路径：原生编辑器、终端线程、外部 Agent、内置 Agent、Git 和多人协作都在一个产品里。对依赖 VS Code 扩展生态的人，它更像一个需要先验证兼容性的候选，而不是立刻替换掉全部工作流的理由。

最简单的开始方式是在 macOS 上执行：

```bash
brew install --cask zed
```

然后用 `zed .` 打开一个真实项目。若一周后你没有频繁回去找缺失扩展，Zed 才有成为主力编辑器的可能。

## 常见问题

### Zed 适合新手吗？

可以用，但它更适合已经知道“编辑器、终端、语言服务和模型调用分别是什么”的开发者。新手可以先用它打开小项目，熟悉命令面板、文件搜索和内置终端，再决定是否配置 AI。

### Zed 的 AI 会把代码发到哪里？

取决于你选择的模型和接入方式。Zed 支持托管模型、第三方 API、订阅、网关、本地模型和外部 Agent；不同服务商的数据边界不同。配置前应阅读对应提供商和 Zed 的 AI 隐私说明。

### Zed 能完全替代 VS Code 吗？

对只依赖通用编辑、语言服务、Git、终端和常见任务的项目，有可能；对依赖很多专用扩展的项目，不应先假设可以。官方迁移文档明确指出扩展和自定义快捷键不会自动导入。

### Zed 的免费版能用 Claude Code 或 Codex 吗？

可以。Zed 把外部 Agent 和终端线程作为支持的 AI 工作流；具体接入方式、功能可用性和费用仍取决于对应 Agent 和你的账户。

## 资料来源

- [Zed 官网](https://zed.dev/)
- [Zed 定价页](https://zed.dev/pricing)
- [Zed 安装与系统要求](https://zed.dev/docs/installation)
- [从 VS Code 迁移到 Zed](https://zed.dev/docs/migrate/vs-code)
- [Zed AI 概览](https://zed.dev/docs/ai/overview)
- [Zed GitHub 仓库](https://github.com/zed-industries/zed)

封面图片来自 [Zed 官网](https://zed.dev/)，展示其 Agentic Editing 页面。
