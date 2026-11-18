const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const SITE_HOST = "www.macapphq.com";
const SITE_ROOT = `https://${SITE_HOST}`;

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

function readSecret(request) {
  const auth = request.headers.get("authorization") || "";
  const bearer = auth.match(/^Bearer\s+(.+)$/i)?.[1];
  return request.headers.get("x-indexnow-secret") || bearer || "";
}

function normalizeInput(body) {
  if (!body || typeof body !== "object") return [];
  if (typeof body.url === "string") return [body.url];
  if (Array.isArray(body.urls)) {
    return body.urls.filter((item) => typeof item === "string");
  }
  return [];
}

function validateUrls(urls) {
  const valid = [];
  const invalid = [];

  for (const raw of urls) {
    try {
      const parsed = new URL(raw);
      if (parsed.host !== SITE_HOST) {
        invalid.push(raw);
        continue;
      }
      valid.push(parsed.toString());
    } catch {
      invalid.push(raw);
    }
  }

  return { valid: [...new Set(valid)], invalid };
}

export async function onRequest({ request, env }) {
  if (request.method === "GET") {
    return json(200, {
      ok: true,
      route: "/api/indexnow",
      accepts: "POST",
      body: { urls: [`${SITE_ROOT}/article/example`] },
      auth: {
        header: "x-indexnow-secret or Authorization: Bearer <secret>"
      }
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405,
      headers: {
        "content-type": "application/json; charset=utf-8",
        allow: "GET, POST"
      }
    });
  }

  const key = env.INDEXNOW_KEY;
  const webhookSecret = env.INDEXNOW_WEBHOOK_SECRET;

  if (!key) return json(500, { ok: false, error: "Missing INDEXNOW_KEY" });
  if (!webhookSecret) {
    return json(500, { ok: false, error: "Missing INDEXNOW_WEBHOOK_SECRET" });
  }

  if (readSecret(request) !== webhookSecret) {
    return json(401, { ok: false, error: "Unauthorized" });
  }

  let body = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const inputUrls = normalizeInput(body);
  if (inputUrls.length === 0) {
    return json(400, {
      ok: false,
      error: "No URLs provided",
      expected: { urls: [`${SITE_ROOT}/article/example`] }
    });
  }

  const { valid, invalid } = validateUrls(inputUrls);
  if (valid.length === 0) {
    return json(400, { ok: false, error: "No valid URLs for this host", invalid });
  }

  const payload = {
    host: SITE_HOST,
    key,
    keyLocation: `${SITE_ROOT}/${key}.txt`,
    urlList: valid
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const text = await response.text();

    return json(response.ok ? 200 : response.status, {
      ok: response.ok,
      submitted: valid,
      invalid,
      indexNowStatus: response.status,
      indexNowBody: text || null
    });
  } catch (error) {
    return json(502, {
      ok: false,
      error: "Failed to reach IndexNow",
      detail: error instanceof Error ? error.message : String(error)
    });
  }
}
