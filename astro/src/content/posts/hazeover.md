---
urlSlug: "hazeover"
title: "HazeOver：调暗背景窗口，只留下正在用的那个"
seoTitle: "HazeOver 评测：Mac 窗口调光工具，4.99 美元买断"
date: "2026-11-15"
featured: true
featuredRank: 2
updatedAt: "2026-11-15"
description: "HazeOver 是一款 Mac 菜单栏工具，通过调暗背景窗口突出当前窗口。本文整理它的工作原理、快捷键、多显示器设置、自动化方式、价格和已知问题。"
quickTake: "HazeOver 只做一件事：把非活动窗口调暗，让当前窗口跳出来。它不改变窗口位置，也不隐藏任何东西，4.99 美元买断，适合屏幕大、窗口多、经常打错窗口的人。"
price: "4.99 美元买断（数码荔枝 ¥29）"
platform: "macOS 13 Ventura 及以上"
officialUrl: "https://hazeover.com/zh_cn/"
lizhiUrl: "https://lizhi.shop/products/hazeover?cid=j13endai&utm_medium=z6zyprgn"
lizhiName: "HazeOver"
sources:
  - name: "HazeOver 中文官网"
    url: "https://hazeover.com/zh_cn/"
    note: "功能、系统要求与媒体评价"
  - name: "HazeOver 帮助与生产力技巧"
    url: "https://hazeover.com/zh_cn/help.html"
    note: "快捷键、手势、多显示器和权限设置"
  - name: "HazeOver 购买页"
    url: "https://hazeover.com/zh_cn/buynow.html"
    note: "价格与购买渠道"
  - name: "HazeOver 媒体资料包"
    url: "https://hazeover.com/presskit.html"
    note: "版本、开发者和媒体引言"
quotes:
  - text: "使用 HazeOver 就像在你唯一该专注的地方打一束聚光灯。"
    source: "The New York Times / Wirecutter"
    url: "https://www.nytimes.com/wirecutter/blog/apps-focus-work-from-home/"
  - text: "It does this simple task with aplomb, and it makes a significant difference in the day-to-day usability of macOS."
    source: "John Gruber，Daring Fireball"
    url: "https://daringfireball.net/2026/03/hazeover"
bestFor:
  - "屏幕上同时开着多个窗口的人"
  - "使用大尺寸显示器或外接屏的人"
  - "经常把内容打进错误窗口的人"
  - "想降低屏幕整体亮度、减少眩光的人"
faqs:
  - question: "HazeOver 是什么？"
    answer: "HazeOver 是一款 Mac 菜单栏工具，在当前窗口后面加一层半透明深色遮罩，调暗其他窗口和桌面，让正在使用的窗口更明显。"
  - question: "HazeOver 会移动或隐藏窗口吗？"
    answer: "不会。窗口的位置、大小和数量都不变，它只改变背景的明暗，所以你原来的窗口布局不受影响。"
  - question: "HazeOver 多少钱？"
    answer: "官网定价 4.99 美元，一次买断，没有订阅。也可以通过 Setapp 订阅获取，或在 Mac App Store 外购买独立授权。数码荔枝的中国区价格为 29 元。"
  - question: "有免费试用吗？"
    answer: "官网提供 DMG 安装包供免费试用，试用限制以官方说明为准。也可以先通过 Setapp 试用。"
  - question: "支持哪些系统？"
    answer: "当前版本 1.9.9 需要 macOS Ventura 13 或更高版本，官方说明兼容 macOS 27 Golden Gate。"
  - question: "会不会影响正在使用的窗口？"
    answer: "不会。调光只作用于背景窗口和桌面，当前窗口的亮度、清晰度和色彩不受影响。"
  - question: "多显示器怎么用？"
    answer: "可以在每块屏幕上分别高亮当前窗口，也可以选择调暗没有键盘焦点的显示器，方便判断正在哪块屏幕上输入。也可以彻底关闭某块屏幕的调光。"
  - question: "关闭所有窗口后整个屏幕变暗，是 bug 吗？"
    answer: "不是。macOS 在关闭或最小化某个 App 的全部窗口后，不会自动切到下一个 App。此时当前 App 没有活跃窗口，HazeOver 就会调暗全部内容。看左上角的 App 名称可以确认。"
categories:
  - "效率工具"
tags:
  - "HazeOver"
  - "专注工具"
  - "窗口管理"
  - "菜单栏应用"
  - "Mac 工具"
aliases: []
draft: false
heroImage: "/media/hazeover/hero.jpg"
---

HazeOver 是一款 Mac 菜单栏工具，作用只有一个：把当前窗口之外的区域调暗。

它不移动窗口，不隐藏窗口，也不改变窗口数量。切换窗口时，遮罩跟着移动，正在用的那个窗口始终是画面里最亮的部分。

## HazeOver 是什么？

HazeOver 由独立开发者 Maxim Ananov 开发，第一版发布于 2011 年，当前版本 1.9.9，需要 macOS Ventura 13 或更高版本。

它在后台运行，在活动窗口后面加一层半透明深色图层。切换到别的窗口时，之前的窗口自动变暗，新的窗口变亮。

常驻菜单栏，可以设置开机启动。官网把它称为「分心调光器」（Distraction Dimmer）。

## 它是怎么工作的？

调光层位于所有窗口和桌面之间，只覆盖背景。因此：

- 当前窗口的颜色、清晰度和亮度不受影响
- 桌面图标、其他 App 的窗口会一起变暗
- 窗口位置和大小保持不变

官网说明，HazeOver 的做法是在窗口后面添加半透明图层，降低的是画面上背景的亮度，不是显示器本身的亮度设置。

如果希望切换窗口时响应更快、判断更准，可以在设置里授予辅助功能权限。授权一次即可，之后 HazeOver 能立即识别当前活跃窗口。

## 调光强度和动画怎么设置？

设置窗口的 General 页有一个圆盘，用来调整调光强度，从 min 到 max。官网建议从能看清背景但不干扰阅读的程度开始。

切换效果可以选择即时切换或平滑动画，动画速度可以调。强度越低，背景越接近原样；强度越高，背景越接近纯黑。

![HazeOver 的通用设置，左侧圆盘调整调光强度](/media/hazeover/settings.png)

## 有哪些快捷操作？

除了点菜单栏图标，HazeOver 提供几种更快的操作方式：

- 键盘快捷键：默认 `⌃⌥⌘H`（Control-Option-Command-H），可在「快捷键」标签页自定义
- 连按菜单栏图标：快速开关调光
- 在菜单栏图标上滚动：调整强度，滚到最小值会关闭 HazeOver
- 拖动文件时按住 `fn`：临时关闭调光，方便看清目标位置
- 点击桌面：临时关闭调光

如果使用触控板，在图标上滚动调整强度比进设置快得多。

## 多显示器怎么处理？

HazeOver 有两种多屏模式：

- 在每块显示器上分别高亮当前窗口
- 调暗没有键盘焦点的显示器，只保留正在输入的那块

第二种适合外接大屏的场景：不用移动鼠标，就能看出当前输入落在哪块屏幕上。

也可以在「显示器」菜单里彻底关闭某块屏幕的调光，例如让副屏保持原样，只处理主屏。

![HazeOver 的多显示器选项](/media/hazeover/displays.png)

## 深色和浅色外观

调光设置可以为深色和浅色外观分别保存。开启「自动外观」后，系统切到深色模式时可以用一套强度和颜色，切回浅色时用另一套。

例如白天用较轻的强度，夜间用更深的遮罩。设置位置在「高级」>「深色模式设置」。

## 怎么自动化？

HazeOver 的开关和参数可以通过以下方式控制：

- 快捷指令 App
- 专注模式过滤：切换到某个专注模式时自动开启或调整强度
- AppleScript
- Spotlight：1.9.9 版本起可以直接在 Spotlight 里改设置并绑定快捷键
- 第三方自动化工具

常见的组合是：打开「工作」专注模式时自动开启 HazeOver，同时切深色模式和勿扰。这样不用每次手动点菜单栏。

## 价格和购买方式

官网定价 4.99 美元，一次买断，没有订阅，价格随当地货币和税费变化。

购买渠道有四种：

- Mac App Store
- 官网直接购买（Mac App Store 之外）
- Setapp 订阅
- 学生优惠

数码荔枝也销售 HazeOver，中国区价格 29 元，提供激活码和售后。想在本地支付、开发票的用户可以走这条路。

## 和不用它的方式有什么区别？

不用 HazeOver 时，减少干扰通常有三种做法：

- 把不用的窗口最小化或隐藏：会改变布局，需要重新找回窗口
- 用全屏模式：只适合单任务，切出去再切回来有动画
- 靠窗口边框和阴影分辨：macOS 近几版的窗口对比度不高，多个窗口叠在一起时不容易分辨

HazeOver 不改动布局，也不要求全屏，只改变明暗对比。代价是背景内容确实变暗了，如果你需要同时阅读两个窗口，就得把其中一个切到前台。

## 有哪些注意点？

- 关闭或最小化某个 App 的全部窗口后，macOS 不会自动切到下一个 App，此时 HazeOver 会调暗全部内容。看左上角 App 名称可以确认，这不是故障
- 默认快捷键占用 `⌃⌥⌘H`，与已有快捷键冲突时可以改
- 想获得更快的响应，需要授予辅助功能权限
- 调光层会出现在屏幕画面上。Apple 的截屏专题也提到，制作截图时打开 HazeOver 能让画面更聚焦
- 需要 macOS 13 或更高版本，旧系统只能用旧版本
- 它只处理视觉对比，不拦截通知，也不限制 App 使用

## 用户评价和媒体评价

Mac App Store 上，官网引用的近期评分为 4.9/5，基于 3133 条评分和评价。

The New York Times 的 Wirecutter 把它形容为「在你唯一该专注的地方打一束聚光灯」。John Gruber 在 Daring Fireball 里写道，HazeOver 做的事很简单，但完成得很到位，对 macOS 的日常可用性有明显改善——他认为近几版 macOS 都难以一眼分辨最前面的窗口。

Apple 也在 Mac App Store 的多个专题里推荐过它，包括 Christina Warren 的效率工具专题。

## 适合谁？

更适合：

- 屏幕大、窗口常年开着十几个的人
- 经常把文字打进错误窗口的人
- 用外接显示器、需要判断当前输入在哪块屏幕上的人
- 想降低整体屏幕亮度、减轻眩光的人
- 喜欢菜单栏小工具、不想装重型窗口管理软件的人

不太适合：

- 需要同时并排阅读多个窗口的人
- 习惯用全屏或台前调度管理窗口的人
- 使用 macOS 12 或更早系统的用户
- 期待它拦截通知、限制 App 使用的人

## 最后判断

HazeOver 的功能边界很清楚：只调暗背景，不改变任何窗口的位置和数量。

如果你的问题只是「分不清现在在用哪个窗口」，它能直接解决，而且装上之后基本不用再打开设置。4.99 美元买断、常驻菜单栏、占用资源少，属于装了就忘的类型。

如果你需要的是窗口布局管理、快捷键分屏或者通知拦截，那是另一类工具，HazeOver 不负责这些。

封面图片和界面截图来自 HazeOver 官方媒体资料包。
