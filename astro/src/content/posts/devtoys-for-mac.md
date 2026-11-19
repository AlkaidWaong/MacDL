---
urlSlug: "devtoys-for-mac"
title: "DevToys for Mac：免费开源的开发者工具箱"
date: "2026-11-19"
updatedAt: "2026-11-19"
description: "DevToys 是一款免费开源的开发者工具箱，提供 JSON/YAML、JWT、Base64、哈希、正则和图片转换等离线工具，支持 macOS Intel 与 Apple Silicon"
quickTake: "DevToys 将 JSON、JWT、Base64、正则和文本比较等常用小工具放在本地应用中。它适合处理短时的转换、格式化和测试任务，不替代 API 客户端、IDE 或密钥管理工具"
bestFor:
  - "经常格式化 JSON、转换 YAML、解码 Base64 或测试正则的开发者"
  - "希望在本地处理临时文本、Token 或图片样例的人"
  - "需要免费、开源、跨平台开发者工具箱的人"
price: "免费开源（MIT License）"
platform: "macOS（Intel 与 Apple Silicon）；同时支持 Windows 和 Debian/Ubuntu Linux"
officialUrl: "https://devtoys.app/"
sources:
  - name: "DevToys 官网"
    url: "https://devtoys.app/"
    note: "产品定位、默认工具、离线处理与 Smart Detection 说明"
  - name: "DevToys 下载页"
    url: "https://devtoys.app/download"
    note: "macOS Intel/Apple Silicon 下载链接与 Homebrew 安装命令"
  - name: "DevToys GitHub 仓库"
    url: "https://github.com/DevToys-app/DevToys"
    note: "开源仓库、默认工具清单与扩展说明"
  - name: "DevToys SDK 文档"
    url: "https://devtoys.app/doc"
    note: "跨平台扩展 SDK 与发布机制"
  - name: "DevToys LICENSE"
    url: "https://github.com/DevToys-app/DevToys/blob/main/LICENSE.md"
    note: "MIT License 原文"
  - name: "DevToys 隐私政策"
    url: "https://github.com/DevToys-app/DevToys/blob/main/PRIVACY-POLICY.md"
    note: "仓库内隐私文件的当前文本与更新时间"
faqs:
  - question: "DevToys 是免费的吗？"
    answer: "是。DevToys 官网将其描述为免费、开源的跨平台开发者工具，GitHub 仓库中的 LICENSE 文件采用 MIT License"
  - question: "DevToys 支持 Mac 吗？"
    answer: "支持。官方下载页提供 Intel x64 与 Apple Silicon ARM64 的 macOS 包，也列出 brew install --cask devtoys 安装方式"
  - question: "DevToys 可以离线使用吗？"
    answer: "官网将 DevToys 定位为包含离线工具的桌面应用，默认工具包括 JSON/YAML、Base64、JWT、哈希、正则和文本比较等。扩展、更新或你主动连接的第三方服务可能有各自的网络行为，处理敏感数据前应自行核对"
  - question: "DevToys 能替代 Postman 或 API 客户端吗？"
    answer: "不能直接这样理解。DevToys 的核心是格式化、转换、编码解码、生成和测试等小型任务；它不等于专门用于发送、保存和协作 API 请求的客户端"
  - question: "DevToys 有命令行版本吗？"
    answer: "有。官网说明 DevToys CLI 与图形应用是独立程序，适合命令行或 CI 等场景；下载页提供 macOS CLI 的 Intel 和 Apple Silicon 包"
categories:
  - "开发工具"
tags:
  - "DevToys"
  - "开发者工具箱"
  - "JSON"
  - "JWT"
  - "Base64"
  - "正则表达式"
  - "开源软件"
aliases: []
draft: false
heroImage: "/media/devtoys/hero.png"
---

DevToys 是一款开发者工具箱。它将格式化、转换、编码解码、生成和测试类工具集中在桌面应用中

官网将 DevToys 描述为免费、开源、跨平台的应用。DevToys 2.0 包含 30 个默认工具，也支持通过扩展增加工具

## DevToys 用于哪些任务

DevToys 适合处理单次、短时的数据任务，例如格式化一段 JSON、转换 YAML、解码 JWT 或比较两段文本

官网和 GitHub 仓库列出的默认工具包括：

- JSON、SQL 和 XML 格式化
- JSON 与 YAML 转换
- Base64、URL、HTML、GZip、JWT 和 QR Code 编码解码
- 哈希、校验和、UUID、密码和 Lorem Ipsum 生成
- 正则、JSONPath、XML/XSD 测试
- 文本比较、Markdown 预览、图片转换和 PNG/JPEG 压缩

DevToys 会根据剪贴板内容建议可用工具。官网将这一功能称为 Smart Detection。用户可以在设置中调整自动粘贴行为

## 哪些任务不应使用 DevToys

DevToys 不是 API 客户端。它不以发送请求、保存接口集合、管理环境变量或团队协作 API 文档为主要用途

DevToys 也不是代码编辑器。代码编辑、调试、重构和运行项目，应在 [Zed](/article/zed-editor) 等编辑器或 IDE 中完成

| 任务 | 是否适合使用 DevToys |
| --- | --- |
| 格式化 JSON，或在 JSON 与 YAML 间转换 | 适合 |
| 解码 Base64、JWT 或 URL | 适合 |
| 测试正则、JSONPath、XML/XSD | 适合 |
| 比较文本或生成 UUID、密码、哈希 | 适合 |
| 发送和保存 API 请求 | 不适合 |
| 编辑、调试和重构代码 | 不适合 |

## DevToys、DevUtils 和 API 客户端的区别

DevToys、DevUtils 等应用都属于开发者工具箱。选择时应比较你常用的工具、支持的平台、价格、扩展和数据处理方式

DevToys 提供免费、开源和跨平台版本。需要 Mac 原生商业工具箱时，可以比较 DevUtils 等应用的工具清单、授权和更新策略

需要发送 API 请求、保存环境变量或管理接口集合时，应使用专门的 API 客户端。需要编辑代码、运行任务或使用 AI Agent 时，应使用编辑器或 IDE

## 在 macOS 上安装 DevToys

DevToys 下载页提供 Intel x64 和 Apple Silicon ARM64 两种 macOS 安装包

也可以使用 Homebrew：

```bash
brew install --cask devtoys
```

DevToys CLI 与图形应用是独立程序。下载页提供 macOS CLI 的 Intel 和 Apple Silicon 包。官网说明 CLI 适合命令行和 CI 等场景

## 数据处理与扩展

官网将 DevToys 描述为包含离线工具、注重隐私的桌面应用。这个说明适用于其产品定位，但不能替代对具体功能的数据路径核对

处理生产密钥、客户数据或真实 Token 前，应分别检查当前版本、所用工具和已安装扩展：

1. 默认离线工具、社区扩展、软件更新和第三方服务可能有不同的网络行为
2. DevToys 支持通过 SDK 开发和发布扩展。安装扩展前，应确认维护者、代码和权限
3. DevToys 不是密钥管理工具，不应用于保存生产凭据

仓库中的隐私政策文件标注最后更新于 2021 年，并保留旧网站地址。团队或合规场景应按自己的安全要求独立审查

## 价格、平台和许可

| 项目 | 当前信息 | 核对日期 | 来源 |
| --- | --- | --- | --- |
| 定位 | 免费、开源、跨平台的开发者工具箱 | 2026-11-19 | [官网](https://devtoys.app/) |
| 默认工具 | 30 个默认工具 | 2026-11-19 | [官网](https://devtoys.app/) |
| macOS 下载 | Intel x64 和 Apple Silicon ARM64 均有独立包 | 2026-11-19 | [下载页](https://devtoys.app/download) |
| Homebrew | `brew install --cask devtoys` | 2026-11-19 | [下载页](https://devtoys.app/download) |
| 许可证 | MIT License | 2026-11-19 | [LICENSE](https://github.com/DevToys-app/DevToys/blob/main/LICENSE.md) |

## 常见问题

### DevToys 适合哪些人

DevToys 适合经常处理 JSON、编码文本、正则和其他技术格式的人。它的功能名称和输入输出面向技术任务

### DevToys 会自动将剪贴板内容发送到网络吗

官网介绍了离线工具和 Smart Detection，但这不能替所有版本、扩展和第三方服务作保证。敏感数据应先查看所用功能的文档和代码，再按组织安全规则处理

### DevToys CLI 和桌面版有什么区别

DevToys CLI 与图形应用是独立程序。CLI 提供适合命令行和 CI 的工具，图形应用提供桌面界面

### DevToys 可以安装扩展吗

可以。DevToys 2.0 提供兼容 Windows、macOS 和 Linux 的 SDK，开发者可以创建、调试和发布扩展

## 资料来源

- [DevToys 官网](https://devtoys.app/)
- [DevToys 下载页](https://devtoys.app/download)
- [DevToys GitHub 仓库](https://github.com/DevToys-app/DevToys)
- [DevToys SDK 文档](https://devtoys.app/doc)
- [DevToys LICENSE](https://github.com/DevToys-app/DevToys/blob/main/LICENSE.md)
- [DevToys 隐私政策](https://github.com/DevToys-app/DevToys/blob/main/PRIVACY-POLICY.md)

封面图片来自 [DevToys 官网](https://devtoys.app/)
