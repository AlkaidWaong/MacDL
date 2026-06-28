#!/usr/bin/env node
/**
 * SEO 日报生成器 — 查询 GSC API，输出到 astro/src/data/seo-report.json
 * 用法: node scripts/generate-seo-report.js
 *
 * 支持的凭证来源（按优先级）：
 * 1. GSC_SERVICE_ACCOUNT_JSON
 * 2. GSC_SERVICE_ACCOUNT_BASE64
 * 3. GSC_SERVICE_ACCOUNT_KEY_PATH
 * 4. 本地默认文件（兼容现有开发环境）
 */
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const DEFAULT_KEY_PATH = '/Users/wangdong/Downloads/Generative Language Client.json';
const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.resolve(ROOT, 'astro/src/data/seo-report.json');
const CONFIG_PATH = path.resolve(ROOT, 'seo-report.config.json');
const SITE = 'sc-domain:macapphq.com';

function readServiceAccount() {
  if (process.env.GSC_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON);
  }

  if (process.env.GSC_SERVICE_ACCOUNT_BASE64) {
    return JSON.parse(Buffer.from(process.env.GSC_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'));
  }

  const keyPath = process.env.GSC_SERVICE_ACCOUNT_KEY_PATH || DEFAULT_KEY_PATH;
  return JSON.parse(fs.readFileSync(keyPath, 'utf8'));
}

function readJsonIfExists(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(baseDate, days) {
  return new Date(baseDate.getTime() - days * 86400000);
}

function round(num, digits = 1) {
  return Number(num.toFixed(digits));
}

function toPercent(clicks, impressions) {
  if (!impressions) return 0;
  return round((clicks / impressions) * 100, 1);
}

function normalizePageUrl(raw) {
  if (!raw) return raw;
  return raw.replace(/^sc-domain:macapphq\.com/, 'https://www.macapphq.com');
}

function getToken() {
  const key = readServiceAccount();
  return new Promise((ok, fail) => {
    const now = Math.floor(Date.now() / 1000);
    const hdr = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const pld = Buffer.from(JSON.stringify({
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: key.token_uri,
      exp: now + 3600,
      iat: now
    })).toString('base64url');
    const s = crypto.createSign('RSA-SHA256');
    s.update(hdr + '.' + pld);
    const jwt = hdr + '.' + pld + '.' + s.sign(key.private_key, 'base64url');
    const u = new URL(key.token_uri);
    const body = JSON.stringify({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt });
    const r = https.request(
      { hostname: u.hostname, path: u.pathname, method: 'POST', headers: { 'Content-Type': 'application/json' } },
      (resp) => {
        let d = '';
        resp.on('data', (c) => (d += c));
        resp.on('end', () => ok(JSON.parse(d).access_token));
      }
    );
    r.on('error', fail);
    r.write(body);
    r.end();
  });
}

function gscPost(apiPath, data, token) {
  return new Promise((ok, fail) => {
    const body = JSON.stringify(data);
    const r = https.request(
      {
        hostname: 'www.googleapis.com',
        path: '/webmasters/v3/sites/' + encodeURIComponent(SITE) + apiPath,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
      },
      (resp) => {
        let d = '';
        resp.on('data', (c) => (d += c));
        resp.on('end', () => ok(JSON.parse(d)));
      }
    );
    r.on('error', fail);
    r.write(body);
    r.end();
  });
}

function buildKeywordDiff(currentQueries, previousQueries) {
  const previousMap = new Map((previousQueries || []).map((item) => [item.keyword, item]));

  return currentQueries.map((item) => {
    const previous = previousMap.get(item.keyword);
    const previousPosition = previous?.position ?? null;
    const previousImpressions = previous?.impressions ?? 0;
    const previousCtr = previous?.ctr ?? null;
    const deltaPosition = previousPosition == null ? null : round(previousPosition - item.position, 0);
    const deltaImpressions = round(item.impressions - previousImpressions, 0);
    const deltaCtr = previousCtr == null ? null : round(item.ctr - previousCtr, 1);

    return {
      ...item,
      previousPosition,
      previousImpressions,
      previousCtr,
      deltaPosition,
      deltaImpressions,
      deltaCtr,
      isTop10: item.position <= 10,
      wasTop10: previousPosition != null ? previousPosition <= 10 : false
    };
  });
}

function buildPageDiff(currentPages, previousPages) {
  const previousMap = new Map((previousPages || []).map((item) => [item.page, item]));

  return currentPages.map((item) => {
    const previous = previousMap.get(item.page);
    const previousImpressions = previous?.impressions ?? 0;
    const previousClicks = previous?.clicks ?? 0;

    return {
      ...item,
      previousImpressions,
      previousClicks,
      deltaImpressions: round(item.impressions - previousImpressions, 0),
      deltaClicks: round(item.clicks - previousClicks, 0)
    };
  });
}

function makeAction(type, title, detail, items = []) {
  return { type, title, detail, items };
}

function buildActions(queries, pages, previousHeadline) {
  const actions = [];
  const lowCtr = queries.filter((q) => q.impressions >= 50 && q.ctr < 3);
  const nearTop10 = queries.filter((q) => q.position >= 11 && q.position <= 20);
  const newTop10 = queries.filter((q) => q.isTop10 && !q.wasTop10);
  const droppedTop10 = queries.filter((q) => !q.isTop10 && q.wasTop10);
  const impressionGainers = [...queries]
    .filter((q) => q.deltaImpressions > 0)
    .sort((a, b) => b.deltaImpressions - a.deltaImpressions)
    .slice(0, 3);
  const weakPages = [...pages]
    .filter((p) => p.impressions >= 80 && p.clicks <= 5)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 3);

  if (newTop10.length > 0) {
    actions.push(
      makeAction(
        'win',
        `放大新增首页词：${newTop10.slice(0, 3).map((q) => q.keyword).join('、')}`,
        '这些词刚进 Top 10，优先给对应页面补内链、FAQ 和场景段，先稳住首页位置。',
        newTop10.slice(0, 3)
      )
    );
  }

  if (droppedTop10.length > 0) {
    actions.push(
      makeAction(
        'risk',
        `回补跌出首页词：${droppedTop10.slice(0, 3).map((q) => q.keyword).join('、')}`,
        '这些词从 Top 10 掉出，优先检查标题匹配度、段首答案和最近是否被其他页面抢词。',
        droppedTop10.slice(0, 3)
      )
    );
  }

  if (lowCtr.length > 0) {
    actions.push(
      makeAction(
        'ctr',
        `先改 CTR：${lowCtr.slice(0, 3).map((q) => q.keyword).join('、')}`,
        '这些词已经拿到曝光，但点击吃亏。先重写标题和 description，不要先急着扩内容。',
        lowCtr.slice(0, 5)
      )
    );
  }

  if (nearTop10.length > 0) {
    actions.push(
      makeAction(
        'rank',
        `冲首页：${nearTop10.slice(0, 3).map((q) => q.keyword).join('、')}`,
        '这些词卡在 11-20 名，最适合用补内链、补对比段和更新截图去冲首页。',
        nearTop10.slice(0, 5)
      )
    );
  }

  if (impressionGainers.length > 0) {
    actions.push(
      makeAction(
        'momentum',
        `承接上涨词：${impressionGainers.map((q) => q.keyword).join('、')}`,
        '这些词的曝光在涨，优先检查落地页 CTA、相关文章推荐和站内跳转，别只拿曝光不拿点击。',
        impressionGainers
      )
    );
  }

  if (weakPages.length > 0) {
    actions.push(
      makeAction(
        'page',
        `补强高曝光弱页面：${weakPages.map((p) => p.page.split('/').pop()).join('、')}`,
        '页面本身拿到了曝光，但点击偏弱。优先补“先给结论”段落和更具体的小标题。',
        weakPages
      )
    );
  }

  if (actions.length === 0) {
    const deltaTop10 = (previousHeadline?.top10 ?? 0) - 0;
    actions.push(
      makeAction(
        'baseline',
        '今天先做维护动作',
        deltaTop10 > 0
          ? '首页词在涨，但还没有明显的异常项。今天优先补内链和更新旧文章的开头摘要。'
          : '今天没有明显的新机会点，优先做旧文更新、截图替换和 FAQ 补充。'
      )
    );
  }

  return actions.slice(0, 4);
}

function buildOwnerTodos(config) {
  const checklist = config?.ownerChecklist || {};
  return Object.entries(checklist)
    .filter(([, item]) => !item.done)
    .map(([key, item]) => ({
      key,
      title: item.title,
      detail: item.detail,
      done: false
    }));
}

function buildSummary(current, previous) {
  const prevTop10 = previous?.headline?.top10 ?? null;
  const prevTop3 = previous?.headline?.top3 ?? null;
  const prevImpressions = previous?.totals?.impressions ?? null;
  const prevClicks = previous?.totals?.clicks ?? null;
  const prevCtr = previous?.totals?.ctr ?? null;

  return {
    top10: current.top10,
    top3: current.top3,
    totalKeywords: current.totalKeywords,
    deltaTop10: prevTop10 == null ? null : current.top10 - prevTop10,
    deltaTop3: prevTop3 == null ? null : current.top3 - prevTop3,
    previousTop10: prevTop10,
    previousTop3: prevTop3,
    deltaImpressions: prevImpressions == null ? null : current.impressions - prevImpressions,
    deltaClicks: prevClicks == null ? null : current.clicks - prevClicks,
    deltaCtr: prevCtr == null ? null : round(current.ctr - prevCtr, 1)
  };
}

async function main() {
  const previousReport = readJsonIfExists(OUTPUT, null);
  const config = readJsonIfExists(CONFIG_PATH, { ownerChecklist: {} });

  const now = new Date();
  const endDate = daysAgo(now, 1);
  const startDate = daysAgo(endDate, 29);
  const timelineStartDate = daysAgo(endDate, 6);

  const token = await getToken();

  const q = await gscPost(
    '/searchAnalytics/query',
    {
      startDate: isoDate(startDate),
      endDate: isoDate(endDate),
      dimensions: ['query'],
      rowLimit: 50
    },
    token
  );

  const p = await gscPost(
    '/searchAnalytics/query',
    {
      startDate: isoDate(startDate),
      endDate: isoDate(endDate),
      dimensions: ['page'],
      rowLimit: 20
    },
    token
  );

  const d = await gscPost(
    '/searchAnalytics/query',
    {
      startDate: isoDate(timelineStartDate),
      endDate: isoDate(endDate),
      dimensions: ['date'],
      rowLimit: 7
    },
    token
  );

  const queriesBase = (q.rows || []).map((row) => ({
    keyword: row.keys[0],
    impressions: round(row.impressions, 0),
    clicks: round(row.clicks, 0),
    ctr: round(row.ctr * 100, 1),
    position: round(row.position, 0)
  }));

  const pagesBase = (p.rows || []).map((row) => ({
    page: normalizePageUrl(row.keys[0]),
    impressions: round(row.impressions, 0),
    clicks: round(row.clicks, 0),
    ctr: toPercent(row.clicks, row.impressions)
  }));

  const timeline = (d.rows || []).map((row) => ({
    date: row.keys[0],
    impressions: round(row.impressions, 0),
    clicks: round(row.clicks, 0),
    ctr: toPercent(row.clicks, row.impressions)
  }));

  const queries = buildKeywordDiff(queriesBase, previousReport?.queries || []);
  const pages = buildPageDiff(pagesBase, previousReport?.pages || []);

  const total = queries.reduce((acc, item) => {
    acc.impressions += item.impressions;
    acc.clicks += item.clicks;
    return acc;
  }, { impressions: 0, clicks: 0 });

  const currentHeadline = {
    top10: queries.filter((item) => item.position <= 10).length,
    top3: queries.filter((item) => item.position <= 3).length,
    totalKeywords: queries.length,
    impressions: total.impressions,
    clicks: total.clicks,
    ctr: toPercent(total.clicks, total.impressions)
  };

  const report = {
    generatedAt: new Date().toISOString(),
    generatedDate: isoDate(now),
    period: { start: isoDate(startDate), end: isoDate(endDate) },
    freshness: {
      sourceLagDays: 1,
      status: 'ok'
    },
    headline: buildSummary(currentHeadline, previousReport),
    totals: {
      impressions: total.impressions,
      clicks: total.clicks,
      ctr: currentHeadline.ctr,
      previousImpressions: previousReport?.totals?.impressions ?? null,
      previousClicks: previousReport?.totals?.clicks ?? null,
      previousCtr: previousReport?.totals?.ctr ?? null
    },
    queries,
    pages,
    timeline,
    actions: buildActions(queries, pages, previousReport?.headline),
    ownerTodos: buildOwnerTodos(config),
    metadata: {
      site: SITE,
      configPath: path.basename(CONFIG_PATH)
    }
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(report, null, 2) + '\n');

  console.log(`✅ SEO 日报已生成: ${OUTPUT}`);
  console.log(`🏆 首页关键词: ${report.headline.top10}`);
  console.log(`📊 ${total.clicks} 点击 / ${total.impressions} 曝光 (${report.period.start} ~ ${report.period.end})`);
  console.log(`🔧 今日动作: ${report.actions.length} 条`);
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
