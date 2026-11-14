# Supabase 产品提交与审核后台调研

调研日期：2026-11-13

## 结论

Supabase 可以承担“开发者提交资料 → 后台审核 → 发布”的工作流，但最适合 MacAppHQ 的方式不是把已发布文章整体迁入数据库，而是：

> **Supabase 只管理投稿、附件、审核状态和管理员登录；审核通过后，由受保护的 Edge Function 创建 GitHub PR，合并后继续由 Astro + Vercel 构建发布。**

这条路径保留现有 Markdown 内容、静态页面、Git 历史、预览部署和 SEO 行为；Supabase 即使短暂不可用，也只影响新投稿和审核后台，不影响已经上线的文章。

免费版足够验证需求，但不能视为可靠的长期生产承诺：低活动项目可能在 7 天内被暂停，且没有自动备份。若投稿入口必须随时可用，最早需要考虑的付费点通常是 Supabase Pro（当前起价 25 美元/月）。

## 当前项目约束

以下结论来自仓库现状，而不是平台假设：

- `astro.config.mjs` 没有配置服务端适配器，当前是 Astro 默认静态输出。
- `src/content.config.ts` 使用 `glob()` 读取本地 `src/content/posts/**/*.md`。
- 文章路由通过 `getStaticPaths()` 在构建时生成；新增内容必须触发一次新构建。
- 现有 `/submit` 是本地 Markdown 说明页，提交方式仍是邮件或微信。
- Vercel 配置执行 `npm ci` 和 `npm run build`，适合继续以 Git 提交触发部署。

因此，直接把公开文章改成运行时查询 Supabase，会扩大改造面并改变当前静态站的可靠性模型。

## 推荐架构

```text
公开 /submit 表单
  └─ Cloudflare Turnstile
      └─ Supabase Edge Function: submit-product
          ├─ 校验字段、网址、长度、重复提交
          ├─ 写入 submissions（pending）
          └─ 签发私有 Storage 上传地址

管理员 /admin/submissions
  └─ Supabase Auth（仅邀请的管理员）
      ├─ 查看/编辑投稿
      ├─ 退回补充或拒绝
      └─ 点击“生成发布 PR”
          └─ Edge Function: publish-submission
              ├─ 再次确认管理员身份与状态
              ├─ 生成符合 content schema 的 Markdown
              ├─ 将选定图片写入 public/media/{slug}/
              └─ GitHub API 创建分支和 PR

GitHub PR
  └─ Vercel Preview + 人工检查
      └─ 合并 PR → 正式部署 → 回写 published_url
```

### 前端接入方式

第一版不必把整个 Astro 站切换为 SSR。可以继续保留默认静态输出，仅让 `/submit` 和 `/admin/submissions` 加载浏览器端 Supabase 客户端：公开投稿调用 Edge Function；后台登录后通过 RLS 读取和编辑投稿。真正持有 secret key、GitHub 凭证和发布权限的操作全部留在 Edge Function。这样不会为了一个后台改变现有文章页的部署模型。

后台页面的 HTML 和 JavaScript 可被访问并不等于后台数据公开；安全边界必须是 Auth、RLS 和发布函数的服务端权限检查，不能依赖隐藏路由或前端按钮。

### 为什么不建议审核后直接写 `main`

PR 会保留最后一道可视化检查、字段差异、构建结果和撤销路径。管理员点击“生成 PR”是业务上的审核通过；合并 PR 是技术上的发布确认。第一版不应让数据库按钮直接绕过现有构建检查。

GitHub Contents API 可以创建或更新仓库文件，细粒度令牌需 `Contents: write`；创建 PR 还需 `Pull requests: write`。GitHub 说明长期集成优先使用 GitHub App，个人令牌更适合 MVP，且令牌应当按密码管理并限制到单一仓库。

## 数据模型建议

### `submissions`

- `id uuid primary key`
- `status`: `pending | reviewing | changes_requested | approved | publishing | published | rejected`
- `product_name`、`official_url`、`platform`、`pricing`
- `contact_name`、`contact_email`
- `summary`、`features jsonb`、`system_requirements`
- `proposed_slug`、`review_notes`
- `created_at`、`updated_at`、`reviewed_at`、`published_at`
- `github_pr_url`、`published_url`
- `idempotency_key`：防止重复点击产生多篇文章

### `submission_assets`

- 关联 `submission_id`
- 保存 Storage 路径、原文件名、MIME、大小、审核状态
- Bucket 使用私有 `submission-assets`，投稿阶段不要暴露公共 URL

### `submission_events`

- 记录状态变化、操作者和时间，弥补免费版没有平台审计日志的问题

产品许可证或兑换码不建议在初次公开表单中收集。现有提交页要求付费产品提供授权，但更稳妥的流程是先完成初筛，再通过单独渠道索取；这样能减少敏感凭证进入投稿数据库、日志和通知系统。

## 身份与权限

### 公开投稿

不建议浏览器使用 publishable key 直接 `insert` 数据表。即使 RLS 只开放插入，脚本仍可以绕过页面持续制造垃圾数据。

推荐让公开表单只调用 `submit-product` Edge Function：

1. 服务端验证 Turnstile token；
2. 对字段做白名单、长度、URL 和枚举校验；
3. 做频率限制与重复检测；
4. 使用服务端 secret key 写库；
5. 返回投稿编号，不返回数据库内部信息。

Supabase 官方提供 Cloudflare Turnstile 的 Edge Function 示例。Supabase Auth 自带的 CAPTCHA 主要保护登录、注册和找回密码，不能代替自定义投稿接口中的服务端验证码校验。

### 管理员后台

- 关闭公开注册，只邀请自己的管理员账号。
- 建议邮箱密码或 Magic Link 登录，并启用 TOTP MFA。
- 用 Custom Access Token Hook 写入 `user_role: admin`，RLS 只允许管理员读取和更新投稿。
- `publish-submission` 必须使用有效用户 JWT，并在函数内再次检查管理员角色；不能只依赖前端隐藏按钮。
- Supabase secret key、GitHub token、Vercel Deploy Hook URL 都只能放在服务端 secrets，不能进入浏览器 bundle 或 Git 仓库。

Supabase 明确说明 publishable key 可以出现在前端，但必须配合 RLS；secret/service-role key 会绕过 RLS，绝不能暴露到前端。

## 图片上传策略

建议只接收 PNG、JPEG、WebP：

- 图标最多 2 MB；截图单张最多 5 MB；限制数量；
- Bucket 同时设置 `allowed_mime_types` 和 `file_size_limit`；
- 不接受 SVG、HTML、DMG、ZIP 等主动内容或可执行文件；
- 服务端检查扩展名、声明 MIME 和文件 magic bytes，不能只相信浏览器；
- 先通过 Edge Function 签发带 UUID 路径的上传 URL，再由浏览器直传；
- 审核通过后把最终采用的图片复制到仓库 `public/media/{slug}/`，拒绝或过期投稿定期删除。

Supabase 签名上传 URL 默认有效 2 小时。免费版单文件上限 50 MB，但这里应主动设得更低。不要长期把公开文章图片直接托管在 Supabase：免费版只有 5 GB egress，图片流量会让投稿后台和公开站点形成不必要的运行时耦合。

Edge Functions 当前 CPU 时间上限为每请求 2 秒，且不支持依赖多线程的 `sharp`。图片压缩、转码不应放在 Edge Function 中；可在 GitHub Action/Vercel 构建阶段处理，或第一版只校验并保存合规原图。

## 三种发布方式比较

| 方式 | 优点 | 代价 | 判断 |
| --- | --- | --- | --- |
| 运行时直接读取 Supabase | 审核后立即可见 | 需要 SSR 或 Astro live collection；每次请求依赖数据库；live collection 没有运行时图片优化，且有性能代价 | 不推荐 |
| 构建时从 Supabase 拉取 | 仍可静态输出 | Supabase 变成内容真源；需 Deploy Hook；内容版本和本地 Markdown 分离 | 可行，但不适合当前迁移阶段 |
| 审核后写回 GitHub PR | 保留 Markdown、Git、Vercel Preview 和现有 schema | 需要 GitHub token/App 与发布函数 | **推荐** |

Astro 官方也建议：相对静态、需要构建优化的内容优先使用 build-time collection；live collection 更适合必须实时更新的内容，并会带来每请求抓取、无数据持久层和无运行时图片优化等限制。产品收录显然不需要秒级更新。

## 免费额度与真实风险

截至调研日，Supabase Free 的主要额度为：

| 项目 | 免费额度/限制 | 对本项目的意义 |
| --- | --- | --- |
| 项目数 | 2 个活跃项目 | 可分本地/生产，但没有多余余量 |
| 数据库 | 每项目 500 MB | 投稿文本足够 |
| Storage | 1 GB | 必须限制图片并清理拒稿附件 |
| Egress | 5 GB/月 | 不适合长期承载公开文章图片 |
| Auth | 50,000 MAU | 单管理员和投稿者场景远低于额度 |
| Edge Functions | 500,000 次/月 | 正常投稿量足够；恶意流量仍会消耗次数 |
| 文件上传 | 单文件最高 50 MB | 应自行限制到 2–5 MB |
| 日志 | 1 天保留 | 关键审核事件必须自己落库 |
| 自动备份 | 无 | 需要导出或依靠 Git 中已发布内容；待审核数据仍有风险 |
| 自动暂停 | 低活动约 7 天可能暂停 | 免费版最大生产风险 |

官方说明，“每天少量真实数据库请求通常足以避免暂停”但不保证。不要使用定时假请求规避暂停；若低频投稿也必须 24/7 可用，应升级付费计划。付费计划不会因低活动自动暂停，Pro 还提供 7 天自动备份。

Auth 内置邮件服务当前只有每项目每小时 2 封邮件的默认额度，适合单管理员低频登录，不适合作为投稿通知或大量 Magic Link 的可靠邮件通道；需要时配置自有 SMTP。

## 安全检查清单

- 所有暴露 schema 的表都开启 RLS，并先撤销 `anon`/`authenticated` 默认权限，再按需授予。
- 匿名用户不能读取投稿、联系方式、审核意见和附件列表。
- Storage 默认私有；只有管理员能查看，公开投稿只能使用短时签名上传。
- 发布函数验证 JWT、管理员角色、投稿状态和幂等键。
- GitHub 凭证仅限目标仓库，权限最小化；MVP 可用细粒度 PAT，稳定后换 GitHub App。
- Markdown 生成器转义 YAML、禁止任意文件路径、固定输出目录，避免 frontmatter 注入和路径穿越。
- 外部 URL 只允许 `https`，服务端若抓取网址/图片需防 SSRF，禁止内网和非 HTTP(S) 地址。
- 管理后台渲染开发者提供的文本时使用纯文本，不直接注入 HTML。
- 拒稿和未完成投稿设置附件保留期；提供隐私说明和删除联系方式。
- 为 RLS 编写允许/拒绝测试；Supabase 官方明确建议对 `anon`、`authenticated` 的读写操作分别验证。

## 建议实施范围

### MVP

1. Supabase 项目、迁移、RLS 和私有 Storage。
2. `/submit` 表单 + Turnstile + `submit-product` Function。
3. 单管理员登录与投稿列表/详情。
4. 审核状态和人工编辑。
5. `publish-submission` 生成 GitHub PR；暂不自动合并。
6. PR 合并后人工或 Webhook 回填发布地址。

### 暂缓

- 开发者账号体系和“我的投稿”；
- 实时通知、多人角色、复杂工作流；
- 自动抓官网生成文案；
- 直接发布到 `main`；
- 将现有 700+ 篇文章迁移到 Supabase；
- Edge Function 内图片转码。

## 工作量判断

这是一个中等规模功能，不是简单接一张表：MVP 至少涉及数据库迁移、RLS、两个 Edge Functions、公开表单、管理员认证、后台列表/详情、Storage、GitHub API 和发布状态回写。真正容易出问题的不是页面，而是匿名上传防滥用、权限隔离与“审核按钮不能越权发布”。

若只想先验证是否有人投稿，Tally/Google Sheets 更轻；若目标已确定为长期自有后台，以上 Supabase + Git PR 架构值得实施。

## 官方资料

- [Supabase Pricing](https://supabase.com/pricing)
- [Supabase Free project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)
- [Supabase billing and quotas](https://supabase.com/docs/guides/platform/billing-on-supabase)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Securing your data and API keys](https://supabase.com/docs/guides/database/secure-data)
- [API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Custom claims and RBAC](https://supabase.com/docs/guides/api/custom-claims-and-role-based-access-control-rbac)
- [Securing Edge Functions](https://supabase.com/docs/guides/functions/auth)
- [Edge Function limits](https://supabase.com/docs/guides/functions/limits)
- [Edge Function invocation quota](https://supabase.com/docs/guides/platform/manage-your-usage/edge-function-invocations)
- [Cloudflare Turnstile with Edge Functions](https://supabase.com/docs/guides/functions/examples/cloudflare-turnstile)
- [Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits)
- [Storage access control](https://supabase.com/docs/guides/storage/security/access-control)
- [Storage upload limits](https://supabase.com/docs/guides/storage/uploads/file-limits)
- [Signed upload URLs](https://supabase.com/docs/reference/javascript/file-buckets-createsigneduploadurl)
- [Astro content collections](https://v6.docs.astro.build/en/guides/content-collections/)
- [GitHub repository contents API](https://docs.github.com/en/rest/repos/contents)
- [GitHub pull requests API](https://docs.github.com/en/rest/pulls/pulls)
- [GitHub personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [Vercel deployments](https://vercel.com/docs/deployments)
- [Vercel Deploy Hooks](https://vercel.com/docs/deploy-hooks)
