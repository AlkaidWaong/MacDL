/**
 * Build `data/sitemap_index.json` from an exported CSV (Notion export metadata).
 *
 * This is meant to be run locally once. In Vercel/CI we only READ the json,
 * so production no longer depends on Notion API availability.
 *
 * Usage:
 *   node scripts/build-sitemap-index-from-csv.js --csv "/abs/path/export.csv" --out data/sitemap_index.json
 */

const fs = require('fs')
const path = require('path')

function parseArgs(argv) {
  const args = { csv: '', out: 'data/sitemap_index.json', host: 'https://www.macapphq.com' }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--csv') args.csv = argv[++i] || ''
    else if (a === '--out') args.out = argv[++i] || args.out
    else if (a === '--host') args.host = argv[++i] || args.host
  }
  if (!args.csv) {
    console.error('Missing --csv')
    process.exit(2)
  }
  return args
}

function readText(p) {
  return fs.readFileSync(p, 'utf-8')
}

function splitCsvLine(line) {
  // Minimal CSV parser (handles commas inside quotes).
  const out = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"'
        i++
      } else {
        inQ = !inQ
      }
      continue
    }
    if (!inQ && ch === ',') {
      out.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }
  out.push(cur)
  return out.map(s => s.trim())
}

function normalizeSlug(raw) {
  if (!raw) return null
  raw = String(raw).trim()
  if (!raw || raw === '#') return null
  if (raw.startsWith('/')) raw = raw.slice(1)
  if (raw.includes('://')) {
    try {
      const u = new URL(raw)
      const segs = u.pathname.split('/').filter(Boolean)
      if (segs.length === 0) return null
      raw = segs[segs.length - 1]
    } catch {
      return null
    }
  }
  if (!raw) return null
  if (raw.includes('/') || raw.includes('\\')) return null
  return raw
}

function parseDate(s) {
  s = (s || '').trim()
  if (!s) return null
  // Accept YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD
  const m = s.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/)
  if (!m) return null
  const yyyy = m[1]
  const mm = String(m[2]).padStart(2, '0')
  const dd = String(m[3]).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function splitList(v) {
  if (!v) return []
  return String(v)
    .split(/[,，]/g)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.replace(/^#/, '').trim())
    .filter(Boolean)
}

function unique(arr) {
  const out = []
  const seen = new Set()
  for (const x of arr) {
    if (!x) continue
    if (seen.has(x)) continue
    seen.add(x)
    out.push(x)
  }
  return out
}

function ensureLeadingSlash(p) {
  if (!p) return '/'
  return p.startsWith('/') ? p : `/${p}`
}

function build() {
  const { csv, out, host } = parseArgs(process.argv)
  const absCsv = path.resolve(csv)
  const text = readText(absCsv)
  const lines = text.split(/\r?\n/)
  if (lines.length < 2) throw new Error('CSV empty')

  // Handle UTF-8 BOM.
  if (lines[0] && lines[0].charCodeAt(0) === 0xfeff) {
    lines[0] = lines[0].slice(1)
  }

  const header = splitCsvLine(lines[0]).map(h => h.trim())
  const idx = Object.fromEntries(header.map((h, i) => [h, i]))

  const posts = []
  const pages = []
  const categories = new Set()
  const tags = new Set()

  const now = new Date().toISOString().slice(0, 10)

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line || !line.trim()) continue
    const cols = splitCsvLine(line)
    const get = (k) => (idx[k] != null ? (cols[idx[k]] || '') : '')

    const type = get('type')
    if (type !== 'Post' && type !== 'Page') continue
    const status = get('status')
    if (status && status !== 'Published') continue

    const slug = normalizeSlug(get('slug'))
    if (!slug) continue

    const date = parseDate(get('date')) || now
    const cat = splitList(get('category'))
    const tag = splitList(get('tags'))

    for (const c of cat) categories.add(c === 'AI软件' ? 'AI' : c)
    for (const t of tag) tags.add(t)

    if (type === 'Post') posts.push({ slug, lastmod: date })
    else pages.push({ slug, lastmod: date })
  }

  const urls = []
  const push = (loc, lastmod, changefreq = 'daily', priority = '0.7') => {
    urls.push({
      loc: `${host}${ensureLeadingSlash(loc)}`,
      lastmod: lastmod || now,
      changefreq,
      priority
    })
  }

  push('/', now, 'daily', '0.7')
  push('/archive', now, 'daily', '0.7')
  push('/category', now, 'daily', '0.7')
  push('/rss/feed.xml', now, 'daily', '0.7')
  push('/search', now, 'daily', '0.7')
  push('/tag', now, 'daily', '0.7')
  push('/links', now, 'weekly', '0.6')

  for (const p of unique(posts.map(x => x.slug))) {
    const m = posts.find(x => x.slug === p)?.lastmod || now
    push(`/article/${p}`, m, 'daily', '0.7')
  }
  for (const p of unique(pages.map(x => x.slug))) {
    const m = pages.find(x => x.slug === p)?.lastmod || now
    push(`/${p}`, m, 'monthly', '0.5')
  }
  for (const c of Array.from(categories)) {
    push(`/category/${encodeURIComponent(c)}`, now, 'weekly', '0.7')
  }
  for (const t of Array.from(tags)) {
    push(`/tag/${encodeURIComponent(t)}`, now, 'weekly', '0.6')
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    source: { csv: absCsv },
    host,
    urlCount: urls.length,
    urls
  }

  const outPath = path.resolve(out)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf-8')
  console.log(`[build-sitemap-index-from-csv] wrote ${urls.length} urls to ${outPath}`)
}

build()

