import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

const endpoint = "https://api.indexnow.org/indexnow";
const siteHost = "www.macapphq.com";
const key = process.env.INDEXNOW_KEY;
const siteRoot = `https://${siteHost}`;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const cleanArgs = args.filter((arg) => arg !== "--dry-run");

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { urlSlug: null, categories: [] };

  const frontmatter = match[1];
  const urlSlugMatch = frontmatter.match(/^urlSlug:\s*"?(.*?)"?$/m);
  const categoriesMatch = frontmatter.match(/^categories:\s*\n((?:\s+-\s+"?.*?"?\n?)*)/m);

  const categories = categoriesMatch
    ? [...categoriesMatch[1].matchAll(/^\s+-\s+"?(.*?)"?$/gm)].map((item) => item[1]).filter(Boolean)
    : [];

  return {
    urlSlug: urlSlugMatch?.[1] ?? null,
    categories
  };
}

function toArticleUrl(slug) {
  return `${siteRoot}/article/${encodeURIComponent(slug)}`;
}

function toCategoryUrl(name) {
  return `${siteRoot}/category/${encodeURIComponent(name)}`;
}

function readFileMaybe(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function readGitFile(ref, filePath) {
  try {
    return execFileSync("git", ["show", `${ref}:${filePath}`], {
      encoding: "utf8",
      cwd: process.cwd()
    });
  } catch {
    return null;
  }
}

function getChangedUrls(baseRef = "HEAD~1", headRef = "HEAD") {
  let diffOutput = "";
  try {
    diffOutput = execFileSync("git", ["diff", "--name-status", baseRef, headRef, "--", "src/content/posts"], {
      encoding: "utf8",
      cwd: process.cwd()
    }).trim();
  } catch {
    return [];
  }

  if (!diffOutput) {
    return [];
  }

  const urls = new Set([`${siteRoot}/`]);

  for (const line of diffOutput.split("\n")) {
    const [status, ...rest] = line.split("\t");
    const filePath = rest[rest.length - 1];
    if (!filePath?.endsWith(".md")) continue;

    const absolutePath = path.resolve(filePath);
    const currentRaw = status !== "D" ? readFileMaybe(absolutePath) : null;
    const previousRaw = readGitFile(baseRef, filePath);

    const currentMeta = currentRaw ? parseFrontmatter(currentRaw) : { urlSlug: null, categories: [] };
    const previousMeta = previousRaw ? parseFrontmatter(previousRaw) : { urlSlug: null, categories: [] };

    const slug = currentMeta.urlSlug ?? previousMeta.urlSlug;
    if (slug) {
      urls.add(toArticleUrl(slug));
    }

    const categories = new Set([...currentMeta.categories, ...previousMeta.categories]);
    for (const category of categories) {
      urls.add(toCategoryUrl(category));
    }
  }

  return [...urls];
}

const changedMode = cleanArgs[0] === "--changed";
const urls = changedMode ? getChangedUrls(cleanArgs[1], cleanArgs[2]) : cleanArgs.filter(Boolean);

if (!key) {
  console.error("Missing INDEXNOW_KEY");
  process.exit(1);
}

if (urls.length === 0) {
  if (changedMode) {
    console.log("No changed post URLs to submit");
    process.exit(0);
  }
  console.error("No URLs provided");
  process.exit(1);
}

const invalidUrls = urls.filter((url) => {
  try {
    const parsed = new URL(url);
    return parsed.host !== siteHost;
  } catch {
    return true;
  }
});

if (invalidUrls.length > 0) {
  console.error("Invalid URLs detected. All URLs must belong to https://www.macapphq.com");
  for (const url of invalidUrls) {
    console.error(`- ${url}`);
  }
  process.exit(1);
}

const uniqueUrls = [...new Set(urls)];

const payload = {
  host: siteHost,
  key,
  keyLocation: `https://${siteHost}/${key}.txt`,
  urlList: uniqueUrls
};

console.log(`Submitting ${uniqueUrls.length} URL(s) to IndexNow`);
for (const url of uniqueUrls) {
  console.log(`- ${url}`);
}

if (dryRun) {
  process.exit(0);
}

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  },
  body: JSON.stringify(payload)
});

const bodyText = await response.text();

console.log(`IndexNow status: ${response.status}`);
if (bodyText) {
  console.log(bodyText);
}

if (!response.ok) {
  process.exit(1);
}
