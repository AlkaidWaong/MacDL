const RETRY_WINDOW_SECONDS = 23 * 60 * 60;

export function reviewMailState(env, notification) {
  if (!notification) return "none";
  if (notification.resend_id) return "sent";
  if (notification.attempted_at != null &&
      Math.floor(Date.now() / 1000) - notification.attempted_at >= RETRY_WINDOW_SECONDS) return "expired";
  if (!env.RESEND_API_KEY || !env.REVIEW_EMAIL_FROM) return "unconfigured";
  return "pending";
}

export function findReviewMail(env, id) {
  return env.SUBMISSIONS_DB.prepare(
    "SELECT * FROM submission_review_mail WHERE submission_id = ?"
  ).bind(id).first();
}

export async function sendReviewMail(env, id, status, { retry = false } = {}) {
  const notification = await findReviewMail(env, id);
  if (status && notification?.status !== status) return "none";
  const state = reviewMailState(env, notification);
  if (state !== "pending" || (!retry && notification.attempted_at != null)) return state;

  // The same snapshot and event key are used for every attempt at this decision.
  const { meta } = await env.SUBMISSIONS_DB.prepare(
    `UPDATE submission_review_mail
     SET attempted_at = COALESCE(attempted_at, unixepoch())
     WHERE event_id = ? AND resend_id IS NULL ${retry ? "" : "AND attempted_at IS NULL"}`
  ).bind(notification.event_id).run();
  if (!meta.changes) return reviewMailState(env, await findReviewMail(env, id));

  const result = notification.status === "approved" ? "已通过" : "未通过";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `submission-review/${notification.event_id}`
    },
    body: JSON.stringify({
      from: env.REVIEW_EMAIL_FROM,
      to: [notification.recipient],
      subject: `MacAppHQ 投稿审核结果：${result}`,
      text: `产品名称：${notification.product_name}\n回执编号：${notification.submission_id}\n审核结果：${result}\n\n感谢你向 MacAppHQ 投稿。`
    }),
    signal: AbortSignal.timeout(6000)
  });
  if (!response.ok) return "failed";
  const { id: resendId } = await response.json();
  if (typeof resendId !== "string" || !resendId) return "failed";
  await env.SUBMISSIONS_DB.prepare(
    "UPDATE submission_review_mail SET resend_id = ? WHERE event_id = ?"
  ).bind(resendId, notification.event_id).run();
  return "sent";
}
