import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { isDeepStrictEqual } from "node:util";
import { onRequestPost } from "../functions/api/submissions.js";
import { onRequestGet as config } from "../functions/api/submission-config.js";
import { onRequestGet as list } from "../functions/api/admin/submissions/index.js";
import { onRequestGet as detail, onRequestPatch as update, onRequestPost as retryMail } from "../functions/api/admin/submissions/[id].js";

const product = {
  name: "Example", website: "https://example.com", email: "dev@example.com",
  summary: "查找 Mac 窗口", description: "用于跨屏查找窗口。", category: "效率工具",
  pricing: "免费", systemRequirements: "macOS 14+", consent: true,
  reviewAccessNotes: "有试用版", turnstileToken: "test-token"
};
const token = "a".repeat(64);

test("submission stays private and can be edited and approved only with the admin token", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  db.exec(readFileSync(new URL("../migrations/0001_indie_submissions.sql", import.meta.url), "utf8"));
  db.exec(readFileSync(new URL("../migrations/0002_submission_review_mail.sql", import.meta.url), "utf8"));
  db.exec(readFileSync(new URL("../migrations/0003_submission_review_details.sql", import.meta.url), "utf8"));
  const env = {
    ADMIN_REVIEW_TOKEN: token, TURNSTILE_SECRET_KEY: "secret", TURNSTILE_SITE_KEY: "public",
    SUBMISSIONS_DB: {
      prepare(sql) {
        const query = db.prepare(sql);
        return { bind: (...args) => ({
          run: async () => ({ meta: query.run(...args) }),
          first: async () => query.get(...args),
          all: async () => ({ results: query.all(...args) })
        }) };
      }
    }
  };
  const emails = [];
  let mailFails = true;
  let legacyPayload;
  t.mock.method(globalThis, "fetch", async (url, { headers, body }) => {
    if (url === "https://api.resend.com/emails") {
      const payload = JSON.parse(body);
      emails.push({ payload, key: headers["Idempotency-Key"] });
      if (legacyPayload && !isDeepStrictEqual(payload, legacyPayload)) {
        return Response.json({ name: "invalid_idempotent_request" }, { status: 409 });
      }
      return mailFails ? Response.json({}, { status: 503 }) : Response.json({ id: "provider-id" });
    }
    return Response.json({
      success: body.get("response") === "test-token", hostname: "www.macapphq.com", action: "indie_submit"
    });
  });
  function request(path, method, data, adminToken) {
    return new Request("https://www.macapphq.com" + path, {
      method, headers: {
        ...(data ? { "content-type": "application/json" } : {}),
        ...(adminToken ? { "x-admin-token": adminToken } : {})
      }, body: data ? JSON.stringify(data) : undefined
    });
  }
  const submit = (data) => onRequestPost({ request: request("/api/submissions", "POST", data), env });
  const read = (key, params = {}) => list({
    request: request(`/api/admin/submissions?${new URLSearchParams(params)}`, "GET", null, key), env
  });
  const patch = (key, data, id) => update({
    request: request("/api/admin/submissions/" + id, "PATCH", data, key), env, params: { id }
  });
  const fetchDetail = (key, id) => detail({
    request: request("/api/admin/submissions/" + id, "GET", null, key), env, params: { id }
  });
  const retry = (key, id) => retryMail({
    request: request("/api/admin/submissions/" + id, "POST", null, key), env, params: { id }
  });

  assert.deepEqual(await config({ env }).json(), { siteKey: "public" });
  assert.equal((await submit({ ...product, website: "http://example.com" })).status, 400);
  assert.equal((await submit({ ...product, website: "not-a-website" })).status, 400);
  assert.equal((await submit({ ...product, category: "，, " })).status, 400);
  assert.equal((await submit({ ...product, downloadUrl: "not-a-url" })).status, 400);
  assert.equal((await submit({ ...product, mediaUrl: "http://example.com" })).status, 400);
  assert.equal((await submit({ ...product, description: "字".repeat(3000) })).status, 400);
  assert.equal((await submit({ ...product, turnstileToken: "bad" })).status, 400);
  assert.equal((await read()).status, 401);
  assert.deepEqual((await (await read(token)).json()).items, []);

  const response = await submit({ ...product, website: " www.macapphq.com ", category: "效率工具, 窗口管理，", downloadUrl: "", mediaUrl: " \u3000 " });
  assert.equal(response.status, 201);
  const receipt = await response.json();
  assert.deepEqual(Object.keys(receipt).sort(), ["id", "message", "ok"]);
  const { id } = receipt;
  assert.equal((await submit(product)).status, 409);
  const { items } = await (await read(token)).json();
  assert.equal(items.length, 1);
  assert.equal(items[0].status, "pending");
  assert.equal(items[0].email, "dev@example.com");
  assert.equal(items[0].category, "效率工具，窗口管理");
  assert.equal(items[0].downloadUrl, "");
  assert.equal(items[0].website, "https://www.macapphq.com");
  assert.equal(items[0].mediaUrl, "");
  assert.equal((await fetchDetail(undefined, id)).status, 401);
  assert.equal((await fetchDetail(token, "missing")).status, 404);
  const { item } = await (await fetchDetail(token, id)).json();
  assert.equal(item.id, id);
  assert.equal(item.email, "dev@example.com");
  assert.equal(Object.hasOwn(item, "challenge_digest"), false);
  assert.equal((await patch("wrong", { status: "approved" }, id)).status, 401);
  assert.equal((await patch(token, { status: "published" }, id)).status, 400);
  assert.equal((await patch(token, { status: "approved", pendingOnly: true }, id)).status, 400);
  assert.equal((await patch(token, { status: "approved", articleUrl: "http://example.com/post" }, id)).status, 400);
  assert.equal((await patch(token, { status: "rejected", rejectionReason: "  " }, id)).status, 400);
  assert.equal((await patch(token, { status: "rejected", rejectionReason: "字".repeat(2001) }, id)).status, 400);
  assert.equal((await (await fetchDetail(token, id)).json()).item.status, "pending");
  const articleUrl = "https://www.macapphq.com/article/example";
  const rejectionReason = "目前只有 iOS 版本。\n如推出 Mac 版本，欢迎补充。";
  const approval = await patch(token, { name: " Revised ", reviewNotes: "内部备注", status: "approved", articleUrl, pendingOnly: true }, id);
  assert.equal(approval.status, 200);
  assert.equal((await approval.json()).notification, "unconfigured");
  assert.equal((await patch(token, { status: "rejected", rejectionReason, pendingOnly: true }, id)).status, 409);
  assert.equal((await patch(token, { status: "approved", articleUrl: "https://example.com/replacement" }, id)).status, 409);
  const revised = (await (await read(token)).json()).items[0];
  assert.equal(revised.name, "Revised");
  assert.equal(revised.status, "approved");
  assert.equal(emails.length, 0);

  env.RESEND_API_KEY = "test-key";
  env.REVIEW_EMAIL_FROM = "MacAppHQ <review@example.com>";
  assert.equal((await retry("wrong", id)).status, 401);
  assert.equal((await (await retry(token, id)).json()).notification, "failed");
  assert.equal((await (await fetchDetail(token, id)).json()).item.status, "approved");
  assert.equal((await (await fetchDetail(token, id)).json()).notification, "pending");
  assert.deepEqual(emails[0].payload.to, ["dev@example.com"]);
  assert.equal(emails[0].payload.reply_to, "alkaid.waong@foxmail.com");
  assert.equal(emails[0].payload.subject, "你的 MacAppHQ 投稿「Revised」已通过");
  assert.ok(emails[0].payload.text.includes(articleUrl));
  assert.match(emails[0].payload.text, /欢迎把文章链接/);
  assert.equal((await (await fetchDetail(token, id)).json()).reviewMessage, articleUrl);
  assert.ok(emails[0].payload.text.includes(id));
  assert.doesNotMatch(emails[0].payload.text, /内部备注|有试用版/);
  mailFails = false;
  assert.equal((await (await retry(token, id)).json()).notification, "sent");
  assert.deepEqual(emails[0], emails[1]);
  assert.equal((await (await retry(token, id)).json()).notification, "sent");
  assert.equal(emails.length, 2);
  assert.equal((await (await patch(token, { status: "rejected", rejectionReason }, id)).json()).notification, "sent");
  assert.equal(emails.length, 3);
  assert.notEqual(emails[2].key, emails[1].key);
  assert.match(emails[2].payload.text, /未通过/);
  assert.equal(emails[2].payload.subject, "你的 MacAppHQ 投稿「Revised」未通过");
  assert.match(emails[2].payload.text, /补充资料.*回执编号/s);
  assert.ok(emails[2].payload.text.includes(rejectionReason));
  assert.ok(!emails[2].payload.text.includes(articleUrl));
  assert.doesNotMatch(emails[2].payload.text, /内部备注|有试用版|准备发布/);
  assert.equal((await (await fetchDetail(token, id)).json()).reviewMessage, rejectionReason);
  assert.equal((await patch(token, { reviewNotes: "追加备注" }, id)).status, 200);
  assert.equal(emails.length, 3);

  // An already attempted email from before the copy update uses the original Resend payload.
  delete env.RESEND_API_KEY;
  assert.equal((await (await patch(token, { status: "approved", articleUrl }, id)).json()).notification, "unconfigured");
  db.prepare("UPDATE submission_review_mail SET attempted_at = unixepoch(), decision_detail = '' WHERE submission_id = ?").run(id);
  env.RESEND_API_KEY = "test-key";
  legacyPayload = {
    from: env.REVIEW_EMAIL_FROM,
    to: ["dev@example.com"],
    subject: "MacAppHQ 投稿审核结果：已通过",
    text: `产品名称：Revised\n回执编号：${id}\n审核结果：已通过\n\n感谢你向 MacAppHQ 投稿。`
  };
  assert.equal((await (await retry(token, id)).json()).notification, "sent");
  assert.equal(emails.length, 5);
  assert.equal(emails[3].key, emails[4].key);
  assert.deepEqual(emails[4].payload, legacyPayload);

  db.prepare("UPDATE indie_submissions SET created_at = ? WHERE id = ?").run("2025-01-02T03:00:00.000Z", id);
  db.prepare(`
    WITH RECURSIVE sequence(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM sequence WHERE n < 51)
    INSERT INTO indie_submissions (id, challenge_digest, name, website, downloadUrl, summary, description,
      category, pricing, systemRequirements, mediaUrl, email, reviewAccessNotes, created_at)
    SELECT 'queue-' || n, 'challenge-' || n, '其他产品 ' || n, website, downloadUrl, summary, description,
      category, pricing, systemRequirements, mediaUrl, email, reviewAccessNotes, '2025-01-03T00:00:00.000Z'
    FROM indie_submissions CROSS JOIN sequence WHERE id = ?
  `).run(id);
  const queue = await (await read(token, { status: "pending" })).json();
  assert.equal(queue.items.length, 50);
  assert.equal(queue.hasMore, true);
  assert.equal((await (await read(token, { status: "pending", page: 2 })).json()).items.length, 1);
  const filtered = await (await read(token, {
    receipt: id.slice(0, 8).toUpperCase(), product: " visED ", status: "approved", date: "2025-01-02"
  })).json();
  assert.deepEqual(filtered.items.map((entry) => entry.id), [id]);
  assert.equal(filtered.hasMore, false);
  assert.deepEqual((await (await read(token, { product: "%" })).json()).items, []);
  assert.deepEqual((await (await read(token, { receipt: id, date: "2025-01-03" })).json()).items, []);
  assert.equal((await read(token, { date: "2025-02-30" })).status, 400);
});
