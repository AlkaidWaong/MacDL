import { errorResponse, isValidAdminToken, json } from "../../../../lib/submissions.js";

export async function onRequestGet({ request, env }) {
  if (!await isValidAdminToken(request, env)) return json(401, { error: "管理员令牌无效。" });
  const params = new URL(request.url).searchParams;
  const page = Number(params.get("page") ?? "1");
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger((page - 1) * 50)) {
    return json(400, { error: "页码无效。" });
  }
  const conditions = [];
  const values = [];
  const receipt = params.get("receipt")?.trim();
  const product = params.get("product")?.trim();
  const status = params.get("status");
  const date = params.get("date");
  if (receipt) {
    conditions.push("instr(lower(id), lower(?)) = 1");
    values.push(receipt);
  }
  if (product) {
    conditions.push("instr(lower(name), lower(?)) > 0");
    values.push(product);
  }
  if (status) {
    if (!["pending", "approved", "rejected"].includes(status)) return json(400, { error: "审核状态无效。" });
    conditions.push("status = ?");
    values.push(status);
  }
  if (date) {
    const day = new Date(date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(day.getTime()) ||
        day.toISOString().slice(0, 10) !== date) {
      return json(400, { error: "投稿日期无效。" });
    }
    conditions.push("substr(created_at, 1, 10) = ?");
    values.push(date);
  }
  const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "";
  try {
    const { results } = await env.SUBMISSIONS_DB.prepare(
      `SELECT * FROM indie_submissions${where} ORDER BY (status = 'pending') DESC, created_at DESC, id DESC LIMIT 51 OFFSET ?`
    ).bind(...values, (page - 1) * 50).all();
    const items = results.slice(0, 50).map(({ challenge_digest, ...item }) => item);
    return json(200, { items, hasMore: results.length > 50 });
  } catch (error) {
    return errorResponse(error);
  }
}
