/**
 * Fix invalid sitemap XML caused by unescaped characters inside <loc>.
 * Example: <loc>https://.../App-Cleaner-&-Uninstaller</loc> must escape '&' as '&amp;'.
 *
 * This script is intentionally idempotent: it won't double-escape existing entities.
 */

const fs = require('fs')
const path = require('path')

function escapeXmlText(str) {
  if (!str) return ''
  return String(str)
    .replace(/&(?!amp;|lt;|gt;|quot;|#39;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function fixLocEscaping(xml) {
  return xml.replace(/<loc>([^<]*)<\/loc>/g, (m, loc) => {
    return `<loc>${escapeXmlText(loc)}</loc>`
  })
}

function tryFixFile(filePath) {
  if (!fs.existsSync(filePath)) return false
  const before = fs.readFileSync(filePath, 'utf-8')
  const after = fixLocEscaping(before)
  if (after !== before) {
    fs.writeFileSync(filePath, after, 'utf-8')
    return true
  }
  return false
}

function main() {
  const root = process.cwd()
  const candidates = new Set([
    path.join(root, 'sitemap.xml'),
    path.join(root, 'public', 'sitemap.xml')
  ])

  const publicDir = path.join(root, 'public')
  if (fs.existsSync(publicDir) && fs.statSync(publicDir).isDirectory()) {
    for (const name of fs.readdirSync(publicDir)) {
      if (/^sitemap.*\.xml$/i.test(name)) {
        candidates.add(path.join(publicDir, name))
      }
    }
  }

  let changed = 0
  for (const p of candidates) {
    if (tryFixFile(p)) changed++
  }

  if (changed > 0) {
    console.log(`[fix-sitemap-xml] updated ${changed} file(s)`)
  } else {
    console.log('[fix-sitemap-xml] no changes')
  }
}

main()

