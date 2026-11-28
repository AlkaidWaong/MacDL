---
urlSlug: "opencode-go"
title: "OpenCode Go 是什么？Go、Go Plus 与 Go Teams 套餐说明"
date: "2026-11-19"
updatedAt: "2026-11-28"
description: "OpenCode 是开源 AI 编程 Agent。OpenCode Go 是可选的模型订阅服务，提供 Go、Go Plus 和 Go Teams 三种月付套餐。本文说明各套餐价格、使用额度、超额用量和隐私设置。"
quickTake: "OpenCode 本体可以免费使用，也可以连接自己的模型提供商。OpenCode Go 是单独的订阅服务：Go 为 10 美元/月，Go Plus 为 40 美元/月，Go Teams 为 20 美元/人/月且至少两人。三种套餐的模型单价相同，区别主要是额度和团队覆盖范围。"
introLinks:
  - label: "套餐价格与选择"
    href: "#opencode-go-套餐"
  - label: "额度何时重置"
    href: "#套餐额度如何计算"
  - label: "用完额度怎么办"
    href: "#达到额度后怎么办"
bestFor:
  - "希望在 OpenCode 中使用 OpenCode Console 模型，但不想分别管理多个模型提供商账户的人"
  - "需要固定月付套餐，并愿意按当前模型额度管理使用量的人"
  - "需要为团队成员配置模型额度、预算和工作区设置的团队"
price: "Go 10 美元/月；Go Plus 40 美元/月；Go Teams 20 美元/人/月，至少两人"
platform: "OpenCode 终端、桌面和其他兼容的 AI 编程 Agent"
officialUrl: "https://opencode.ai/"
sources:
  - name: "OpenCode 官网"
    url: "https://opencode.ai/"
    note: "OpenCode 产品定位、免费模型、安装方式和 Go 入口"
  - name: "OpenCode Go 文档"
    url: "https://opencode.ai/docs/console/go/"
    note: "套餐、额度窗口、超额用量、端点和隐私说明"
  - name: "OpenCode Console Go 套餐页"
    url: "https://opencode.ai/console/go"
    note: "当前可用模型、每个模型的额度与价格"
  - name: "OpenCode 模型文档"
    url: "https://opencode.ai/docs/console/models/"
    note: "按量计费模型与 Console API Key 的连接方式"
  - name: "OpenCode 提供商文档"
    url: "https://opencode.ai/docs/providers/"
    note: "第三方订阅、API Key 和 OpenCode Go 的连接方式"
faqs:
  - question: "OpenCode Go 是 OpenCode 的必需订阅吗？"
    answer: "不是。OpenCode Go 是可选的模型订阅。OpenCode 可以使用免费模型，也可以连接自己的 API Key、现有订阅或其他提供商"
  - question: "OpenCode Go 有哪些套餐？"
    answer: "当前有 Go、Go Plus 和 Go Teams。Go 为每月 10 美元，Go Plus 为每月 40 美元，Go Teams 为每人每月 20 美元且至少两人"
  - question: "Go 和 Go Plus 的区别是什么？"
    answer: "两者使用同一组 Go 模型，模型 token 单价相同。Go Plus 提供更高的模型使用额度。实际额度以 OpenCode Console Go 页面显示的每个模型限制为准"
  - question: "Go Teams 包含什么？"
    answer: "Go Teams 为工作区的每位成员提供独立额度，价格为每人每月 20 美元，最少两人。服务账号不在 Go Teams 覆盖范围内"
  - question: "OpenCode Go 超额后会怎样？"
    answer: "达到套餐额度后，可以改用免费模型，或启用 Extra Usage，从 Console 余额按量支付额外使用量"
categories:
  - "开发工具"
  - "AI"
tags:
  - "OpenCode"
  - "OpenCode Go"
  - "AI 编程"
  - "Claude Code"
  - "Codex"
  - "AI Agent"
aliases: []
draft: false
heroImage: "/media/opencode/hero.png"
---

OpenCode 是开源 AI 编程 Agent。它可以在终端、桌面应用、手机和 SDK 中使用，也可以连接不同模型提供商

OpenCode Go 是 OpenCode Console 提供的可选模型订阅服务。它不是 Go 编程语言相关产品，也不是使用 OpenCode 的前提。用户可以继续使用免费模型、自有 API Key、ChatGPT Plus 或 Pro、GitHub Copilot，或其他 OpenCode 支持的提供商

## OpenCode Go 套餐

| 套餐 | 月付价格 | 适合谁 |
| --- | --- | --- |
| Go | 10 美元/月 | 个人日常使用，想先用较低的固定月费试 Go 模型 |
| Go Plus | 40 美元/月 | 个人经常用完 Go 额度，需要同一组模型的更高额度 |
| Go Teams | 20 美元/人/月，至少两人，每月 40 美元起 | 团队希望按成员分配独立额度，并统一管理工作区 |

Go 和 Go Plus 覆盖订阅成员及工作区 API Key。其他受邀成员仍可使用免费模型或工作区余额。Go Teams 为每位成员提供独立额度，服务账号不在覆盖范围内。

还没有稳定用量，可以先用免费模型或连接已有订阅。Go 和 Go Plus 可以升级到 Go Teams。按官方文档说明，升级时会按当月未使用额度折抵。

## 套餐额度如何计算

| 额度窗口 | 上限 | 何时重置 |
| --- | --- | --- |
| 5 小时 | 月度额度的 20% | 从首次使用额度开始计时，5 小时后重置 |
| 每周 | 月度额度的 50% | 每周一 00:00 UTC，即北京时间周一 08:00 |
| 每月 | 月度额度的 100% | 下一个付费周期开始时重置 |

付费模型共用同一份额度。Go Teams 的每位成员各有一份，成员切换模型时仍从自己的同一份额度扣除。不同模型的用量按比例计入：月度限制为 15 美元的模型用掉 1.50 美元，或月度限制为 60 美元的模型用掉 6 美元，都占套餐月度额度的 10%。

登录 [OpenCode Console Go](https://opencode.ai/console/go) 查看当前用量。页面上的请求次数是按典型使用情况估算的，实际能发多少次取决于提示长度、上下文和工具调用。[官方额度规则](https://opencode.ai/docs/console/go/)

## 达到额度后怎么办

任一窗口达到上限后，切换到另一个 Go 付费模型也会受同一份额度限制。可以等触发的额度窗口重置，也可以切换到当前可用的免费模型。

需要继续用 Go 付费模型时，可以在 Console 的 Go 页面开启 **Extra Usage**。开启且 Console 有余额时，达到额度上限后的请求会从余额按量扣费。Go Teams 默认开启 Extra Usage，可在 Go 页面关闭。

订阅费用也可以由工作区余额支付。余额不足时，需要先充值才能完成订阅或续费。使用余额支付订阅与 Extra Usage 是两项独立设置

## OpenCode Go 提供什么

OpenCode Go 提供 OpenCode 团队筛选和测试过的编程模型。当前模型列表、每个模型的额度和 token 价格以 [OpenCode Console Go 页面](https://opencode.ai/console/go) 为准，模型列表可能变化

Go、Go Plus 和 Go Teams 的 token 单价相同。套餐差异不在于模型单价，而在于每个模型可使用的月度额度和团队成员覆盖范围

OpenCode Go 可在 OpenCode 中作为一个提供商连接。订阅后，在 OpenCode 中执行：

```text
/connect
```

选择 **OpenCode Go**，粘贴从 OpenCode Console 获取的 API Key。然后执行：

```text
/models
```

选择可用模型

也可以在 OpenCode 配置中指定模型：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "model": "opencode-go/kimi-k3"
}
```

模型 ID 会更新。配置前应以当前模型列表为准

## Go、按量计费和自有提供商的区别

| 方式 | 费用方式 | 适合的情况 |
| --- | --- | --- |
| 免费模型 | 不收费，但可用模型和条件会变化 | 试用 OpenCode 或处理低频任务 |
| OpenCode Go | 固定月付额度，超额可使用余额 | 希望使用 Go 模型并控制固定月度成本 |
| OpenCode Console 按量计费 | 按请求和 token 计费 | 需要根据实际用量付费，或需要 Go 以外的 Console 模型 |
| 自有提供商或订阅 | 由原提供商收费 | 已有 OpenAI、Anthropic、GitHub Copilot 或其他账户 |

OpenCode 本身不要求使用 Go。选择前应先确认已有订阅是否可直接连接，再比较 Go 的模型、额度和使用频率

## 隐私、地区和模型限制

OpenCode Go 的工作区隐私设置会影响可用模型。默认情况下，使用请求数据训练的付费端点处于关闭状态；允许的地区为欧洲和美国

部分模型需要在工作区设置中允许 Global 地区，或允许使用请求数据训练的付费端点。每个模型的数据保留期限也不同。OpenCode Go 文档列出部分模型为 0 天保留，也列出部分模型为 30 天或 55 天保留

处理代码、密钥或客户数据前，应在 OpenCode Console 的隐私设置和模型页面确认当前模型的地区、训练和保留条件

## 安装 OpenCode

在 macOS、Linux 或 Windows 上可以安装 OpenCode CLI。macOS 上可使用 Homebrew：

```bash
brew install anomalyco/tap/opencode-v2
```

也可以使用 npm：

```bash
npm install -g @opencode/cli
```

OpenCode 还提供 macOS、Windows 和 Linux 桌面应用。桌面应用可以使用：

```bash
brew install --cask opencode-desktop
```

如果你需要在多个 AI 编程工具之间切换模型和配置，可以参考 [CC Switch](/article/cc-switch-for-mac)。如果你需要在编辑器中管理 Agent 线程、终端和代码审查，可以参考 [Zed](/article/zed-editor)

## 与 T3 Code、Orca ADE 一起使用

OpenCode 可以作为实际执行任务的 Agent。需要集中管理多个已登录 Agent 的线程、Git 操作和远程访问时，可以使用 [T3 Code](/article/t3-code)

如果多个 Agent 会同时修改同一个仓库，可以使用 [Orca ADE](/article/orca-ade) 为每个任务建立独立 Git worktree，再比较和合并差异

三款工具的执行、调度和隔离分工见 [OpenCode、T3 Code 与 Orca ADE 横评](/article/opencode-t3-code-orca-comparison)

## 常见问题

### OpenCode Go 是否包含无限使用量

不包含。每个套餐都有 5 小时、每周和每月额度。模型切换会共用额度。达到额度后可以使用免费模型，或启用 Extra Usage

### OpenCode Go 可以在 Claude Code 或 Codex 中使用吗

可以。OpenCode Go 文档列出 Claude Code 和 Codex 为已验证客户端。客户端需要保留会话信息，具体支持情况可能随客户端版本和代理配置变化

### OpenCode Go 是否只提供开源模型

不应这样理解。OpenCode Go 文档要求用户以 Console 当前模型列表为准。模型、地区、数据保留期限和额度都可能调整

### Go Teams 是否覆盖所有工作区账号

Go Teams 覆盖每位成员的额度，但服务账号不在覆盖范围内。团队还应分别确认工作区预算、Extra Usage 和隐私设置

## 资料来源

- [OpenCode 官网](https://opencode.ai/)
- [OpenCode Go 文档](https://opencode.ai/docs/console/go/)
- [OpenCode Console Go 套餐页](https://opencode.ai/console/go)
- [OpenCode 模型文档](https://opencode.ai/docs/console/models/)
- [OpenCode 提供商文档](https://opencode.ai/docs/providers/)

封面图片来自 [OpenCode 官网](https://opencode.ai/)
