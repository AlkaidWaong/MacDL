import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
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
  t.mock.method(globalThis, "fetch", async (url, { headers, body }) => {
    if (url === "https://api.resend.com/emails") {
      emails.push({ payload: JSON.parse(body), key: headers["Idempotency-Key"] });
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
  const read = (key) => list({ request: request("/api/admin/submissions", "GET", null, key), env });
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
  assert.equal((await submit({ ...product, category: "，, " })).status, 400);
  assert.equal((await submit({ ...product, downloadUrl: "not-a-url" })).status, 400);
  assert.equal((await submit({ ...product, mediaUrl: "http://example.com" })).status, 400);
  assert.equal((await submit({ ...product, description: "字".repeat(3000) })).status, 400);
  assert.equal((await submit({ ...product, turnstileToken: "bad" })).status, 400);
  assert.equal((await read()).status, 401);
  assert.deepEqual((await (await read(token)).json()).items, []);

  const response = await submit({ ...product, category: "效率工具, 窗口管理，", downloadUrl: "", mediaUrl: " \u3000 " });
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
  assert.equal(items[0].mediaUrl, "");
  assert.equal((await fetchDetail(undefined, id)).status, 401);
  assert.equal((await fetchDetail(token, "missing")).status, 404);
  const { item } = await (await fetchDetail(token, id)).json();
  assert.equal(item.id, id);
  assert.equal(item.email, "dev@example.com");
  assert.equal(Object.hasOwn(item, "challenge_digest"), false);
  assert.equal((await patch("wrong", { status: "approved" }, id)).status, 401);
  assert.equal((await patch(token, { status: "published" }, id)).status, 400);
  const approval = await patch(token, { name: " Revised ", reviewNotes: "内部备注", status: "approved", pendingOnly: true }, id);
  assert.equal(approval.status, 200);
  assert.equal((await approval.json()).notification, "unconfigured");
  assert.equal((await patch(token, { status: "rejected", pendingOnly: true }, id)).status, 409);
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
  assert.match(emails[0].payload.text, /Revised/);
  assert.ok(emails[0].payload.text.includes(id));
  assert.doesNotMatch(emails[0].payload.text, /内部备注|有试用版/);
  mailFails = false;
  assert.equal((await (await retry(token, id)).json()).notification, "sent");
  assert.deepEqual(emails[0], emails[1]);
  assert.equal((await (await retry(token, id)).json()).notification, "sent");
  assert.equal(emails.length, 2);
  assert.equal((await (await patch(token, { status: "rejected" }, id)).json()).notification, "sent");
  assert.equal(emails.length, 3);
  assert.notEqual(emails[2].key, emails[1].key);
  assert.match(emails[2].payload.text, /未通过/);
  assert.equal((await patch(token, { status: "rejected", reviewNotes: "追加备注" }, id)).status, 200);
  assert.equal(emails.length, 3);
});
