#!/usr/bin/env node
/**
 * SEO 日报生成器 — 查询 GSC API，输出到 data/seo-report.json
 * 用法: node scripts/generate-seo-report.js
 */
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const KEY_PATH = path.resolve(__dirname, '..', '/Users/wangdong/Downloads/Generative Language Client.json');
const OUTPUT = path.resolve(__dirname, '..', 'astro/src/data/seo-report.json');
const SITE = 'sc-domain:macapphq.com';

function getToken() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  return new Promise((ok, fail) => {
    const now = Math.floor(Date.now() / 1000);
    const hdr = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const pld = Buffer.from(JSON.stringify({
      iss: key.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: key.token_uri, exp: now + 3600, iat: now
    })).toString('base64url');
    const s = crypto.createSign('RSA-SHA256');
    s.update(hdr + '.' + pld);
    const jwt = hdr + '.' + pld + '.' + s.sign(key.private_key, 'base64url');
    const u = new URL(key.token_uri);
    const body = JSON.stringify({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt });
    const r = https.request({ hostname: u.hostname, path: u.pathname, method: 'POST', headers: { 'Content-Type': 'application/json' } }, resp => { let d = ''; resp.on('data', c => d += c); resp.on('end', () => ok(JSON.parse(d).access_token)); });
    r.on('error', fail); r.write(body); r.end();
  });
}

function gscPost(path, data, token) {
  return new Promise((ok, fail) => {
    const body = JSON.stringify(data);
    const r = https.request({
      hostname: 'www.googleapis.com', path: '/webmasters/v3/sites/' + encodeURIComponent(SITE) + path,
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
    }, resp => { let d = ''; resp.on('data', c => d += c); resp.on('end', () => ok(JSON.parse(d))); });
    r.on('error', fail); r.write(body); r.end();
  });
}

async function main() {
  const token = await getToken();
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  // 1. Top 20 queries
  const q = await gscPost('/searchAnalytics/query', {
    startDate: thirtyDaysAgo, endDate: today,
    dimensions: ['query'], rowLimit: 20
  }, token);

  // 2. Top 10 pages
  const p = await gscPost('/searchAnalytics/query', {
    startDate: thirtyDaysAgo, endDate: today,
    dimensions: ['page'], rowLimit: 10
  }, token);

  // 3. Daily timeline (7 days)
  const d = await gscPost('/searchAnalytics/query', {
    startDate: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10), endDate: today,
    dimensions: ['date'], rowLimit: 7
  }, token);

  const queries = (q.rows || []).map(r => ({
    keyword: r.keys[0], impressions: r.impressions, clicks: r.clicks,
    ctr: (r.ctr * 100).toFixed(1), position: Math.round(r.position)
  }));
  const pages = (p.rows || []).map(r => ({
    page: r.keys[0].replace('sc-domain:macapphq.com', ''), impressions: r.impressions, clicks: r.clicks
  }));
  const timeline = (d.rows || []).map(r => ({
    date: r.keys[0], impressions: r.impressions, clicks: r.clicks
  }));

  const total = queries.reduce((a, r) => ({ i: a.i + r.impressions, c: a.c + r.clicks }), { i: 0, c: 0 });
  const top10 = queries.filter(r => r.position <= 10).length;

  const report = {
    generatedAt: today,
    period: { start: thirtyDaysAgo, end: today },
    headline: { top10, top3: queries.filter(r => r.position <= 3).length, totalKeywords: queries.length },
    totals: { impressions: total.i, clicks: total.c, ctr: total.i > 0 ? (total.c / total.i * 100).toFixed(1) : '0' },
    queries, pages, timeline
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(report, null, 2));
  console.log(`✅ SEO 日报已生成: ${OUTPUT}`);
  console.log(`🏆 首页关键词: ${top10}`);
  console.log(`📊 ${total.c}点击 / ${total.i}曝光 (${thirtyDaysAgo} ~ ${today})`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
