import { errorResponse, isValidAdminToken, json, parseAdminPatch, readJson } from "../../../../lib/submissions.js";
import { findReviewMail, reviewMailState, sendReviewMail } from "../../../../lib/submission-review-mail.js";

export async function onRequestGet({ request, env, params }) {
  if (!await isValidAdminToken(request, env)) return json(401, { error: "管理员令牌无效。" });
  try {
    const item = await env.SUBMISSIONS_DB.prepare(
      "SELECT id, name, website, downloadUrl, summary, description, category, pricing, systemRequirements, mediaUrl, email, reviewAccessNotes, reviewNotes, status, created_at, updated_at FROM indie_submissions WHERE id = ?"
    ).bind(params.id).first();
    if (!item) return json(404, { error: "找不到这条投稿。" });
    const mail = await findReviewMail(env, item.id);
    return json(200, { item, reviewMessage: mail?.decision_detail ?? "", notification: reviewMailState(env, mail) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function onRequestPatch({ request, env, params }) {
  if (!await isValidAdminToken(request, env)) return json(401, { error: "管理员令牌无效。" });
  try {
    const input = await readJson(request);
    const changes = parseAdminPatch(input);
    const pendingOnly = input.pendingOnly === true;
    const decision = ["approved", "rejected"].includes(changes.status);
    if (pendingOnly && !decision) {
      return json(400, { error: "请选择通过或拒绝。" });
    }
    const assignments = Object.keys(changes).map((key) => `${key} = ?`);
    const condition = pendingOnly ? " AND status = 'pending'" : decision ? " AND status <> ?" : "";
    const parameters = decision && !pendingOnly ? [...Object.values(changes), params.id, changes.status]
      : [...Object.values(changes), params.id];
    const { meta } = await env.SUBMISSIONS_DB.prepare(
      `UPDATE indie_submissions SET ${assignments.join(", ")}, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?${condition}`
    ).bind(...parameters).run();
    if (!meta.changes && decision) return json(409, { error: "这条投稿已处理或不存在，请刷新后查看。" });
    if (!meta.changes) return json(404, { error: "找不到这条投稿。" });
    let notification = "none";
    if (decision) {
      // The review and its notification record have already been saved by D1.
      notification = await sendReviewMail(env, params.id, changes.status).catch(() => "failed");
    }
    return json(200, { ok: true, notification });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function onRequestPost({ request, env, params }) {
  if (!await isValidAdminToken(request, env)) return json(401, { error: "管理员令牌无效。" });
  const notification = await sendReviewMail(env, params.id, undefined, { retry: true }).catch(() => "failed");
  return json(200, { notification });
}
