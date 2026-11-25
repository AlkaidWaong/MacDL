const productFields = {
  name: [80, true], website: [500, true, "url"], downloadUrl: [500, false, "url"],
  summary: [160, true], description: [2000, true], category: [60, true],
  pricing: [120, true], systemRequirements: [160, true], mediaUrl: [500, false, "url"]
};
const submissionFields = {
  ...productFields, email: [254, true, "email"], reviewAccessNotes: [1000, false]
};

export class InputError extends Error {}

function fields(input, schema, partial = false) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new InputError("请求格式有误。");
  }
  const output = {};
  for (const [key, [length, required, format]] of Object.entries(schema)) {
    if (partial && !Object.hasOwn(input, key)) continue;
    const raw = input[key] ?? "";
    if (typeof raw !== "string") throw new InputError(`字段格式有误：${key}。`);
    let value = raw.trim();
    if (key === "website" && /^[^:/?#@\\\s]+\.[^:/?#@\\\s]+(?::\d+)?(?:[/?#]|$)/u.test(value)) {
      value = `https://${value}`;
    }
    if ((required && !value) || value.length > length) {
      throw new InputError(`请检查字段是否填写或超长：${key}。`);
    }
    if (value && format === "url") {
      const url = URL.parse(value);
      if (!url || url.protocol !== "https:" || url.username || url.password) {
        throw new InputError(`请填写有效的 HTTPS 链接：${key}。`);
      }
    }
    if (format === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new InputError("请填写有效的联系邮箱。");
    }
    output[key] = value;
  }
  return output;
}

export function parseSubmission(input) {
  if (input?.consent !== true) throw new InputError("请确认产品支持 macOS，并授权审核所提交的资料。");
  const submission = fields(input, submissionFields);
  submission.category = submission.category.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean).join("，");
  if (!submission.category) throw new InputError("请填写至少一个标签。");
  return submission;
}

export function parseAdminPatch(input) {
  const changes = fields(input, { ...productFields, reviewNotes: [2000, false] }, true);
  if (Object.hasOwn(input, "status")) {
    if (!["pending", "approved", "rejected"].includes(input.status)) {
      throw new InputError("审核状态无效。");
    }
    changes.status = input.status;
    if (input.status === "approved") {
      const url = typeof input.articleUrl === "string" ? input.articleUrl.trim() : "";
      const parsed = URL.parse(url);
      if (url.length > 2000 || !/^https:\/\/[^/?#\s\\]+(?:[/?#][^\s\\]*)?$/i.test(url) ||
          !parsed || parsed.protocol !== "https:" || parsed.username || parsed.password) {
        throw new InputError("请填写有效的 HTTPS 文章链接。");
      }
      changes.reviewMessage = parsed.href;
    } else if (input.status === "rejected") {
      const reason = typeof input.rejectionReason === "string" ? input.rejectionReason.trim() : "";
      if (!reason || reason.length > 2000) throw new InputError("请填写拒绝原因，最多 2000 字。");
      changes.reviewMessage = reason;
    } else {
      changes.reviewMessage = "";
    }
  }
  if (!Object.keys(changes).length) throw new InputError("没有可保存的字段。");
  return changes;
}

export async function isValidAdminToken(request, env) {
  const expected = env.ADMIN_REVIEW_TOKEN;
  const received = request.headers.get("x-admin-token");
  if (!expected || expected.length < 32 || !received || received.length > 512) return false;
  const encoder = new TextEncoder();
  const [left, right] = await Promise.all(
    [expected, received].map((value) => crypto.subtle.digest("SHA-256", encoder.encode(value)))
  );
  if (typeof crypto.subtle.timingSafeEqual === "function") return crypto.subtle.timingSafeEqual(left, right);
  const bytes = new Uint8Array(right);
  return new Uint8Array(left).reduce((diff, byte, index) => diff | (byte ^ bytes[index]), 0) === 0;
}

export function json(status, body) {
  return Response.json(body, { status, headers: { "cache-control": "no-store", "x-content-type-options": "nosniff" } });
}

export function errorResponse(error) {
  return error instanceof InputError ? json(400, { error: error.message }) :
    json(503, { error: "服务暂不可用，请稍后重试。" });
}

export async function readJson(request) {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json" || !request.body) {
    throw new InputError("请求格式有误。");
  }
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let value = "";
  try {
    while (true) {
      const { done, value: chunk } = await reader.read();
      if (done) break;
      bytes += chunk.byteLength;
      if (bytes > 32768) {
        await reader.cancel();
        throw new InputError("提交内容过长。");
      }
      value += decoder.decode(chunk, { stream: true });
    }
    return JSON.parse(value + decoder.decode());
  } catch (error) {
    if (error instanceof InputError) throw error;
    throw new InputError("请求格式有误。");
  } finally {
    reader.releaseLock();
  }
}
