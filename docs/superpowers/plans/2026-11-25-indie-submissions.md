# 独立产品提交与审核后台 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 开发者可提交 Mac 产品，站长可在私有后台查看、修订并改变投稿状态；不创建公开发布墙。

**Architecture:** 站点继续以 Astro 静态页面部署在 Cloudflare Pages。公开表单提交到 Pages Function，服务端验证 Turnstile 后写入 D1；审核页调用另一组受管理员令牌保护的 Pages Functions。开发者的邮箱、授权信息与审核备注只存在 D1 的私有字段中，绝不由公开接口返回。

**Tech Stack:** Astro 6、Cloudflare Pages Functions、Cloudflare D1、Cloudflare Turnstile、原生浏览器 Fetch。

**Spec:** 本对话 2026-11-25 已确认范围：仅“开发者提交”与“我的审核后台”；不做开发者账号、公开发布墙或文件上传。

## Global Constraints

- 保留 `/submit` 作为唯一公开投稿入口，替换旧邮件 / 微信收录流程。
- 产品必须是 Mac 软件；公开表单不接收兑换码、许可证或附件。
- 表单必须经服务端 Turnstile 校验后才可写入 D1。
- 管理接口必须校验 `x-admin-token` 与 Cloudflare 环境变量 `ADMIN_REVIEW_TOKEN`；Cloudflare Access 只作额外保护。
- 管理令牌仅保存在浏览器 `sessionStorage`，不写入 Git、页面源码或 localStorage。
- 不运行完整构建；只运行新增或受影响的定向 Node 测试，除非用户另行批准构建。

## Review Focus

- 未携带、伪造或复用的 Turnstile token 必须不能创建投稿。
- 非 Mac 产品、无有效 HTTPS 官网或缺失必填字段必须被服务端拒绝，不能只依赖浏览器校验。
- 管理员令牌缺失或错误时，列表与状态更新必须返回 401，且不泄露投稿数据。
- 公开提交响应与公开配置接口不得包含联系人邮箱、授权说明、审核备注或管理员令牌。
- 审核时编辑字段必须经过同一套服务端规范化和长度限制，不能借由管理接口写入任意状态或脚本内容。

---

### Task 1: 投稿数据模型与可测验证工具

**Files:**
- Create: `astro/functions/lib/submissions.js`
- Create: `astro/migrations/0001_indie_submissions.sql`
- Create: `astro/tests/submissions.test.mjs`

**Interfaces:**
- Produces: `parseSubmission(input)`, `parseAdminPatch(input)`, `isValidAdminToken(request, env)` and `serializeSubmissionForAdmin(row)`.
- Consumes: `Request`, `FormData`, Cloudflare D1 row objects.

- [ ] **Step 1: Write failing validation and authorization tests**

Cover one valid Mac product, a missing name, a non-HTTPS website, a non-Mac platform, an overlong description, a valid administrator request, and an invalid administrator request.

- [ ] **Step 2: Run the focused test file to verify it fails for missing exports**

Run: `cd astro && node --test tests/submissions.test.mjs`

Expected: FAIL because `functions/lib/submissions.js` does not exist.

- [ ] **Step 3: Implement the validation helpers and D1 schema**

Use an allow-listed status transition target (`pending`, `approved`, `rejected`) and normalize whitespace. The schema stores private fields separately from public product fields and creates an index on `(status, created_at)`.

- [ ] **Step 4: Run the focused test file to verify validation and authorization pass**

Run: `cd astro && node --test tests/submissions.test.mjs`

Expected: PASS.

### Task 2: Cloudflare Pages submission and review APIs

**Files:**
- Create: `astro/functions/api/submission-config.js`
- Create: `astro/functions/api/submissions.js`
- Create: `astro/functions/api/admin/submissions.js`
- Create: `astro/functions/api/admin/submissions/[id].js`
- Modify: `astro/tests/submissions.test.mjs`

**Interfaces:**
- Consumes: Task 1 helpers plus `env.SUBMISSIONS_DB`, `env.TURNSTILE_SITE_KEY`, `env.TURNSTILE_SECRET_KEY`, and `env.ADMIN_REVIEW_TOKEN`.
- Produces: `GET /api/submission-config`, `POST /api/submissions`, `GET /api/admin/submissions`, and `PATCH /api/admin/submissions/:id`.

- [ ] **Step 1: Extend the failing tests for response-shape boundaries**

Assert that the public configuration response contains only the site key, the public submit success response contains only a submission id and success message, and private columns are present only in the authenticated admin serializer.

- [ ] **Step 2: Run the focused test file to verify the new assertions fail**

Run: `cd astro && node --test tests/submissions.test.mjs`

Expected: FAIL because public and admin serializers do not yet exist.

- [ ] **Step 3: Implement the Functions**

`POST /api/submissions` parses JSON, calls Cloudflare Siteverify with the client token and request IP, validates with `parseSubmission`, and inserts a `pending` row. Admin handlers reject invalid tokens before any D1 query; list results paginate to 50 newest records; patch permits only product-field edits, review notes, and the three allowed statuses.

- [ ] **Step 4: Run the focused test file to verify the response-shape tests pass**

Run: `cd astro && node --test tests/submissions.test.mjs`

Expected: PASS.

### Task 3: 公开投稿页

**Files:**
- Create: `astro/src/pages/submit.astro`
- Delete: `astro/src/content/pages/submit.md`
- Modify: `astro/src/styles/global.css`

**Interfaces:**
- Consumes: `GET /api/submission-config` and `POST /api/submissions` from Task 2.
- Produces: A form with product metadata, private contact email, optional private review access notes, consent check box, client-side status feedback, and Turnstile widget.

- [ ] **Step 1: Add a focused page-source test that initially fails**

Assert that the submit page renders required labelled fields, loads Turnstile dynamically, and sends JSON to `/api/submissions`; assert that it does not offer a file input or ask for a license code in the public form.

- [ ] **Step 2: Run the focused test file to verify it fails**

Run: `cd astro && node --test tests/submission-pages.test.mjs`

Expected: FAIL because `src/pages/submit.astro` does not exist.

- [ ] **Step 3: Implement the public page and styles**

Keep copy factual: submission does not guarantee inclusion or positive coverage. Treat `contactEmail` and `reviewAccessNotes` as private. Replace the markdown route to prevent duplicate `/submit` generation.

- [ ] **Step 4: Run the focused page test to verify it passes**

Run: `cd astro && node --test tests/submission-pages.test.mjs`

Expected: PASS.

### Task 4: 私有审核后台

**Files:**
- Create: `astro/src/pages/admin/submissions.astro`
- Modify: `astro/src/styles/global.css`
- Modify: `astro/tests/submission-pages.test.mjs`

**Interfaces:**
- Consumes: Admin API endpoints from Task 2 and an `x-admin-token` entered by the administrator.
- Produces: `/admin/submissions`, which lists `pending` first and lets the administrator edit fields, add private notes, and set approved or rejected status.

- [ ] **Step 1: Extend the failing page-source test for admin boundaries**

Assert the page sends the token in `x-admin-token`, persists it only in `sessionStorage`, and never renders the token in markup or stores it in localStorage.

- [ ] **Step 2: Run the focused page test to verify it fails**

Run: `cd astro && node --test tests/submission-pages.test.mjs`

Expected: FAIL because the admin page does not exist.

- [ ] **Step 3: Implement the admin page and minimal styles**

Use a token prompt before the first request. Render a compact list with a detail editor; show private contact and review-access information only in this route. Include a clear setup warning when the API returns 401.

- [ ] **Step 4: Run both focused test files**

Run: `cd astro && node --test tests/submissions.test.mjs tests/submission-pages.test.mjs`

Expected: PASS.

### Task 5: Deployment configuration and operator handoff

**Files:**
- Modify: `astro/CLOUDFLARE.md`
- Modify: `astro/src/content/pages/privacy-policy.md`

**Interfaces:**
- Consumes: Function environment variables and D1 schema from Tasks 1–2.
- Produces: exact Cloudflare setup steps and an accurate privacy disclosure for submission fields.

- [ ] **Step 1: Update Cloudflare setup documentation**

Document D1 database creation, schema execution, `SUBMISSIONS_DB` binding, four required environment variables, and optional Cloudflare Access coverage for `/admin/*` and `/api/admin/*`. Do not place actual secret values in the document.

- [ ] **Step 2: Update the privacy policy**

State that product submission contact details and review-access notes are used only for evaluation and are not public; specify the email contact for deletion requests.

- [ ] **Step 3: Run the two focused test files and inspect the final diff**

Run: `cd astro && node --test tests/submissions.test.mjs tests/submission-pages.test.mjs && git diff --check`

Expected: PASS and no whitespace errors. Do not run `npm run build` without separate approval.
