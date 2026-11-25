import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { onRequestPost } from "../functions/api/submissions.js";
import { onRequestGet as config } from "../functions/api/submission-config.js";
import { onRequestGet as list } from "../functions/api/admin/submissions/index.js";
import { onRequestPatch as update } from "../functions/api/admin/submissions/[id].js";

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
  const env = {
    ADMIN_REVIEW_TOKEN: token, TURNSTILE_SECRET_KEY: "secret", TURNSTILE_SITE_KEY: "public",
    SUBMISSIONS_DB: {
      prepare(sql) {
        const query = db.prepare(sql);
        return { bind: (...args) => ({
          run: async () => ({ meta: query.run(...args) }),
          all: async () => ({ results: query.all(...args) })
        }) };
      }
    }
  };
  t.mock.method(globalThis, "fetch", async (_url, { body }) => Response.json({
    success: body.get("response") === "test-token", hostname: "www.macapphq.com", action: "indie_submit"
  }));
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

  assert.deepEqual(await config({ env }).json(), { siteKey: "public" });
  assert.equal((await submit({ ...product, website: "http://example.com" })).status, 400);
  assert.equal((await submit({ ...product, description: "字".repeat(3000) })).status, 400);
  assert.equal((await submit({ ...product, turnstileToken: "bad" })).status, 400);
  assert.equal((await read()).status, 401);
  assert.deepEqual((await (await read(token)).json()).items, []);

  const response = await submit(product);
  assert.equal(response.status, 201);
  const receipt = await response.json();
  assert.deepEqual(Object.keys(receipt).sort(), ["id", "message", "ok"]);
  const { id } = receipt;
  assert.equal((await submit(product)).status, 409);
  const { items } = await (await read(token)).json();
  assert.equal(items.length, 1);
  assert.equal(items[0].status, "pending");
  assert.equal(items[0].email, "dev@example.com");
  assert.equal((await patch("wrong", { status: "approved" }, id)).status, 401);
  assert.equal((await patch(token, { status: "published" }, id)).status, 400);
  assert.equal((await patch(token, { name: " Revised ", status: "approved" }, id)).status, 200);
  const revised = (await (await read(token)).json()).items[0];
  assert.equal(revised.name, "Revised");
  assert.equal(revised.status, "approved");
});
