---
urlSlug: "little-snitch"
title: "Little Snitch 6：看清每个 App 连了哪里"
seoTitle: "Little Snitch 6 评测：Mac 防火墙与联网监控，59 欧元"
date: "2026-11-15"
updatedAt: "2026-11-16"
description: "Little Snitch 6 是 macOS 上的网络监控与防火墙工具，可拦截应用联网、订阅黑名单、加密 DNS、查看流量地图和 12 个月历史。本文整理功能、授权和注意点。"
quickTake: "Little Snitch 让你看见每个 App 在连谁，并在连接发生前决定放行或拒绝。它不是杀毒软件，也不加密流量，但对想控制联网行为的 Mac 用户，目前没有同等成熟的替代品。"
price: "59 欧元买断（数码荔枝 ¥419）"
platform: "macOS 14 Sonoma 及以上"
officialUrl: "https://www.obdev.at/products/littlesnitch/"
lizhiUrl: "https://lizhi.shop/products/little-snitch?cid=j13endai&utm_medium=z6zyprgn"
lizhiName: "Little Snitch 6"
sources:
  - name: "Little Snitch 官网"
    url: "https://www.obdev.at/products/littlesnitch/index.html"
    note: "功能、监控与规则说明"
  - name: "Little Snitch 下载页"
    url: "https://www.obdev.at/products/littlesnitch/download.html"
    note: "当前版本 6.5 与系统兼容"
  - name: "Little Snitch 购买页"
    url: "https://www.obdev.at/products/littlesnitch/order.html"
    note: "授权类型与价格"
  - name: "数码荔枝商品页"
    url: "https://lizhi.shop/products/little-snitch"
    note: "中国区价格、授权档位与试用"
quotes:
  - text: "The Little Snitch Network Monitor shows you where your Mac connects to on the Internet. You decide what you want to allow or deny."
    source: "Little Snitch 官网"
    url: "https://www.obdev.at/products/littlesnitch/index.html"
bestFor:
  - "想控制哪些 App 可以联网的人"
  - "在意隐私、想看清后台连接的人"
  - "需要按网络环境切换规则的人"
  - "要排查异常流量或可疑连接的人"
faqs:
  - question: "Little Snitch 6 是什么？"
    answer: "Little Snitch 6 是 macOS 上的网络监控与防火墙工具，会在应用尝试联网时提示，并允许你按应用、域名、端口设置放行或拒绝规则。"
  - question: "Little Snitch 6 多少钱？"
    answer: "官网单用户授权 59 欧元，一人可在多台电脑上使用。数码荔枝的中国区价格为单用户 419 元、家庭用户 799 元。"
  - question: "买 6 能用到 7 吗？"
    answer: "可以。官网说明当前授权同时适用于 Little Snitch 6 和即将发布的 Little Snitch 7。"
  - question: "有免费试用吗？"
    answer: "有。未输入授权码时以演示模式运行，功能和正式版一致，每次可运行 3 小时，可以反复重启；网络监控部分在 30 天后停止。"
  - question: "支持哪些系统？"
    answer: "当前版本 6.5 支持 macOS 14 Sonoma 到 macOS 27，也兼容 Tahoe、Sequoia。"
  - question: "Little Snitch 能防病毒吗？"
    answer: "不能。它只控制网络连接，不扫描文件、不拦截恶意软件。它能发现异常联网行为，但不能替代杀毒软件。"
  - question: "会影响网速吗？"
    answer: "它在系统网络层过滤连接，官方定位是长期常驻工具。日常使用影响很小，但开启大量规则和完整流量记录会占用一定资源。"
  - question: "支持中文吗？"
    answer: "界面以英文为主，数码荔枝标注界面语言为英文。"
categories:
  - "系统工具"
tags:
  - "Little Snitch"
  - "防火墙"
  - "网络监控"
  - "隐私"
  - "Mac 工具"
aliases: []
draft: false
heroImage: "/media/little-snitch/hero.jpg"
---

Little Snitch 6 是 macOS 上的网络监控与防火墙工具，由奥地利的 Objective Development 开发，已经维护了 20 多年，当前版本 6.5。

它的核心逻辑很简单：任何应用第一次尝试联网时，先弹窗问你；你决定放行还是拒绝，这个决定会变成一条规则。

![Little Snitch 的网络监控，可看到连接去向和各地服务器](/media/little-snitch/hero.jpg)

## Little Snitch 6 是什么？

Little Snitch 是一个网络层的过滤工具，控制的是「谁能连出去、连到哪里」。

它不是杀毒软件，也不加密你的流量。它做的是三件事：

- 在连接发生前拦截并询问
- 记录每个应用连了哪些服务器、传了多少数据
- 按应用、域名、端口、协议设置允许或拒绝的规则

安装后会常驻菜单栏，监控窗口可以随时打开。

## 连接提示和静默模式

默认状态下，每个新连接都会弹窗。弹窗里能看到应用名、目标域名、端口和协议，可以直接允许一次、永久允许，或者拒绝。

问题在于，刚装好的头几天弹窗会非常多，尤其是浏览器和各种后台服务。

静默模式（Silent Mode）解决的正是这个：新连接先自动允许，不打断你，之后在列表里统一处理。适合装好软件先跑一段时间，再回头收拾规则。

## 网络监控看什么？

监控窗口是 Little Snitch 6 变化最大的部分：

- **地图视图**：把连接画成从本机到世界各地服务器的连线
- **层级分组**：按应用、域名或国家组织连接
- **流量详情**：数据量、服务器位置、端口和协议
- **实时图表**：查看当前和历史流量，最多回溯 12 个月
- **搜索**：用应用、主机名、国家、城市等条件筛选

地图更多是直观感受，真正有用的是右侧的详情：某个 App 连了哪些域名、解析到哪些 IP、用了什么端口和协议。

对排查「这个软件到底在偷偷传什么」，这些信息比地图更实在。

## 规则怎么设？

![Little Snitch 的规则管理窗口，左侧是规则组和配置，右侧是具体规则](/media/little-snitch/management.png)

规则可以按多个维度限定：

- 应用或进程
- 域名、IP 地址、国家
- 端口和协议
- 出站或入站，也可以设双向规则

几个细节值得注意：

- **进程识别基于代码签名**：应用被改名或移动位置，规则依然有效
- **应用组**：可以让规则同时作用于所有 macOS 进程或模拟器进程
- **规则使用统计**：能看到每条规则被应用了多少次
- **规则整理**：会提示失效的规则、被其他规则覆盖的冗余规则，并建议新规则

规则多了以后，「整理」这个功能比「添加」更重要。

## 配置文件和自动切换

Profile 是一组规则的集合，可以按场景切换：

- 家里、公司、公共 Wi-Fi 各一套
- 连上某个 Wi-Fi 时自动切换到对应配置

出差时把规则调严、回到家里放宽，不需要每次手动改。

规则组（Rule Group）可以本地创建，也可以订阅远程规则组，一键开关。

## 黑名单订阅

Little Snitch 6 内置了按主题分类的黑名单：

- 广告和跟踪
- 恶意软件域名
- 特定供应商的遥测

订阅后每天自动更新，支持 IP 段形式的黑名单。对不想自己写规则的人，这是最快的上手方式。

## DNS 加密

域名解析请求默认是明文的，网络中间人能看到你访问了哪些网站。

Little Snitch 6 内置 DNS 加密，支持 DoH、DoT 和 DoQ 三种协议，默认使用 Quad9 等公共 DNS 服务。开启后解析请求被加密，运营商和公共 Wi-Fi 看不到具体域名。

这一项和防火墙是两个独立功能，可以单独使用。

## 声音提示和命令行

- **声音规则**：可以给特定连接设置提示音，部分音效会随数据量变化
- **命令行工具**：可以修改设置、导出规则、响应弹窗、记录允许和拒绝事件

对做自动化或排查问题的人，命令行比图形界面更快。

## 版本和价格

当前版本 6.5，支持 macOS 14 Sonoma 到 macOS 27。官网已经在测试 Little Snitch 7，购买当前授权同时适用于 6 和 7。

授权方式：

- **单用户**：59 欧元，一个人可在任意多台电脑上使用
- **家庭授权**：最多 5 台电脑，仅限家庭私人使用
- **多用户授权**：5 台或 10 台，按用户数或电脑数中较少的一方计算
- **Micro Snitch 套装**：63.49 欧元，含摄像头和麦克风监控工具

数码荔枝的中国区价格：单用户 419 元，家庭用户 799 元，子版本免费更新。

未授权时可以演示模式运行，功能与正式版一致，每次 3 小时，可以反复重启；网络监控部分在 30 天后停止。

## 和系统自带防火墙、其他工具的区别

- **macOS 自带防火墙**：只控制入站连接，不能按应用限制出站
- **LuLu（免费开源）**：能做出站拦截，界面和规则能力比 Little Snitch 简单
- **AdGuard 等广告拦截**：主要处理网页内容，不控制应用级连接
- **Little Snitch**：出站和入站都能管，规则维度最细，带流量历史和地图

如果只需要阻止某个 App 联网，免费工具够用。如果要长期管理几十个应用的联网行为、按网络切换配置，Little Snitch 的规则体系才体现出价值。

## 有哪些限制？

- 界面以英文为主，没有中文界面
- 需要 macOS 14 或更新版本，旧系统只能用旧版本
- 不做病毒扫描，不能替代安全软件
- 不加密应用流量，只加密 DNS 请求
- 初次安装时弹窗密集，需要几天时间整理规则
- 完整流量历史会占用磁盘空间
- 演示模式每次只有 3 小时，长期使用必须购买
- 单用户 59 欧元不算便宜

## 适合谁？

更适合：

- 想知道每个 App 在连哪些服务器的人
- 需要按网络环境切换规则的人
- 对隐私敏感、想拦掉遥测和跟踪的人
- 排查异常流量、怀疑软件偷传数据的用户
- 长期在公共 Wi-Fi 下工作的人

不太适合：

- 只想装个软件、不想维护规则的人
- 使用 macOS 13 或更早系统的用户
- 期待它查杀病毒的人
- 需要中文界面的用户

## 最后判断

Little Snitch 的价值不在「拦截」，而在「可见」。

装好之后，你会第一次看清某个 App 在后台连了多少个域名、发了多少数据。这个信息本身就会改变你对软件的判断。

它的成本也很明确：59 欧元、几天时间整理规则、英文界面。如果这些都能接受，它属于装一次用很多年的工具；如果你只是想让某个软件断网，免费方案已经够用。

封面与界面图片来自 Objective Development 官网。
