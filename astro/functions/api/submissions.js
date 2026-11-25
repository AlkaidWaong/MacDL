import { errorResponse, InputError, json, parseSubmission, readJson } from "../../lib/submissions.js";

export async function onRequestPost({ request, env }) {
  if (!env.TURNSTILE_SECRET_KEY || !env.SUBMISSIONS_DB) return errorResponse();
  try {
    const input = await readJson(request);
    const submission = parseSubmission(input);
    const token = input.turnstileToken;
    if (typeof token !== "string" || !token || token.length > 2048) {
      throw new InputError("请先完成人机验证。");
    }
    const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
    const ip = request.headers.get("CF-Connecting-IP");
    if (ip) body.set("remoteip", ip);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", body, signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return errorResponse();
    const result = await response.json();
    if (result.success !== true || result.action !== "indie_submit" ||
        result.hostname !== new URL(request.url).hostname) {
      throw new InputError("人机验证未通过，请重试。");
    }
    const id = crypto.randomUUID();
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
    const row = { id, challenge_digest: digest, ...submission };
    const columns = Object.keys(row);
    const { meta } = await env.SUBMISSIONS_DB.prepare(
      `INSERT INTO indie_submissions (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")}) ON CONFLICT(challenge_digest) DO NOTHING`
    ).bind(...Object.values(row)).run();
    if (!meta.changes) return json(409, { error: "此验证已用于提交，请勿重复投稿。" });
    return json(201, { ok: true, id, message: "已收到投稿，等待人工审核。" });
  } catch (error) {
    return errorResponse(error);
  }
}
