---
urlSlug: "fog-mail"
title: "Fog Mail：把邮件分成来信、待读和通知"
seoTitle: "Fog Mail 评测：Mac 邮件客户端，与 Filo Mail 对比"
date: "2026-11-16"
updatedAt: "2026-11-16"
description: "Fog Mail 是一款面向个人阅读场景的 Mac 和 iOS 邮件客户端，把邮件分成来信、待读、通知三类，支持翻译、稍后提醒和快捷键。本文整理功能、价格，并与 Filo Mail 对比。"
quickTake: "Fog Mail 不给邮件加 AI，而是重新安排收件箱：重要的浮现，其余隐去。适合用它读 newsletter、收验证码、处理个人邮件；需要 AI 提炼待办的人，Filo Mail 更合适。"
price: "9.99 美元一次买断（含 Mac 与 iOS，最多 3 台 Mac）"
platform: "macOS 15+、iOS 26+"
officialUrl: "https://fog.fehey.com/zh"
sources:
  - name: "Fog Mail 官网"
    url: "https://fog.fehey.com/zh"
    note: "产品定位、功能与价格"
  - name: "Fog Mail 更新日志"
    url: "https://fog.fehey.com/zh/changelog"
    note: "版本历史与功能演进"
  - name: "FiloMail 官网"
    url: "https://www.filomail.com/"
    note: "对比用的功能与定位"
  - name: "FiloMail 定价页"
    url: "https://www.filomail.com/pricing"
    note: "免费版与 Plus 订阅价格"
quotes:
  - text: "要紧的浮现，其余的隐去。"
    source: "Fog Mail 官网"
    url: "https://fog.fehey.com/zh"
  - text: "大多数邮件客户端围绕办公设计，界面上充满了大量的冗余按钮、无用信息。"
    source: "Fog Mail 官网"
    url: "https://fog.fehey.com/zh"
bestFor:
  - "主要用邮箱读 newsletter、收验证码的人"
  - "想要一个安静、不顺手的邮件客户端的人"
  - "不想为邮件订阅付费、倾向一次买断的人"
  - "使用 Gmail、QQ 邮箱或 Outlook 的个人用户"
faqs:
  - question: "Fog Mail 是什么？"
    answer: "Fog Mail 是一款 Mac 和 iOS 邮件客户端，把邮件分成来信、待读、通知三类，提供翻译、稍后提醒、完成和星标等操作。"
  - question: "Fog Mail 多少钱？"
    answer: "一次买断 9.99 美元（第二批价格），包含 Mac 与 iOS 客户端，最多 3 台 Mac，含以后的所有更新。正式价为 12.99 美元，提供 30 天免费试用。"
  - question: "Fog Mail 有 AI 功能吗？"
    answer: "截至 0.8.3，官网功能列表里没有 AI 摘要或待办提取，只提供一键翻译。需要 AI 处理邮件的人应该看 Filo Mail。"
  - question: "支持哪些邮箱？"
    answer: "目前支持 Gmail（应用专用密码）、QQ 邮箱（授权码）和 Outlook / Microsoft 365。官网表示后续会支持 iCloud Mail、其他 IMAP 与 SMTP 邮箱。"
  - question: "邮件数据存在哪里？"
    answer: "官网说明直连邮件服务，中间没有额外的数据存储。缓存保存在本地，可在设置里查看占用并清理。"
  - question: "有 Windows 版吗？"
    answer: "没有。Fog Mail 目前只有 macOS 15+ 和 iOS 26+ 版本，iOS 版通过 TestFlight 向已购用户开放。"
  - question: "Fog Mail 和 Filo Mail 有什么区别？"
    answer: "Fog Mail 以阅读为中心，靠分类和快捷键减少噪音；Filo Mail 以行动为中心，用 AI 摘要、待办提取和自动过滤处理办公邮件。"
  - question: "现在适合买吗？"
    answer: "版本还在 0.8.x，功能在快速补齐。如果你能接受早期软件的波动，当前价格比正式价低；如果依赖稳定和完整功能，建议先试用。"
categories:
  - "效率工具"
tags:
  - "Fog Mail"
  - "邮件客户端"
  - "Gmail"
  - "独立开发"
  - "Mac 工具"
aliases: []
draft: false
heroImage: "/media/fog/hero.jpg"
---

Fog Mail 是一款 Mac 和 iOS 邮件客户端，由独立开发者 Zayn Hao 开发，当前版本 0.8.3。

它的出发点和多数邮件客户端不同：不是为办公设计，而是为「读」设计。官网的说法是，要紧的浮现，其余的隐去。

![Fog Mail 首页按来信、待读、通知三类展示邮件](/media/fog/hero.jpg)

## Fog Mail 是什么？

Fog Mail 把收件箱拆成三个固定分类：

- **来信**：需要你回应的邮件，比如朋友、用户、合作方
- **待读**：newsletter、更新日志这类可以晚点看的内容
- **通知**：验证码、账单、系统提醒

开发者在官网写明，自己主要用邮件读 newsletter、接收产品更新和验证码、和用户沟通，所以整个应用围绕这些场景设计，而不是围绕「处理工作」。

左侧栏是首页、稍后、星标、所有邮件、已发送、草稿、垃圾邮件和废纸篓。结构比传统客户端简单。

## 分类是怎么判断的？

Fog Mail 会给每封邮件归类，判断依据包括发件人和邮件类型。你可以手动调整某个发件人的分类，调整结果会通过 iCloud 同步到其他设备。

通知类邮件按真实会话展示，不会把同一发件人的不同通知合并成一条。这个细节在收验证码时比较实用。

## 阅读和操作

打开一封邮件，底部是四个动作：

- **完成**（`E`）
- **稍后**（`L`）
- **星标**（`S`）
- **回复**（`R`）

快捷键字母直接对应动作名，不需要记组合键。收发状态、稍后安排和部分偏好会通过 iCloud 在 Mac 和 iPhone 之间同步。

![在 Mac 上读一封邮件，底部是完成、稍后、星标和回复](/media/fog/reading.jpg)

其他细节：

- **一键翻译**：把外文邮件译成中文，适合读英文 newsletter
- **退订优先**：可退订的邮件优先显示退订按钮，回复收进更多菜单
- **跟踪器拦截**：用图标和数量提示被拦下的追踪器
- **滑动操作自定义**：左右滑动可以设为完成、稍后、删除、星标或无操作
- **发送撤销**：发送后顶部显示进度，短时间内可以撤销

## 账号与数据

目前支持的邮箱：

- Gmail（应用专用密码登录）
- QQ 邮箱（授权码登录）
- Outlook / Microsoft 365（0.8.3 新增）

官网表示后续会支持 iCloud Mail 和其他 IMAP、SMTP 邮箱。

数据路径是它强调的一点：直连邮件服务，中间没有额外的数据存储。本地缓存可以按需下载、定期回收，设置里能看到占用并手动清理。

网络设置支持系统代理、直连、HTTP 和 SOCKS5，对需要走代理收信的环境比较友好。

## 和 Filo Mail 的对比

Filo Mail 是另一款常被拿来比较的邮件客户端，思路完全不同。两个产品解决的问题不同，所以对比要看场景。

| 维度 | Fog Mail | Filo Mail |
| --- | --- | --- |
| 定位 | 个人阅读型邮箱 | 办公邮件与行动管理 |
| 核心机制 | 三类分组 + 快捷键 | AI 摘要、待办提取、智能标签 |
| AI 能力 | 无摘要与待办，仅一键翻译 | 摘要、AI 写作、AI 聊天、自动化 |
| 账号支持 | Gmail、QQ、Outlook | Gmail、Outlook、IMAP、iCloud、Yahoo、QQ |
| 平台 | macOS 15+、iOS 26+ | macOS、Windows、iOS、Android |
| 数据处理 | 直连邮件服务，无中间存储 | 云端 AI 处理 |
| 价格 | 9.99 美元一次买断 | 免费基础版；Plus 9.9 美元/月 |

具体说三处差异。

**第一，有没有 AI。**

Filo Mail 的核心卖点是「把邮件变成下一步行动」：自动提取待办、生成摘要、写回复、按规则过滤。Fog Mail 到 0.8.3 还没有这些，它靠分类和视觉设计减少干扰。

如果你每天要处理几十封工作邮件、经常把邮件内容抄进任务工具，Filo Mail 更对症。如果你只是想把 newsletter 和通知从重要邮件里分出去，Fog Mail 的分组已经够用。

**第二，数据路径。**

Fog Mail 强调直连、无中间存储；Filo Mail 的 AI 功能需要把邮件内容交给模型处理。在意这一点的人需要自己权衡：AI 能力和数据路径往往不能同时最大化。

**第三，付费方式。**

Fog Mail 是一次买断，9.99 美元（第二批价格，正式价 12.99 美元），含 Mac 和 iOS，最多 3 台 Mac，以后所有更新都包含。

Filo Mail 免费版只提供基础邮件功能，AI 相关能力要 Plus 订阅，9.9 美元/月，含每月 12 美元 AI 额度，也可以按量付费。

按一年算：Fog Mail 约 10 美元，Filo Plus 约 119 美元。差价换的是 AI 能力和跨平台覆盖。

已有 Filo Mail 的详细评测，可以看[这篇](/article/filo-mail-ai-email-to-action-system/)。

## 现在的完成度

Fog Mail 版本号还在 0.8.x，更新很密集：11 月 4 日到 16 日之间发布了 0.5 到 0.8.3 多个版本，补上了 QQ 邮箱、Outlook、滑动自定义、iCloud 同步、网络代理和发送撤销。

这说明两件事：功能在快速补齐，同时也意味着还在早期。已经实现的体验比较完整，但没有覆盖到的部分（比如规则引擎、日历、Windows 版）需要等。

## 价格和授权

- 30 天全功能免费试用
- 第二批价格 9.99 美元，剩 78 份（官网显示）
- 正式价 12.99 美元
- 一次购买包含 Mac 和 iOS 客户端
- 最多 3 台 Mac 激活
- 包含以后所有更新

iOS 版目前通过 TestFlight 开放，购买后在 Mac 版「设置 › 许可证」里获取邀请。

## 有哪些限制？

- 版本还在 0.8.x，功能未完全稳定
- 没有 AI 摘要和待办提取
- 邮箱支持范围有限，iCloud Mail 和通用 IMAP 还未上线
- 只有 macOS 和 iOS，没有 Windows 和 Android
- iOS 版通过 TestFlight 分发，不是正式上架
- 没有日历、没有团队协作
- 分类依赖发件人判断，遇到新发件人需要手动调整

## 适合谁？

更适合：

- 主要用邮箱读 newsletter、收验证码、处理个人邮件的人
- 想要一个安静、不堆功能的客户端的人
- 不想为邮件付订阅费的人
- 使用 Gmail、QQ 邮箱、Outlook 的个人用户
- 喜欢原生体验和小体积应用的人

不太适合：

- 每天处理大量工作邮件、需要 AI 提炼待办的人（这类需求看 [Filo Mail](/article/filo-mail-ai-email-to-action-system/)）
- 使用 iCloud Mail 或其他 IMAP 邮箱的人
- 需要 Windows 或 Android 版的人
- 不能接受早期版本波动的人

## 最后判断

Fog Mail 做的是减法：三个分类、四个动作、一套快捷键，把收件箱从「一堆未读」变成「三类内容」。

它没有试图用 AI 解决所有问题，也没有把办公场景硬塞进来。这种克制在邮件客户端里不多见，代价是功能覆盖窄。

9.99 美元买断、30 天试用、含 iOS 和后续更新，试错成本不高。如果你已经有一个工作邮箱客户端，可以把它当作个人邮箱的第二个客户端；如果你在找能替代 Gmail 网页版的工具，先确认它支持你的邮箱服务商。

封面与界面图片来自 Fog Mail 官网。
