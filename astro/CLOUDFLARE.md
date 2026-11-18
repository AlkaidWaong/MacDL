# 迁移到 Cloudflare Pages

目标：静态站点从 Vercel 迁到 Cloudflare Pages 免费版，Vercel 保留一周做对照。

## 一、仓库里的改动（已完成）

| 文件 | 作用 |
| --- | --- |
| `public/_redirects` | 承接原 `vercel.json` 的 10 条重定向 |
| `public/_headers` | `_astro`、`media` 的缓存策略，HTML 不缓存 |
| `functions/api/indexnow.js` | IndexNow 推送接口，从 Vercel 函数改写为 Pages Function |
| `functions/_middleware.js` | 处理 `.html` 旧地址跳转；让 `/article/xxx` 直接返回 `index.html` |

注意：仓库根目录是 `MacDL`，Astro 项目在 `astro/` 子目录。Cloudflare Pages 只从**仓库根目录**读取 `functions/`，所以这两个文件放在根目录，不要放进 `astro/`。

构建后 `_redirects` 与 `_headers` 会被复制到 `dist/`，Cloudflare 会自动读取。

## 二、环境变量

在 Cloudflare Pages 项目的 Settings → Environment variables 里添加：

- `INDEXNOW_KEY`：IndexNow 的 key（与 `public/<key>.txt` 文件名一致）
- `INDEXNOW_WEBHOOK_SECRET`：调用 `/api/indexnow` 的共享密钥

`NODE_VERSION` 建议设为 `22`。

## 三、创建项目

1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
2. 选择仓库，然后填写：
   - Framework preset：`None`（不要选 Astro，否则会把根目录当项目）
   - Root directory：`/`（仓库根目录 `MacDL`，不要填 `astro`）
   - Build command：`cd astro && npm ci && npm run build`
   - Build output directory：`astro/dist`
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
