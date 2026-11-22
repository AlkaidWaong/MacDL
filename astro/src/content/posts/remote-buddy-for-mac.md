---
urlSlug: "remote-buddy-for-mac"
title: "Remote Buddy（遥控搭子）：用蓝牙遥控器在 Mac 上语音输入"
seoTitle: "Remote Buddy 遥控搭子：Mac 蓝牙遥控器语音输入工具"
date: "2026-11-22"
description: "Remote Buddy 是一款免费开源的 macOS 工具，可连接兼容的蓝牙语音遥控器，配合微信输入法、Typeless 和 macOS 听写等工具输入文字。了解支持的遥控器、安装要求与未公证提示。"
price: "免费开源"
platform: "macOS 14 或更高版本"
officialUrl: "https://remote.zfdang.com/"
sources:
  - name: "Remote Buddy 开源仓库"
    url: "https://github.com/zfdang/remote-buddy"
    note: "功能、设备兼容性和使用说明"
  - name: "安装与发布说明"
    url: "https://github.com/zfdang/remote-buddy/blob/main/docs/releases.md"
    note: "安装包、公证状态和系统要求"
quickTake: "适合已有语音输入习惯，希望用兼容遥控器远离键盘说话，并用实体按键触发快捷操作的 Mac 用户"
bestFor:
  - "经常使用语音输入撰写消息、文稿或 AI 提示词，希望拿着麦克风离开键盘的 Mac 用户"
  - "愿意配置兼容蓝牙遥控器、虚拟麦克风和系统权限的用户"
faqs:
  - question: "Remote Buddy 免费吗？"
    answer: "Remote Buddy 免费开源，采用 GPL-3.0-only 许可。使用语音功能需要另备兼容遥控器，第三方输入工具的收费情况以其官方说明为准。"
  - question: "Remote Buddy 的安装包经过 Apple 公证了吗？"
    answer: "截至 2026 年 11 月 22 日，安装包未经过 Apple 公证，macOS 可能阻止安装。请查看项目的安装与发布说明。"
  - question: "Remote Buddy 可以用任意蓝牙遥控器吗？"
    answer: "不可以。遥控器需要支持相应的蓝牙按键与音频协议，即使同型号兼容款也可能存在批次差异，购买前请核对项目设备指南。"
  - question: "Remote Buddy 自带语音识别吗？"
    answer: "不自带。它将遥控器音频送入虚拟麦克风，语音识别由用户选择的输入法或听写工具完成。"
categories:
  - "效率工具"
tags:
  - "语音输入"
  - "蓝牙遥控器"
  - "开源软件"
  - "AI工具"
draft: false
---

# Remote Buddy（遥控搭子）：把蓝牙遥控器变成 Mac 语音输入工具

Remote Buddy（遥控搭子）是一款免费开源的 macOS 工具，可以将兼容的蓝牙语音遥控器连接到 Mac，配合输入法或听写工具输入文字，并把遥控器按键映射为快捷键、常用语或应用操作。

它适合经常用语音写消息、文稿或 AI 提示词，希望拿着遥控器离开键盘说话，同时愿意配置硬件和系统权限的人。如果你只需要偶尔在电脑前听写，或者不想额外购买和配置遥控器，macOS 自带听写可能更省事。

> **安装前请注意：截至 2026 年 11 月 22 日，Remote Buddy 安装包未经过 Apple 公证，也未使用 Developer ID Installer 签名**。macOS 可能阻止安装；请从项目官方渠道下载，并阅读[安装与发布说明](https://github.com/zfdang/remote-buddy/blob/main/docs/releases.md)，决定是否继续。

## Remote Buddy 如何工作？

遥控器收集的声音通过蓝牙传给 Remote Buddy，再由它解码并送入安装包附带的 **Remote Buddy Mic 虚拟麦克风**。遥控器的语音键则用来触发输入工具的语音快捷键。

Remote Buddy 本身不运行语音识别模型；识别文字、润色和联网处理由你选择的输入法或听写工具负责，效果及数据处理方式取决于该工具的设置。项目说明称，Remote Buddy 不采集使用统计、不保存录音或文本历史，也不上传日志。

## 支持哪些蓝牙语音遥控器？

截至本文核对时，项目列出了以下三类已适配设备。功能和操作方式因型号及批次而异，购买前建议查看[官方设备选购与连接指南](https://remote.zfdang.com/device.html)。

| 遥控器 | 使用方式与注意事项 |
| --- | --- |
| Google Chromecast Voice Remote（G9N9N） | 已验证版本支持智能切换和按住说话；普通按键支持情况因硬件批次而异，需核对设备指南 |
| 小米蓝牙遥控器 2 Pro（RC003） | 支持按住说话和前面板按键映射；项目说明单次按住约有 60 秒上限 |
| T1 飞鼠键盘语音遥控器 | 已测样机按一下开始、再按一下结束；支持部分正面按键自定义，方向键、背面键盘和飞鼠功能直通，其他兼容批次需另行验证 |

### 三款遥控器实拍

![Google Chromecast G9N9N 蓝牙语音遥控器握持实拍](/media/remote-buddy-for-mac/g9n9j-in-hand.jpg)

Google Chromecast Voice Remote（G9N9N）

![小米蓝牙遥控器 2 Pro 握持实拍](/media/remote-buddy-for-mac/mi-in-hand.jpg)

小米蓝牙遥控器 2 Pro（RC003）

![T1 飞鼠键盘语音遥控器握持实拍](/media/remote-buddy-for-mac/t1-in-hand.jpg)

T1 飞鼠键盘语音遥控器。以上图片来自 [Remote Buddy 官方设备指南](https://remote.zfdang.com/device.html)。

开发者提到，拼多多上约 15 元可以找到 G9N9N，可以作为低成本尝试的选择；**价格会变化，且商品写着 G9N9N 或“兼容”不代表一定适配**，下单前请核对具体硬件版本和卖家信息。

蓝牙能配对不等于语音一定可用。设备还需要支持对应的蓝牙按键与音频协议；Apple Siri Remote 和 Google TV Streamer Voice Remote 当前尚未完成支持。

## 安装与设置

Remote Buddy 支持 **macOS 14 及以上版本**，兼容 Apple Silicon 与 Intel Mac。软件本身免费，采用 GPL-3.0-only 开源许可；遥控器需要另购，第三方语音工具是否收费请以各自官方说明为准。

1. 从 [GitHub Releases](https://github.com/zfdang/remote-buddy/releases) 下载适合 Mac 架构的安装包：Apple Silicon 选择 `arm64`，Intel 选择 `intel`。安装包包含应用和虚拟麦克风驱动。
2. 安装需要管理员授权。由于安装包未经过 Apple 公证，系统可能阻止安装；如系统提供手动放行选项，可在确认来源后到「系统设置 → 隐私与安全性」查看，并参考[项目安装说明](https://github.com/zfdang/remote-buddy/blob/main/docs/releases.md)。
3. 打开应用，按向导配置蓝牙、输入监控和辅助功能等权限，连接并测试兼容遥控器。
4. 在语音输入工具中选择 Remote Buddy Mic，并按向导设置语音快捷键，最后在输入框中测试。

首次安装或驱动发生变化时，音频服务可能短暂中断。卸载方式和独立卸载包见[项目说明](https://github.com/zfdang/remote-buddy#下载与卸载)。

## 遥控器怎么连接和使用？

1. 在 Remote Buddy 向导中完成蓝牙等权限设置，连接遥控器后测试语音键与普通按键。
2. **G9N9N**：连接后可在「遥控器连接」查看 HID 版本。官方设备指南列出 `0x0110`、A0 / 固件 26.7 和 `0x011B` 等批次，按键支持不同；首次设置时按 OK 确认，再依次测试三个不同的普通按键。
3. **小米 2 Pro**：使用蓝牙直连，按住语音键说话、松开停止；单次收音约有 60 秒上限。
4. **T1 飞鼠遥控器**：长按 `Home + Back` 进入蓝牙配对，使用蓝牙直连 Mac；2.4G USB 接收器不支持语音。已测样机按一次开始、再按一次结束。
5. 在输入工具中选择 Remote Buddy Mic，设置语音快捷键并试说，确认文字能进入当前输入框。

G9N9N 的官方设备页面说明，支持智能切换的已验证版本可短按免提、再次按键停止，或长按说话、松开停止，也可切换为纯按住说话。不同版本和设备批次的表现可能不同，请以向导测试结果为准。具体批次和选购建议见[官方设备指南](https://remote.zfdang.com/device.html)。

![Remote Buddy 通用设置界面，显示权限、遥控器连接与输入法集成状态](/media/remote-buddy-for-mac/general-zh.jpg)

Remote Buddy 设置界面，图片来自[官网界面介绍](https://remote.zfdang.com/#interface)。该页面还展示遥控器连接、按键和输入工具设置。

## 能配合哪些语音输入工具？

项目提供微信输入法、豆包输入法、腾讯 Chatterfly、Voice Buddy、网易叭哥说、Typeless 和 macOS 听写等配置入口，也支持为其他工具设置自定义快捷键。

目标工具需要能够接收虚拟麦克风音频，并支持可触发的语音快捷键。不同版本和设置可能不同，配置入口不代表所有版本都已验证兼容，建议通过设置向导测试。输入工具的触发模式也不会改变遥控器本身的收音方式：需要一直按住的型号，松手后不会继续收音。

## 遥控器按键还能做什么？

兼容设备的普通按键可以分别设置单击、双击和长按动作，例如发送快捷键、输入常用语或执行应用操作。可选的应用集成支持在微信、Antigravity、ChatGPT、Claude、DeepSeek 和 WorkBuddy 等应用中定位输入框；实际行为取决于应用、配置和辅助功能权限。

例如，你可以用语音键输入一段提示词，再为其他按键配置回车或撤销快捷键。可用按键数量和操作方式请以具体设备的说明为准。

## 常见问题

### Remote Buddy 自带语音识别吗？

不自带。它负责连接遥控器、传递音频和触发快捷键；语音识别由你选择的输入法或听写工具完成。

### 普通蓝牙遥控器都能用吗？

不能。请先核对型号、硬件批次及项目的设备支持状态；能够配对不代表麦克风和按键协议都兼容。

### Remote Buddy 免费吗？

软件免费开源，无需付费授权。遥控器需另购，搭配的第三方语音输入工具可能有自己的收费规则。

**官网：**[remote.zfdang.com](https://remote.zfdang.com/)

**设备选购与连接指南：**[remote.zfdang.com/device.html](https://remote.zfdang.com/device.html)

**软件界面与设置：**[查看官方界面介绍](https://remote.zfdang.com/#interface)

**开源仓库与下载：**[GitHub · zfdang/remote-buddy](https://github.com/zfdang/remote-buddy)
