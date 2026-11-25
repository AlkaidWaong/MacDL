const RETRY_WINDOW_SECONDS = 23 * 60 * 60;
const REVIEW_REPLY_TO = "alkaid.waong@foxmail.com";

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

  const approved = notification.status === "approved";
  const result = approved ? "已通过" : "未通过";
  const productName = notification.product_name.replace(/\s+/g, " ");
  const detail = notification.decision_detail;
  const message = approved
    ? detail
      ? `「${productName}」已通过 MacAppHQ 的投稿审核。你可以在这里查看文章：

${detail}

欢迎把文章链接放到产品官网、更新日志，或分享给开发者社区。发现资料有误，或产品有了新版本，也可以直接回这封邮件告诉我们。`
      : `「${productName}」已通过 MacAppHQ 的投稿审核。接下来我们会整理产品资料，准备发布。

如果官网、下载链接、价格或系统要求有变化，直接回这封邮件告诉我们即可。页面上线后，欢迎把收录链接放到产品官网、更新日志，或分享给开发者社区。`
    : `「${productName}」这次未通过 MacAppHQ 的投稿审核。谢谢你花时间介绍这款产品。${detail ? `\n\n未通过原因\n${detail}` : ""}

如果之后有新版本，或想补充资料，欢迎直接回这封邮件。比如可以发一个可用的下载或试用链接，或者说说这款 App 在 Mac 上能帮用户完成什么。请带上下面的回执编号，方便我们找到这次投稿。`;
  const send = (payload) => fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `submission-review/${notification.event_id}`
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(6000)
  });
  const envelope = { from: env.REVIEW_EMAIL_FROM, to: [notification.recipient] };
  let response = await send({
    ...envelope,
    reply_to: REVIEW_REPLY_TO,
    subject: `你的 MacAppHQ 投稿「${productName}」${result}`,
    text: `你好！\n\n${message}\n\n回执编号 ${notification.submission_id}\n\nMacAppHQ 编辑部\nhttps://www.macapphq.com/`
  });
  if (!detail && retry && notification.attempted_at != null && response.status === 409) {
    const error = await response.json().catch(() => null);
    if (error?.name === "invalid_idempotent_request") {
      // Match the original payload if this message was sent before the template changed.
      response = await send({
        ...envelope,
        subject: `MacAppHQ 投稿审核结果：${result}`,
        text: `产品名称：${notification.product_name}\n回执编号：${notification.submission_id}\n审核结果：${result}\n\n感谢你向 MacAppHQ 投稿。`
      });
    }
  }
  if (!response.ok) return "failed";
  const { id: resendId } = await response.json();
  if (typeof resendId !== "string" || !resendId) return "failed";
  await env.SUBMISSIONS_DB.prepare(
    "UPDATE submission_review_mail SET resend_id = ? WHERE event_id = ?"
  ).bind(resendId, notification.event_id).run();
  return "sent";
}
