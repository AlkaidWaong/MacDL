import { json } from "../../lib/submissions.js";

export function onRequestGet({ env }) {
  if (!env.TURNSTILE_SITE_KEY || !env.TURNSTILE_SECRET_KEY || !env.SUBMISSIONS_DB) {
    return json(503, { error: "在线投稿暂不可用。" });
  }
  return json(200, { siteKey: env.TURNSTILE_SITE_KEY });
}
