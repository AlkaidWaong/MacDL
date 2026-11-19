import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const root = process.cwd();
const srcDir = path.join(root, "src");
const publicDir = path.join(root, "public");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const srcFiles = walk(srcDir).filter((f) => /\.(md|astro|ts|mjs|json)$/.test(f));
const texts = new Map(srcFiles.map((f) => [f, fs.readFileSync(f, "utf8")]));

const refs = new Set();
for (const text of texts.values()) {
  for (const match of text.matchAll(/\/media\/[^\s)"'`]+/g)) {
    refs.add(match[0].split("?")[0]);
  }
}

const heroRefs = new Set();
for (const file of walk(path.join(srcDir, "content", "posts")).filter((f) => f.endsWith(".md"))) {
  const raw = fs.readFileSync(file, "utf8");
  for (const key of ["heroImage", "cover", "socialImage"]) {
    const m = raw.match(new RegExp(`^${key}:\\s*"([^"]+)"`, "m"));
    if (m) heroRefs.add(m[1].split("?")[0]);
  }
}

const socialRefs = new Set();
for (const text of texts.values()) {
  for (const m of text.matchAll(/image="(\/media\/[^"]+)"/g)) socialRefs.add(m[1]);
}

function decodeSource(abs, ext) {
  if (ext === ".heic" || /heic$/i.test(abs)) {
    const tmp = "/tmp/optsrc.png";
    execFileSync("sips", ["-s", "format", "png", abs, "--out", tmp], { stdio: "ignore" });
    return tmp;
  }
  return abs;
}

const renameMap = new Map();
let before = 0;
let after = 0;
let converted = 0;
let heroes = 0;
const failed = [];

for (const ref of refs) {
  const abs = path.join(publicDir, ref.replace(/^\//, ""));
  if (!fs.existsSync(abs)) continue;
  const stat = fs.statSync(abs);
  if (!stat.isFile()) continue;
  const ext = path.extname(abs).toLowerCase();
  if ([".svg", ".gif", ".webp", ".mp4", ".pdf"].includes(ext)) continue;
  if (stat.size < 80 * 1024) continue;
  if (socialRefs.has(ref) || /\/og\./.test(ref)) continue;

  const isHero = heroRefs.has(ref);
  before += stat.size;

  try {
    const source = decodeSource(abs, ext);

    if (isHero) {
      const img = sharp(source).rotate().resize({ width: 1600, withoutEnlargement: true });
      const buf = ext === ".png"
        ? await img.png({ palette: true, quality: 82, compressionLevel: 9 }).toBuffer()
        : await img.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
      if (buf.length < stat.size * 0.98) fs.writeFileSync(abs, buf);
      after += Math.min(buf.length, stat.size);
      heroes += 1;
      continue;
    }

    const buf = await sharp(source)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toBuffer();

    if (buf.length >= stat.size * 0.95) {
      after += stat.size;
      continue;
    }

    const base = abs.replace(/\.[^.]+$/, "");
    const newAbs = base + ".webp";
    const newRef = ref.replace(/\.[^.]+$/, "") + ".webp";
    fs.writeFileSync(newAbs, buf);
    if (newAbs !== abs) fs.unlinkSync(abs);
    renameMap.set(ref, newRef);
    after += buf.length;
    converted += 1;
  } catch (error) {
    failed.push({ ref, error: String(error).slice(0, 120) });
    after += stat.size;
  }
}

for (const [file, text] of texts) {
  let next = text;
  for (const [oldRef, newRef] of renameMap) {
    if (oldRef === newRef) continue;
    next = next.split(oldRef).join(newRef);
  }
  if (next !== text) fs.writeFileSync(file, next);
}

console.log(JSON.stringify({
  refs: refs.size,
  heroes,
  converted,
  failed: failed.length,
  beforeMB: +(before / 1024 / 1024).toFixed(1),
  afterMB: +(after / 1024 / 1024).toFixed(1),
  savedMB: +((before - after) / 1024 / 1024).toFixed(1),
  renames: renameMap.size
}, null, 2));
if (failed.length) console.log(failed.slice(0, 5));
