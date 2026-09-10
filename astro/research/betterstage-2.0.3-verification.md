# BetterStage 2.0.3 官方信息核验

- 核验日期：2026-09-10（Asia/Shanghai）
- 来源范围：仅 BetterStage 官方网站、官方文档与官方更新日志。
- 结论口径：官网当前存在版本与试用期文案不一致，涉及这两项时不应合并成单一“当前事实”。

## 核验结果

| 项目 | 结论 | 官方证据 |
| --- | --- | --- |
| 当前版本 / 2.0.3 | **存在冲突。** 官网首页当前标为 `v2.0.4`，但更新日志仍把 `2.0.3` 标成 `Latest`（September 2026）。因此可确认 2.0.3 的发布记录，但不能再无保留地称其为全站一致的“当前最新版”。 | [官网首页](https://betterstage.app/)；[更新日志](https://betterstage.app/changelog) |
| 2.0.3 更新内容 | 可确认：TabStack 标签高度、活动/非活动文字颜色与空 pane 关闭按钮可见性；指定 Saved Workspace 的快捷键；Clean Load；菜单栏重启；以及 TabStack、Workspace、Settings backup、Snap Wheel 等改进/修复。 | [2.0.3 更新日志所在页](https://betterstage.app/changelog) |
| 系统与芯片 | 需要 macOS 14 Sonoma 或更高版本；支持 Apple Silicon 与 Intel。 | [官网首页](https://betterstage.app/)；[官方下载完成页](https://betterstage.app/download/thanks) |
| Free | `$0 forever`，保留 3 个 stages；包含 Enhanced Native、16 个 snap zones（含 Center 与 Snap Wheel）、快捷键、多显示器及自动 Workspace Continuity 等。 | [定价页](https://betterstage.app/pricing)；[官网首页定价区](https://betterstage.app/) |
| Pro 试用 | 面向 eligible Macs 的 7 天 Pro 试用，无需信用卡；结束后自动保留 Free。 | [定价页](https://betterstage.app/pricing)；[官网首页](https://betterstage.app/)；[官方下载完成页](https://betterstage.app/download/thanks) |
| Lifetime Pro | 一次性买断三档：1 台 Mac `$19.99`、3 台 `$39.99`、5 台 `$49.99`；官网称包含未来更新。 | [官网首页定价区](https://betterstage.app/)；[定价页](https://betterstage.app/pricing) |
| BetterStage AI | 可选 managed AI 订阅，包含全部 Pro 功能，无需 API key；`$4.99/月` 或 `$39/年`（年付折合 `$3.25/月`），每月 200 AI Staging credits；最多 3 台 Mac。另有 20 credits 的无卡免费试用；1 credit = 一次 workspace arrangement。 | [定价页](https://betterstage.app/pricing)；[官网首页定价区](https://betterstage.app/) |
| Enhanced Native | Free；窗口保持原生自由浮动，由用户手动安排，同时 BetterStage 仍追踪窗口所属 stage；是新 stage 的默认模式。 | [Window Modes 官方文档](https://betterstage.app/docs/window-modes) |
| TabStack | Pro；把窗口平铺为可调整大小的 panes，多余窗口堆叠为 tabs，并支持 split、join、swap 与保留空 pane。 | [Window Modes 官方文档](https://betterstage.app/docs/window-modes)；[官网首页](https://betterstage.app/) |
| Snap Wheel | 径向快捷菜单，可执行 snap、发送/切换 stage、切换 Window Mode、运行 AI Staging、打开设置；Enhanced Native 下内环为半屏/四分屏，TabStack 下变为相邻 pane 的方向操作。 | [Snap Wheel 官方文档](https://betterstage.app/docs/snap-wheel)；[官网首页](https://betterstage.app/) |
| AI Staging Recipe 工作流 | 官方用语是：扫描/分析打开窗口，提出可 **review、refine、apply、undo** 的计划；应用后可在面板内用 `Cmd-Z` 一步撤销。Recipe 是可保存的工作区说明，可创建、切换、复制、重命名、删除、设为默认，并可预览发送给模型的精确 prompt。若文章使用 “inspect”，建议改成官方的 “review/preview”。 | [AI Staging 官方文档](https://betterstage.app/docs/ai-staging)；[更新日志（1.1.0）](https://betterstage.app/changelog) |

## 需要特别标注的不一致

1. **版本号：** 首页显示 `v2.0.4`，更新日志却显示 `2.0.3 Latest`。截至核验时，官方页面尚未形成一致口径。
2. **试用期：** 当前首页、定价页与下载完成页一致写 7 天；但 [License Keys 官方文档](https://betterstage.app/docs/license-keys) 仍写 10 天，疑似旧文档未同步。面向读者时宜采用三处当前商业页面一致的 **7 天**，同时避免声称官方所有页面完全一致。

## 可直接采用的准确表述

> BetterStage 支持 macOS 14 Sonoma 及更高版本，并兼容 Apple Silicon 与 Intel Mac。Free 版可长期使用 3 个 stages；符合条件的 Mac 可无卡试用 Pro 7 天。Lifetime Pro 为 1/3/5 台设备三档，分别一次性付费 $19.99/$39.99/$49.99。可选 BetterStage AI 订阅为 $4.99/月或 $39/年，包含 Pro 与每月 200 个 AI Staging credits。

版本表述建议写成：

> BetterStage 2.0.3 的更新日志发布于 2026 年 9 月；核验当日官网首页已显示 v2.0.4，但更新日志仍将 2.0.3 标为 Latest。
