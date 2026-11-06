---
urlSlug: "orca-ade"
title: "Orca ADE 评测：当 Claude Code 和 Codex 同时开工，你缺的是一个工作台"
date: "2026-11-06"
updatedAt: "2026-11-06"
description: "Orca ADE 是一款免费开源的 Mac 应用，用独立 git worktree 并行运行 Claude Code、Codex 等 AI 编程 Agent。这篇评测说明它解决了什么、哪些地方让人皱眉，以及谁该装。"
quickTake: "Orca 把多个 Agent 的并行工作变成可管理、可审查、可回收的流程。它省下的是收拾残局的时间。"
bestFor:
  - "已经在使用 Claude Code、Codex 等 CLI Agent 的开发者"
  - "需要同时推进多个任务、又不想反复 stash 和切分支的人"
  - "想把 Agent 放到远程机器或服务器上运行的人"
officialUrl: "https://www.onorca.dev/"
faqs:
  - question: "Orca ADE 是什么？"
    answer: "Orca ADE 是一款面向 AI 编程 Agent 的桌面开发环境。它把每个任务放在独立的 git worktree 中，让 Claude Code、Codex、Cursor CLI 等 Agent 并行工作，并提供终端、编辑器、浏览器、差异审查和远程运行功能。"
  - question: "Orca 是免费的吗？"
    answer: "是。Orca 采用 MIT 许可证开源，桌面端可以免费下载使用。官网另设 Enterprise 页面，提供团队部署、自托管和安全合规方面的沟通入口，未列出个人付费档位。"
  - question: "Orca 和 Cursor 有什么区别？"
    answer: "Cursor 是以编辑器为中心的 AI IDE。Orca 不替代编辑器，而是管理多个外部 CLI Agent 的运行环境：每个任务一个 worktree，可并排查看终端、差异和浏览器，并支持 SSH、远程服务器和手机端监控。"
  - question: "Orca 支持哪些 AI Agent？"
    answer: "官网称支持 27 个 CLI Agent。文档的内置列表包含 Claude Code、Codex、Cursor CLI、Gemini、OpenCode、Grok、GitHub Copilot CLI、Aider、Goose、Cline、Kimi、Qwen Code 等，也可以运行其他 CLI Agent。"
  - question: "Orca 支持哪些系统？"
    answer: "桌面端支持 macOS（Apple Silicon 和 Intel）、Windows 10/11 和 Linux（AppImage、deb、rpm）。手机端提供 iOS App 和 Android APK，目前为 Beta。"
  - question: "Orca 手机端能做什么？"
    answer: "手机端是桌面端的远程控制，不是完整编辑器。它可以查看 Agent 状态和终端输出、回复提示、休眠 worktree、查看源代码管理、提交更改和切换账号，并接收完成通知。"
  - question: "使用 Orca 需要注意什么？"
    answer: "Orca 默认为新启动的 CLI Agent 预填跳过权限确认的参数，官方说明理由是 worktree 可丢弃，但用户仍应在设置中确认权限模式。另有用户反馈界面功能较多、Electron 版本存在内存和 CPU 占用问题，建议先小规模试用。"
categories:
  - "开发工具"
  - "AI"
tags:
  - "Orca"
  - "AI 编程"
  - "Agent"
  - "Claude Code"
  - "Codex"
  - "工作流"
aliases: []
draft: false
heroImage: "/media/orca-ade/hero.png"
---

多 Agent 开发最常见的事故发生在工作目录里：两个 Agent 互相覆盖。一个在改登录流程，另一个顺手回滚了配置；你刚 stash 完，第三个又开始切分支。等到发现时，diff 已经混在一起，谁也说不清哪一行是谁改的。

Orca ADE 就是冲这件事来的。

它是一款面向 AI 编程 Agent 的桌面开发环境。每个任务会得到一个独立的 git worktree 和分支，Claude Code、Codex、Cursor CLI 等命令行 Agent 在各自目录里运行，你再在一个窗口里看终端、看差异、看浏览器，决定保留哪一个结果。

Orca 由 Stably AI 开发，官网显示其获得 Y Combinator 支持，GitHub 仓库约有 11.6 万 stars。桌面端采用 MIT 许可证开源，macOS、Windows 和 Linux 都可以免费下载。

## 先说结论

如果你已经在两个以上 Agent 之间来回切换，Orca 值得今天就装。它解决的是协调问题，而且至少在产品结构上，比大多数“AI IDE”更彻底。

如果你只有一个 Agent，或者主要想要代码补全，先别折腾。Orca 不提供模型，也不打算替代你的编辑器。它的功能密度会让你付出学习成本，而你暂时用不上。

这款产品最舒服的地方，是把 worktree 从 git 术语变成了主界面。最让人皱眉的地方，是它把太多能力塞进了同一个侧边栏。

免费和开源降低了试错成本，但默认的权限设置需要你自己检查一遍。这一点后面会单独说。

## 它解决的是协调问题

大多数 AI 编程工具在回答一个问题：怎么让模型写出更好的代码。

Orca 在回答另一个问题：当三个模型同时写代码，怎么让它们别互相踩脚。

这两个问题的难度不一样。前者靠模型能力，后者靠工程约束。Orca 的选择是把约束做进产品：一个任务一个 worktree，一个 worktree 配一个 Agent。工作目录天然隔离，冲突被推迟到合并的时候，而不是在编辑过程中随机爆炸。

这个设计听起来很朴素，但它改变了很多日常动作。

你不再需要为了试一个方案先 stash 当前修改。你不再需要记住哪个终端对应哪个分支。你也不再需要在一个 Agent 跑偏时，把整个工作区回滚。大不了删掉那个 worktree，主分支还在。

官网文档给出的入门流程很直接：添加仓库，新建 worktree，选择 Agent，再重复两次，用另外两个 Agent 跑同一个任务，最后比较三份 diff，留下最合适的那一份。

这也是 Orca 最像“工作台”的地方。它不替你思考，但把并行尝试的成本降到了可以随手试一次的程度。

## 用起来最舒服的三件事

### 新建 worktree 像开一个新标签页

Orca 把新建任务做成了一次点击。输入任务名，选起始分支，选 Agent，目录和分支就建好了。任务名留空时，它会用海洋生物的名字命名，这种小细节让人愿意多用几次。

更重要的是回收也简单。任务做完，合并、推送、删除 worktree，一气呵成。不会留下十几个不知道对应哪条分支的临时目录。

对一个经常同时改三四个需求的人来说，这种“可丢弃”的感觉很省心。

### 三个 Agent 并排，进度终于可见

Orca 支持把 worktree 的标签拖到窗口边缘分屏。三个 Agent 同时跑，三个终端同时可见，谁卡住了、谁在等确认、谁已经跑完，一眼能看出来。

三个 Agent 同时跑起来的那一刻，会有一种很具体的掌控感：屏幕上从一个等你输入的空框，变成三份正在推进的工作。你从“操作 Agent 的人”变成了“看住进度的人”。

这个体验很难用参数描述。它解决的是等待中的不确定感：以前你开三个终端，只能靠来回点窗口确认进度；现在它们就在同一块屏幕上。

如果 Agent 需要你回复，Orca 会发通知。手机端也能接收，并直接回复。

### diff 审查把“信任”变成“检查”

AI 写代码最危险的部分，是它写出来了，你懒得看。

Orca 的差异查看器可以逐文件看修改，也可以在具体代码行上留评论，再批量发回给 Agent 修改。提交、推送、创建或关联 GitHub Pull Request 都能在应用内完成。

这让“审查”变成了流程里顺手的一步，而不是下班前的一次性补救。对需要长期维护的项目，这比多生成几百行代码有价值。

## 远程和手机：把等待时间捡回来

Orca 的 worktree 不一定要跑在当前这台电脑上。官方文档给了四种运行方式：

- 本地运行，适合日常开发
- 通过 SSH 连到自己的开发机、VPS 或 GPU 主机
- 把 Orca 作为常驻服务器运行，再用笔记本、浏览器或手机连接
- 用自己的云账号为每个任务创建临时环境

远程模式有一个明确的边界：机器和云账号都是用户自己的。Orca 不出售托管 VPS，也不代收云服务费用。这既是自由，也是维护成本。

手机端是这个思路的延伸。它不能完整编辑代码，定位是桌面端的远程控制：看 Agent 状态、读终端输出、回复提示、休眠 worktree、查看源代码管理、提交更改、切换账号，以及接收完成通知。

对经常离开工位的人来说，这个功能的价值很直接。Agent 跑完一个任务，你在路上就能决定下一步，不用等到回电脑前才发现它已经卡了半小时。

手机端目前在 [App Store](https://apps.apple.com/us/app/orca-ide/id6766130217) 的评分是 4.7 分，共 71 个评分。样本不大，但至少说明早期用户愿意给它正面评价。官方文档仍把它标为 Beta。

## 它让人皱眉的地方

### 功能太多，第一次会迷路

Orca 的侧边栏同时装着仓库、worktree、Agent 会话、任务、插件、自动化、用量和远程机器。光看这份功能列表，就能理解新用户为什么会愣一下。

[Leo](https://x.com/leodev/status/2098380789352419508) 在 X 上的评价很直接：Agent 编排是同类里最好的，但侧边栏混乱，功能多且组织不佳，速度也比 t3 code 慢，终端里运行 Agent 的体验不理想。

这段批评值得认真看，因为它没有否定 Orca 的核心能力，只指出了产品成熟度的问题。对一个更新频率很高的工具来说，这类问题通常会在几个版本内变化，但在当下确实是新用户要付的成本。

### Electron 的代价

Orca 是 Electron 应用。它的好处是 macOS、Windows、Linux 三端体验接近；代价是内存和 CPU。

GitHub 上有用户报告[远程服务器内存和 CPU 占用过高](https://github.com/stablyai/orca/issues/6288)、[空闲时多个 Electron 进程持续占用 CPU](https://github.com/stablyai/orca/issues/5386)，以及[应用突然变慢](https://github.com/stablyai/orca/issues/6795)。部分问题已经关闭或修复，但这类反馈说明：如果你习惯同时开很多 Agent，风扇和电池会成为日常体验的一部分。

Orca 提供了资源管理器，可以查看每个 Agent 的 CPU 和内存占用。这个功能很实用，也侧面说明资源消耗是这类工作流的常态。

### 默认跳过权限确认，这个设置别忽略

Orca 文档写明，新启动的 CLI Agent 会预填跳过权限确认的参数。Claude 对应 `--dangerously-skip-permissions`，Codex 对应 `--dangerously-bypass-approvals-and-sandbox`。

官方理由是 worktree 可以丢弃，Agent 在自己的检出目录里试验时，不必反复确认每条命令。

这个理由站得住，但它只适用于“可以丢弃”的项目。如果工作目录里有生产凭据、真实用户数据，或者 Agent 能执行不可回滚的部署命令，默认值就不合适。

Orca 允许在 `Settings → Agents → Agent Permissions` 里改成手动确认。装完之后先看一眼这个设置，比事后复盘便宜得多。

### 手机端仍是 Beta

手机端适合查看和做简单决策，不适合当成移动 IDE。官方自己也是这么定位的。把预期放在“远程遥控器”，失望会少很多。

此外，有用户反馈[点击聊天会话时会直接关闭会话](https://x.com/canmenzo/status/2096418724953665839)，没有确认对话框。这类交互问题不影响核心流程，但会让人在关键时刻心里一紧。

## 别人怎么说

Orca 官网专门收集了公开的 X 帖子作为证言。这些证言当然偏正面，所以我另外找了几条批评，放在一起看。

Jason Zhou 说自己试过几乎所有并行 ADE，目前最喜欢 [Orca](https://x.com/jasonzhou1993/status/2076256816934392155)，列出的理由是原生 TUI、文件查看器、自定义命令、手机端、用量跟踪、Design Mode 和 GitHub 任务跟踪。他用「10x」形容自己的感受。

erik.eth 的分工更清楚：精细编辑和配对编程用 Zed，多 Agent 并行用 [Orca](https://x.com/programmer/status/2084411441168499030)。他把 Orca 称为“管理多个 Agent”这一类工具里最好的。

Dhilip Subramanian 把 [Orca](https://x.com/sdhilip/status/2072786548785807427) 设成了默认 IDE。他的用法是让一个 Agent 负责规划和难题，再把执行分给 Codex 等其他 Agent，任务完成后通过通知查看结果。

Trevin Chow 提到一个很具体的好处：把一个包含多个仓库的上级目录加进 [Orca](https://x.com/trevin/status/2080772520320630785) 后，可以在一个会话里跨仓库工作，不必在三个 Agent 会话之间切换。

Dave Fano 则把多台机器和手机端连起来，形容这是自己[理想中的工作流](https://x.com/davidfano/status/2091541254446170352)。

反面声音同样具体。除了 Leo 对界面和速度的批评，还有用户反馈会话会被误关，GitHub 上也有关于内存、CPU 和卡顿的 issue。

这些评价集中在 2026 年 7 月到 9 月。Orca 的更新频率很高，部分体验问题可能已经变化。把它们当作“买前须知”，比当作最终判决更合适。

## 和 Cursor 放在一起看

Cursor 的中心是编辑器。你在里面写代码，AI 在旁边补全、改写、回答问题。它的顺手来自“不用离开当前文件”。

Orca 的中心是任务调度。你告诉它要做什么，它开一个 worktree，叫一个 Agent 进去干活，再把结果拿回来给你审。它的顺手来自“不用同时盯三个终端”。

两者可以一起用。Orca 官方也把自己定位成 Agent 开发环境，而不是编辑器的替代品。需要精细修改时，你仍然可以回到 VS Code、Zed 或 Cursor。

区别落在购买理由上：如果你想要更聪明的补全，选编辑器；如果你已经被多 Agent 的协调成本拖住，装 Orca。

## 谁该用，谁先别急

更适合：

- 已经在使用 Claude Code、Codex 等 CLI Agent 的开发者
- 经常同时推进多个任务，受困于分支切换和目录冲突的人
- 想让多个 Agent 对同一任务并行尝试，再比较结果的人
- 需要把 Agent 放在远程机器上持续运行的人
- 希望使用免费、开源工具，不想再增加模型订阅的人

不太适合：

- 刚开始接触 AI 编程，还没有固定使用某个 CLI Agent 的人
- 主要需要代码补全和编辑器功能的用户
- 希望工具直接提供模型额度、开箱即用的人
- 对 Electron 应用资源占用比较敏感的人

## 怎么开始

macOS 用户可以用 Homebrew 安装：

```bash
brew install --cask stablyai/orca/orca
```

也可以从[下载页](https://www.onorca.dev/download)获取 macOS、Windows 和 Linux 安装包。

装完后按这个顺序走一遍：

1. 添加一个本地仓库
2. 新建 worktree，选一个你熟悉的 Agent
3. 把同一个任务再建两个 worktree，换用不同 Agent
4. 分屏看完三份结果，比较 diff
5. 合并其中一份，删掉另外两个

这一圈走完，你会很快知道自己需不需要它。不需要的人会觉得多余，需要的人很难再回到手动切分支的日子。

## 最后的判断

Orca 不会让一个不会写代码的人突然能交付项目。它服务的是已经在写代码、已经被多 Agent 协调磨过的人。

它的价值可以概括成三个字：收得住。任务收在 worktree 里，结果收在 diff 里，远程任务收在手机通知里。免费开源让这件事的试错成本足够低。

它的问题也很清楚：功能密度高，Electron 吃资源，权限默认值需要自己把关，手机端还在 Beta。

所以结论不复杂。如果你今天还在为三个 Agent 抢同一个目录发火，装它。如果你只有一个 Agent，先把时间和钱留给模型订阅。

## 资料来源

- [Orca 官网](https://www.onorca.dev/)
- [Orca 文档：What is Orca?](https://www.onorca.dev/docs)
- [Orca 文档：Install](https://www.onorca.dev/docs/install)
- [Orca 文档：Your first 3-agent session](https://www.onorca.dev/docs/first-session)
- [Orca 文档：Ways to run Orca](https://www.onorca.dev/docs/ways-to-run)
- [Orca 文档：Supported agents](https://www.onorca.dev/docs/agents/supported)
- [Orca 文档：Mobile companion](https://www.onorca.dev/docs/mobile)
- [Orca GitHub 仓库](https://github.com/stablyai/orca)
- [Orca IDE App Store 页面](https://apps.apple.com/us/app/orca-ide/id6766130217)

封面图片来自 Orca 官网。
