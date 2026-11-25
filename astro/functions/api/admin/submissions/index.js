import { errorResponse, isValidAdminToken, json } from "../../../../lib/submissions.js";

export async function onRequestGet({ request, env }) {
  if (!await isValidAdminToken(request, env)) return json(401, { error: "管理员令牌无效。" });
  const page = Number(new URL(request.url).searchParams.get("page") ?? "1");
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger((page - 1) * 50)) {
    return json(400, { error: "页码无效。" });
  }
  try {
    const { results } = await env.SUBMISSIONS_DB.prepare(
      "SELECT * FROM indie_submissions ORDER BY (status = 'pending') DESC, created_at DESC, id DESC LIMIT 51 OFFSET ?"
    ).bind((page - 1) * 50).all();
    const items = results.slice(0, 50).map(({ challenge_digest, ...item }) => item);
    return json(200, { items, hasMore: results.length > 50 });
  } catch (error) {
    return errorResponse(error);
  }
}
