# 迁移到 Cloudflare Pages

## 独立产品投稿配置

1. 在 Cloudflare 创建独立的 D1 数据库，在数据库控制台执行 `migrations/0001_indie_submissions.sql`，并在 Pages 项目的生产环境中将它绑定为 `SUBMISSIONS_DB`。预览环境使用独立数据库。
2. 创建 Turnstile Managed 小组件，允许生产投稿域名。在 Pages 环境变量中设置 `TURNSTILE_SITE_KEY`，并将 `TURNSTILE_SECRET_KEY` 保存为密钥。
3. 用 `openssl rand -hex 32` 生成管理员令牌，在 Pages 保存为密钥 `ADMIN_REVIEW_TOKEN`。在 `/admin/submissions` 输入该令牌。后台 API 会独立校验令牌。也可用 Cloudflare Access 为 `/admin/*` 和 `/api/admin/*` 增加访问限制。
4. 重新部署，在 `/submit` 提交一条测试记录，再进入后台核对并保存审核状态。检查匿名访问审核 API 返回 401。

### 审核结果邮件（Resend）

1. 上线前在已有投稿 D1 数据库执行 `migrations/0002_submission_review_mail.sql`。保留完整的 `CREATE TRIGGER ... END;` 语句。
2. 在 Resend 添加并验证发件域名（如 `notify.macapphq.com`），按界面提示在 Cloudflare DNS 添加记录。创建一个仅允许发信的 API Key。
3. 在 Pages 的 **Production → Variables and Secrets** 中，将 API Key 存为 Secret `RESEND_API_KEY`，将发件地址存为 Text `REVIEW_EMAIL_FROM`（如 `MacAppHQ <review@notify.macapphq.com>`），然后部署。
4. 用自己的邮箱提交一条测试投稿并审核，核对后台与 Resend 的发信记录。审核结果先写入 D1，发信失败可在详情页重试。首次尝试 23 小时后，应先到 Resend 核对再手动处理，避免超出发信服务的去重时限。配置前已存在、且从未生成通知的审核结果无需补发。

目标：静态站点从 Vercel 迁到 Cloudflare Pages 免费版，Vercel 保留一周做对照。

## 一、仓库里的改动（已完成）

| 文件 | 作用 |
| --- | --- |
| `public/_redirects` | 承接原 `vercel.json` 的 10 条重定向 |
| `public/_headers` | `_astro`、`media` 的缓存策略，HTML 不缓存 |
| `functions/api/indexnow.js` | IndexNow 推送接口，从 Vercel 函数改写为 Pages Function |
| `functions/_middleware.js` | 处理 `.html` 旧地址跳转；让 `/article/xxx` 直接返回 `index.html` |

注意：Cloudflare 的 Root directory 会设为 `astro`，所以 `functions/` 必须放在 `astro/functions/`，与 `public/`、`dist/` 同级。仓库根目录下的旧 Next.js 工程不参与构建。

构建后 `_redirects` 与 `_headers` 会被复制到 `dist/`，Cloudflare 会自动读取。

## 二、环境变量

在 Cloudflare Pages 项目的 Settings → Environment variables 里添加：

- `INDEXNOW_KEY`：IndexNow 的 key（与 `public/<key>.txt` 文件名一致）
- `INDEXNOW_WEBHOOK_SECRET`：调用 `/api/indexnow` 的共享密钥

`NODE_VERSION` 建议设为 `22`。

## 三、创建项目

1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
2. 选择仓库，然后填写：
   - Framework preset：`Astro`
   - Root directory：`astro`
   - Build command：`npm ci && npm run build`
   - Build output directory：`dist`
   - Build variable：`SKIP_DEPENDENCY_INSTALL=1`

> 为什么要跳过自动安装：仓库根目录还留着旧 Next.js 工程的 `yarn.lock`，Cloudflare
> 的构建镜像会先检测到 Yarn 4，再和 `astro/package.json` 的 `packageManager: npm`
> 冲突，直接失败。设置 `SKIP_DEPENDENCY_INSTALL=1` 后由构建命令自己执行 `npm ci`。
3. 首次部署完成后，先在 `*.pages.dev` 域名上验证，不要立刻切主域名。

## 四、上线前验证清单

在 pages.dev 预览域名上逐项检查：

- [ ] 首页、文章页、分类页、标签页正常打开
- [ ] 文章 URL 无 308 跳转（`/article/xxx` 直接 200，不带结尾斜杠）
- [ ] canonical 与实际 URL 一致
- [ ] `/en`、`/zh`、`/zh/article/xxx`、`/feed`、`/oops` 正确 301
- [ ] `/category/系统安全`、`/tag/ORC` 正确 301
- [ ] 旧地址 `/article/xxx.html` 301 到 `/article/xxx`
- [ ] 404 页面返回 404 状态码，不是 200
- [ ] `sitemap-index.xml`、`rss/feed.xml`、`llms.txt`、`robots.txt` 可访问
- [ ] `_headers` 生效（检查 `_astro` 资源的 `cache-control`）
- [ ] `POST /api/indexnow` 用错误密钥返回 401，用正确密钥返回 200
- [ ] 移动端与桌面端图片正常加载

## 五、切换域名

1. 把 `macapphq.com` 的 DNS 托管到 Cloudflare
2. Pages 项目 → Custom domains → 添加 `www.macapphq.com` 与根域
3. 开启 Always Use HTTPS，确认 SSL 证书已签发
4. 保留 Vercel 项目与域名解析一周，随时可回滚

## 六、回滚方式

改 DNS 记录指向 Vercel 即可，Vercel 侧配置与部署不需要改动。

## 七、后续可做

- `dist` 约 351 MB，其中几张 13 MB 的 PNG 建议转 WebP，能显著缩短部署时间
- 站点稳定后可考虑 Workers 付费版（$5/月）获得更高请求额度
- 中国大陆访问优化需要独立方案（备案 + 国内 CDN），与本次迁移无关
