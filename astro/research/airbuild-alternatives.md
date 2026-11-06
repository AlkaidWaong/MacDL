# AirBuild 同类产品：Mac 客户端、iOS 构建与发布

- 核验日期：2026-11-06；仅依据厂商及 Apple 官方页面，未实际安装或提交应用。
- 口径：**Mac 客户端**指构建工具本身有 macOS 安装版；**原生 iOS**与客户端是否原生是两件事。官网下载版也不等于 Swift/AppKit 实现；无实现证据时不推断。网页工具可作为对照，但不充当 Mac 客户端。

## 结论

**Superapp 最接近 AirBuild**：官方明确提供原生 Mac 构建客户端、Swift iOS 生成和自动提交。FlutterFlow Studio 有 Mac 桌面应用及 AI Agent，但构建 Flutter 应用而非原生 Swift，且官方发布流程仍要求用户在 App Store Connect 完成送审；桌面客户端的具体实现技术未核实。Rork Max 和 Choicely 是网页对照，不应当作已证实的 Mac 客户端。

| 产品 | 构建工具的入口 | AI 与 iOS 产物 | App Store 发布及限制 | 官方来源 |
| --- | --- | --- | --- | --- |
| **AirBuild（基准）** | macOS 和 iOS 安装版；官网要求 macOS 26+ / iOS 26+，支持本地或云端工作。页面未明确提供完整网页版构建器。 | 多 agent 构建原生 iOS 应用。 | 宣称自动提交、回复审核意见、修复并重新提交；这些审核自动化功能列在 Pro 及以上，早期访问需候补。 | [官网及定价](https://air.build/) |
| **Superapp** | **原生 Mac 客户端 + 网页版**；Mac 端需一次性配置 Xcode，代码保存在本地；网页云端预览、代码可导出。 | 自然语言生成原生 Swift iOS 应用；Mac 版额外支持构建 Mac 应用。 | 官网称连接自己的 Apple Developer 账号后自动准备签名构建、截图、隐私声明、元数据并提交；自动发布列在 Pro（$25/月）中。Apple 审核仍独立进行；官网未在所查资料中明确承诺像 AirBuild 一样自动回复、修复并重新提交。 | [首页与定价](https://superapp.dev/)；[Web 与 Mac 比较](https://superapp.dev/web-vs-mac)；[发布流程](https://superapp.dev/app-store-publishing) |
| **FlutterFlow Studio** | **Mac 桌面安装版 + 网页版**；官网有 DMG，但未查证桌面客户端是否使用 Apple 原生 UI 技术。 | Flutter 可视化构建；桌面版 AI Agent 可调用 Claude 或 Codex 编辑项目，需对应服务商账户和本地工具；该 Agent 不适用于浏览器版 Studio。生成的是 Flutter 项目，不等同 Swift 原生代码。 | 可从平台部署构建到 App Store Connect；须自行设置 Apple 开发者会员、App ID 和 API key，并在 App Store Connect 填资料、加入审核。不能称为全自动审核闭环。 | [桌面下载](https://flutterflow.io/desktop)；[AI Agent 文档](https://docs.flutterflow.io/concepts/ai-agent/)；[Apple 发布文档](https://docs.flutterflow.io/deployment/apple-app-store-deployment/) |
| **Rork Max** | **网页构建**，云 Mac 上运行 Xcode 和模拟器；另有 iOS App。所查官方资料未证实独立 Mac 构建客户端。 | AI 生成 SwiftUI，云端构建原生 iOS 应用。 | 官网称可直接提交及管理 TestFlight；文档仍要求 Apple Developer 账号、登录验证，以及在 App Store Connect 完成产品页面和最终送审；不应把上传构建等同审核通过。 | [Max 产品页](https://rork.com/max)；[发布文档](https://docs.rork.com/store-guides/publish-app-store) |
| **Choicely** | **网页 Studio**；所查官方资料未证实独立 Mac 构建客户端。 | AI 加可视化编辑；官网称 iOS 使用 Swift、Android 使用 Java，也提及 React Native 和自定义技术，具体项目组成应另行核实。 | Publish Assistant 准备商店资料、预检查并指导使用自己的开发者账户提交；不是已证实的自动应对拒审闭环。偏内容、媒体及受众互动场景。 | [AI App Builder](https://www.choicely.com/ai-app-builder) |

## 共同边界

- Apple Developer Program 标准会费为 **$99/会员年**，符合条件的组织可能获豁免；与各工具订阅费分开。[Apple 会员费用](https://developer.apple.com/help/account/membership/program-enrollment/)；[豁免政策](https://developer.apple.com/help/account/membership/fee-waivers/)。
- 上述自动化为厂商宣称，并非独立实测；提交、上传和获 Apple 审核通过是不同阶段，均不保证上架。涉及账号权限、隐私声明和生成代码时仍需用户核验。
- “未证实”不等于“不存在”；尤其不能因为网页版本支持在 Mac 浏览器运行，就称其为原生 Mac 客户端。
