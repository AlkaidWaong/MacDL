#!/usr/bin/env node
/**
 * GSC Agent — SEO 日报数据查询脚本
 * 用法: node scripts/gsc-agent.js <command>
 * commands: daily | top-queries | top-pages | sitemap-status
 */
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const KEY_PATH = '/Users/wangdong/Downloads/Generative Language Client.json';
const SITE = 'sc-domain:macapphq.com';

function getToken() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
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
    const r = https.request({ hostname: u.hostname, path: u.pathname, method: 'POST', headers: { 'Content-Type': 'application/json' } }, resp => { let d = ''; resp.on('data', c => d += c); resp.on('end', () => ok(JSON.parse(d).access_token)); });
    r.on('error', fail);
    r.write(body);
    r.end();
  });
}

function gscPost(path, data, token) {
  return new Promise((ok, fail) => {
    const body = JSON.stringify(data);
    const r = https.request({ hostname: 'www.googleapis.com', path: '/webmasters/v3/sites/' + encodeURIComponent(SITE) + path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token } }, resp => { let d = ''; resp.on('data', c => d += c); resp.on('end', () => ok(JSON.parse(d))); });
    r.on('error', fail);
    r.write(body);
    r.end();
  });
}

const CMD = process.argv[2] || 'daily';

(async () => {
  const token = await getToken();
  
  if (CMD === 'top-queries' || CMD === 'daily') {
    const data = await gscPost('/searchAnalytics/query', {
      startDate: new Date(Date.now() - 30*86400000).toISOString().slice(0,10),
      endDate: new Date().toISOString().slice(0,10),
      dimensions: ['query'], rowLimit: 20
    }, token);
    if (data.rows) {
      const total = data.rows.reduce((a, r) => ({ i: a.i + r.impressions, c: a.c + r.clicks }), { i: 0, c: 0 });
      const top10 = data.rows.filter(r => r.position <= 10).length;
      const top3 = data.rows.filter(r => r.position <= 3).length;
      console.log(`🏆 首页关键词数 (Top 10): ${top10}\nTop 3: ${top3}  |  Top 30: ${data.rows.length}`);
      console.log(`📊 总曝光: ${total.i}  |  总点击: ${total.c}  |  CTR: ${(total.c/total.i*100).toFixed(1)}%`);
      console.log(`\n📋 关键词明细:`);
      console.log(`排名\t关键词\t\t\t曝光\t点击\tCTR`);
      data.rows.forEach(r => console.log(`#${Math.round(r.position)}\t${(r.keys[0]+'       ').slice(0,16)}\t${r.impressions}\t${r.clicks}\t${(r.ctr*100).toFixed(1)}%`));
    }
  }
  
  if (CMD === 'sitemap-status') {
    const r = https.request({ hostname: 'www.googleapis.com', path: '/webmasters/v3/sites/' + encodeURIComponent(SITE) + '/sitemaps', method: 'GET', headers: { 'Authorization': 'Bearer ' + token } }, resp => { let d = ''; resp.on('data', c => d += c); resp.on('end', () => { const sm = JSON.parse(d); (sm.sitemap || []).forEach(s => console.log(`${s.path}\t提交:${s.lastSubmitted||'-'}\t下载:${s.lastDownloaded||'-'}\t错误:${s.errors}`)); }); });
    r.end();
  }
})();
