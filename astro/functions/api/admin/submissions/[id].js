import { errorResponse, isValidAdminToken, json, parseAdminPatch, readJson } from "../../../../lib/submissions.js";

export async function onRequestGet({ request, env, params }) {
  if (!await isValidAdminToken(request, env)) return json(401, { error: "管理员令牌无效。" });
  try {
    const item = await env.SUBMISSIONS_DB.prepare(
      "SELECT id, name, website, downloadUrl, summary, description, category, pricing, systemRequirements, mediaUrl, email, reviewAccessNotes, reviewNotes, status, created_at, updated_at FROM indie_submissions WHERE id = ?"
    ).bind(params.id).first();
    return item ? json(200, { item }) : json(404, { error: "找不到这条投稿。" });
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
    if (pendingOnly && !["approved", "rejected"].includes(changes.status)) {
      return json(400, { error: "请选择通过或拒绝。" });
    }
    const assignments = Object.keys(changes).map((key) => `${key} = ?`);
    const condition = pendingOnly ? " AND status = 'pending'" : "";
    const { meta } = await env.SUBMISSIONS_DB.prepare(
      `UPDATE indie_submissions SET ${assignments.join(", ")}, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?${condition}`
    ).bind(...Object.values(changes), params.id).run();
    if (!meta.changes && pendingOnly) return json(409, { error: "这条投稿已处理或不存在，请刷新后查看。" });
    return meta.changes ? json(200, { ok: true }) : json(404, { error: "找不到这条投稿。" });
  } catch (error) {
    return errorResponse(error);
  }
}
