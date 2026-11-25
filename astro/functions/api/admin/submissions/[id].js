import { errorResponse, isValidAdminToken, json, parseAdminPatch, readJson } from "../../../../lib/submissions.js";

export async function onRequestPatch({ request, env, params }) {
  if (!await isValidAdminToken(request, env)) return json(401, { error: "管理员令牌无效。" });
  try {
    const changes = parseAdminPatch(await readJson(request));
    const assignments = Object.keys(changes).map((key) => `${key} = ?`);
    const { meta } = await env.SUBMISSIONS_DB.prepare(
      `UPDATE indie_submissions SET ${assignments.join(", ")}, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?`
    ).bind(...Object.values(changes), params.id).run();
    return meta.changes ? json(200, { ok: true }) : json(404, { error: "找不到这条投稿。" });
  } catch (error) {
    return errorResponse(error);
  }
}
