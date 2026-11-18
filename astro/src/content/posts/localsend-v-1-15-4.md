---
urlSlug: "localsend-v-1-15-4"
title: "LocalSend 有网页版吗？"
seoTitle: "LocalSend 有网页版吗？局域网传输与 HTTPS 加密"
date: "2024-09-16"
updatedAt: "2026-11-18"
description: "LocalSend 有官方网页版 web.localsend.org，可以在浏览器里发送文件。本文说明网页版能做什么、局域网传输和 HTTPS 加密的原理，以及和安装版的区别。"
quickTake: "LocalSend 有网页版，地址是 web.localsend.org，但它的主要用途是在浏览器里发送文件；接收端仍然需要运行 LocalSend。局域网传输、HTTPS 加密、不经过第三方服务器这三点，网页版和安装版一致。"
price: "免费开源（Apache 2.0）"
platform: "Windows、macOS、Linux、Android、iOS，另有网页版"
officialUrl: "https://localsend.org/"
sources:
  - name: "LocalSend 官网"
    url: "https://localsend.org/"
    note: "平台支持、安全说明与常见问题"
  - name: "LocalSend 网页版"
    url: "https://web.localsend.org/"
    note: "官方 Web App 入口"
  - name: "LocalSend GitHub"
    url: "https://github.com/localsend/localsend"
    note: "开源协议与技术说明"
  - name: "LocalSend 更新日志"
    url: "https://localsend.org/changelog"
    note: "版本历史，当前 1.18.2"
quotes:
  - text: "Share files without the cloud. Fast, private, offline."
    source: "LocalSend 官网"
    url: "https://localsend.org/"
  - text: "All transfers are encrypted using HTTPS. You can also enable PIN verification for extra security."
    source: "LocalSend 官网常见问题"
    url: "https://localsend.org/"
bestFor:
  - "同一局域网内需要跨平台互传文件的人"
  - "不想把文件上传到云盘或聊天工具的人"
  - "在别人的电脑上临时发文件、不想装软件的人"
  - "需要 Windows、macOS、Android、iOS 之间互传的人"
faqs:
  - question: "LocalSend 有网页版吗？"
    answer: "有。官方网页版地址是 https://web.localsend.org/，可以在浏览器里打开使用。它的主要用途是在未安装 LocalSend 的电脑上发送文件，接收端仍需要运行 LocalSend。"
  - question: "网页版能接收文件吗？"
    answer: "浏览器不能像安装版一样在局域网里被发现。接收文件仍由安装版完成；桌面版提供「通过链接接收」，可以生成一个网页，让对方向你发送文件。"
  - question: "LocalSend 需要联网吗？"
    answer: "不需要互联网，但需要设备处在同一个局域网内，比如同一个 Wi-Fi 或同一个网段。文件不经过第三方服务器。"
  - question: "传输安全吗？"
    answer: "设备之间使用 HTTPS 通信，文件只在局域网内传输。可以开启 PIN 验证，接收方确认后才开始传输。"
  - question: "支持哪些平台？"
    answer: "Windows、macOS、Linux、Android、iOS，另有网页版。项目开源，协议为 Apache 2.0。"
  - question: "和 AirDrop 有什么区别？"
    answer: "AirDrop 只在苹果设备之间可用；LocalSend 支持 Windows、Android 等平台，只要在同一局域网即可互传。两者都不需要把文件上传到云端。"
  - question: "传输速度有多少？"
    answer: "取决于局域网带宽和 Wi-Fi 质量，没有服务器端的带宽限制。千兆有线或较新的 Wi-Fi 环境下，速度通常明显快于网盘上传再下载。"
  - question: "为什么设备列表里找不到对方？"
    answer: "常见原因是两台设备不在同一网段、路由器开启了客户端隔离（AP isolation），或者防火墙拦截了 LocalSend 使用的端口。"
categories:
  - "效率工具"
tags:
  - "LocalSend"
  - "局域网传输"
  - "文件分享"
  - "跨平台传输"
  - "开源软件"
aliases: []
draft: false
heroImage: "/media/localsend-v-1-15-4/hero.png"
---

LocalSend 有网页版，地址是 [web.localsend.org](https://web.localsend.org/)，由官方提供，不需要注册。

不过网页版的作用和安装版不同：它主要解决「发送」，接收文件仍然要靠安装了 LocalSend 的设备。

## 网页版能做什么？

网页版适合这样的场景：你在别人的电脑或临时设备上，想把文件发给同一局域网里的手机、平板或另一台电脑，但不想为了这一次安装软件。

打开网页版，选择文件，找到局域网内的设备并发送即可。

它的限制也很明确：

- 浏览器无法像安装版一样在局域网里被其他设备发现，所以不能作为接收端
- 无法使用安装版的全部设置，比如自定义保存目录、设备别名等
- 网络环境受限时（例如公司网络隔离了客户端），网页版同样找不到设备

如果你需要接收文件，桌面版提供了「通过链接接收」：在本机生成一个网页链接，对方用浏览器打开就能向你发送，不需要安装 LocalSend。

## LocalSend 是什么？

LocalSend 是一款开源的文件传输工具，让同一局域网内的设备直接互传文件，不经过云服务器。

它由 Tien Nam Do 开发，使用 Apache 2.0 协议开源，支持 Windows、macOS、Linux、Android 和 iOS。当前版本为 1.18.2（2026 年 8 月 21 日）。

传输流程分三步：

1. 两台设备安装 LocalSend，连接到同一个局域网
2. 打开应用，选择要发送的文件
3. 在设备列表里点选目标设备，对方确认后开始传输

不需要账号，不需要登录，也不需要把文件先上传到某个服务器。

## 局域网传输是怎么工作的？

LocalSend 通过局域网发现设备：应用向本地网络广播自己的存在，其他设备收到后显示在列表里。

传输时，发送端和接收端通过 REST API 直接通信，默认使用 53317 端口。文件从一台设备直接写到另一台设备，不经过第三方服务器，所以：

- 断网（没有互联网）也能用，只要路由器还在工作
- 速度取决于局域网带宽，没有云端限速
- 文件不会留在第三方服务器上

代价是两端必须在同一个网络里。跨城市、跨网络传输，LocalSend 帮不上忙。

## HTTPS 加密和 PIN 验证

LocalSend 的设备间通信使用 HTTPS 加密，传输内容在设备之间直接传递。官方常见问题写的是：所有传输都使用 HTTPS 加密，也可以开启 PIN 验证来增加一层保护。

实际使用中有两点值得注意：

- **只在局域网内生效**：HTTPS 保护的是两台设备之间的这段连接，跨网络无法连接，也就没有传输通道。
- **PIN 是可选的**：开启后，接收方需要输入正确的 PIN 才能接收，适合在公共或共享网络里使用。

需要说明的是，HTTPS 保护的是「传输过程」，并不等于文件在接收端也被加密存储。接收方拿到文件后，文件仍然以普通文件形式保存在本地。

## 怎么用？

### 安装版

1. 从官网或应用商店安装 LocalSend
2. 确保两台设备连接同一个 Wi-Fi 或同一网段
3. 在发送端选择文件，点选接收设备
4. 接收端确认（如果开了 PIN，输入 PIN）
5. 文件默认保存到「下载」目录，可在设置里修改

### 网页版

1. 在浏览器打开 `https://web.localsend.org/`
2. 选择文件
3. 选择局域网内的目标设备并发送

如果找不到设备，先确认接收端已经打开 LocalSend，再检查是不是同一网段。

## 和 AirDrop 的区别

| 对比项 | LocalSend | AirDrop |
| --- | --- | --- |
| 平台 | Windows、macOS、Linux、Android、iOS、网页版 | 仅苹果设备 |
| 网络要求 | 同一局域网 | 蓝牙 + Wi-Fi，苹果设备之间 |
| 是否经过服务器 | 否 | 否 |
| 开源 | 是 | 否 |
| 传输确认 | 接收方确认，可加 PIN | 接收方确认 |

跨平台是 LocalSend 的主要优势。如果两边都是苹果设备，AirDrop 的体验更省事；只要有一台 Windows 或 Android，LocalSend 更直接。

## 有哪些限制？

- 只能在同一局域网内使用，不能跨网络传输
- 部分公共 Wi-Fi 或公司网络开启了客户端隔离，设备之间互相不可见
- 防火墙可能拦截 53317 端口，需要放行
- 网页版只能发送，不能作为接收端
- 接收端未确认时不会自动接收文件
- 大文件传输受 Wi-Fi 稳定性和设备存储空间限制
- 没有断点续传之外的云端备份能力，传完即结束

## 适合谁？

适合：

- 在 Mac、Windows、Android、iPhone 之间互传文件的人
- 不想把文件上传到网盘或聊天工具的人
- 经常在会议室、家里、工作室等同一网络环境下传文件的人
- 需要在临时设备上发文件、又不想安装软件的人（用网页版）

不适合：

- 需要跨城市、跨网络传文件的人
- 需要长期共享文件夹、版本管理的人
- 需要云端备份的人

## 最后判断

回到最初的问题：LocalSend 有网页版，地址是 web.localsend.org，可以在浏览器里直接发文件。

但网页版是补充，不是替代。局域网发现、HTTPS 加密、不经过第三方服务器这些核心机制，仍然由安装版承担；网页版解决的是「这台电脑不想装软件」的临时需求。

如果你的使用场景是固定的几台设备之间互传，装安装版更省事；如果只是偶尔在别人的电脑上发一次文件，网页版够用。

封面与界面图片来自 LocalSend 官网。
