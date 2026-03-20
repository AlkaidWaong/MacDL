#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import os
import re
import shutil
import sys
import urllib.parse
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


META_KEYS = {
    "type",
    "status",
    "date",
    "slug",
    "summary",
    "tags",
    "category",
    "password",
    "icon",
}

# Normalize categories to preserve existing indexed URLs where needed.
# Example: site has /category/AI, while the display label might be "AI软件".
CATEGORY_NORMALIZE = {
    "AI软件": "AI",
}


@dataclass(frozen=True)
class Row:
    type: str
    title: str
    summary: str
    status: str
    category: str
    tags: str
    slug: str
    date: str
    password: str
    icon: str


def read_csv_rows(path: Path) -> list[Row]:
    with path.open("r", encoding="utf-8-sig", errors="replace", newline="") as f:
        reader = csv.DictReader(f)
        out: list[Row] = []
        for raw in reader:
            row = {(k or "").strip(): (v or "").strip() for k, v in raw.items()}
            out.append(
                Row(
                    type=row.get("type", ""),
                    title=row.get("title", ""),
                    summary=row.get("summary", ""),
                    status=row.get("status", ""),
                    category=row.get("category", ""),
                    tags=row.get("tags", ""),
                    slug=row.get("slug", ""),
                    date=row.get("date", ""),
                    password=row.get("password", ""),
                    icon=row.get("icon", ""),
                )
            )
    return out


SLUG_RE = re.compile(r"^slug:\s*(.+?)\s*$", re.M)

ALLOWED_SLUG_URL_HOSTS = {
    # Some Notion exports contain a full URL here (buggy/placeholder host).
    "www.example.com",
    # Accept our own host too in case the export used absolute URLs.
    "www.macapphq.com",
    "macapphq.com",
}


def normalize_slug_value(raw: str) -> str | None:
    raw = (raw or "").strip()
    if not raw or raw == "#":
        return None
    if raw.startswith("/"):
        raw = raw[1:]
    if is_valid_url_slug(raw):
        return raw
    if raw.startswith("http://") or raw.startswith("https://"):
        try:
            p = urllib.parse.urlparse(raw)
        except Exception:
            return None
        host = (p.netloc or "").lower()
        if host not in ALLOWED_SLUG_URL_HOSTS:
            return None
        segs = [s for s in (p.path or "").split("/") if s]
        if not segs:
            return None
        cand = segs[-1]
        return cand if is_valid_url_slug(cand) else None
    return None


def extract_slug_from_export_md(text: str) -> str | None:
    m = SLUG_RE.search(text)
    if not m:
        return None
    return normalize_slug_value(m.group(1))


def parse_export_meta(text: str) -> dict[str, str]:
    # Extract the leading "# Title" and the subsequent "key: value" header block.
    meta: dict[str, str] = {}
    lines = text.splitlines()
    i = 0
    if i < len(lines) and lines[i].startswith("# "):
        meta["__title__"] = lines[i][2:].strip()
        i += 1
        while i < len(lines) and lines[i].strip() == "":
            i += 1
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
        if ":" in line:
            key, val = line.split(":", 1)
            k = key.strip().lower()
            if k in META_KEYS:
                meta[k] = val.strip()
                i += 1
                continue
        break
    return meta


def parse_date(value: str) -> str | None:
    value = (value or "").strip()
    if not value:
        return None
    for fmt in ("%Y/%m/%d", "%Y-%m-%d", "%Y.%m.%d"):
        try:
            return datetime.strptime(value, fmt).date().isoformat()
        except ValueError:
            pass
    return None


def split_list(value: str) -> list[str]:
    if not value:
        return []
    parts = re.split(r"[,，]\s*", value)
    out: list[str] = []
    for p in parts:
        p = p.strip()
        if not p:
            continue
        p = p.lstrip("#").strip()
        if p:
            out.append(p)
    # de-dup but keep order
    seen = set()
    dedup = []
    for p in out:
        if p in seen:
            continue
        seen.add(p)
        dedup.append(p)
    return dedup


def normalize_categories(categories: list[str]) -> list[str]:
    out = []
    for c in categories:
        out.append(CATEGORY_NORMALIZE.get(c, c))
    # de-dup
    seen = set()
    dedup = []
    for c in out:
        if c in seen:
            continue
        seen.add(c)
        dedup.append(c)
    return dedup


def sanitize_filename(name: str) -> str:
    name = name.strip().replace("\\", "/").split("/")[-1]
    # common Notion export pattern: foo_(1).png / foo (1).png -> foo-1.png
    name = re.sub(r"[ _]*\((\d+)\)", r"-\1", name)
    name = re.sub(r"_(\d+)(\.)", r"-\1\\2", name)
    name = name.replace(" ", "-")
    name = re.sub(r"[^A-Za-z0-9._-]+", "-", name)
    name = re.sub(r"-{2,}", "-", name).strip("-")
    return name or "asset"


IMG_HTML_RE = re.compile(r'<img\s+[^>]*src="([^"]+)"', re.I)


def strip_export_metadata(text: str) -> str:
    lines = text.splitlines()
    i = 0
    # Drop leading H1 title
    if i < len(lines) and lines[i].startswith("# "):
        i += 1
        # optional blank line after title
        while i < len(lines) and lines[i].strip() == "":
            i += 1
    # Drop key: value metadata lines
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
        if ":" in line:
            key = line.split(":", 1)[0].strip()
            if key in META_KEYS:
                i += 1
                continue
        break
    # Keep the rest, but trim leading blank lines
    body = "\n".join(lines[i:]).lstrip("\n")
    return body


def rewrite_and_copy_assets(
    body: str,
    export_root: Path,
    out_public_media_dir: Path,
    url_slug: str,
) -> str:
    media_dir = out_public_media_dir / url_slug
    media_dir.mkdir(parents=True, exist_ok=True)
    copied: dict[str, str] = {}

    def handle_src(raw_src: str) -> str:
        raw_src = raw_src.strip()
        if not raw_src or "://" in raw_src or raw_src.startswith("data:"):
            return raw_src

        # Strip query/hash
        src = raw_src.split("#", 1)[0].split("?", 1)[0]

        # Common pattern: <EncodedFolder>/<file>
        parts = src.split("/", 1)
        if len(parts) == 2:
            folder_enc, file_enc = parts
            folder = urllib.parse.unquote(folder_enc)
            file_name = urllib.parse.unquote(file_enc)
            candidate = export_root / folder / file_name
            if candidate.exists() and candidate.is_file():
                safe = sanitize_filename(file_name)
                dest = media_dir / safe
                if not dest.exists():
                    shutil.copy2(candidate, dest)
                return f"/media/{url_slug}/{dest.name}"

        # Direct file in export root (rare)
        candidate = export_root / urllib.parse.unquote(src)
        if candidate.exists() and candidate.is_file():
            safe = sanitize_filename(candidate.name)
            dest = media_dir / safe
            if not dest.exists():
                shutil.copy2(candidate, dest)
            return f"/media/{url_slug}/{dest.name}"

        return raw_src

    def rewrite_markdown_images(text: str) -> str:
        out = []
        i = 0
        n = len(text)
        while i < n:
            start = text.find("![", i)
            if start < 0:
                out.append(text[i:])
                break
            out.append(text[i:start])

            # Find closing ](
            mid = text.find("](", start)
            if mid < 0:
                out.append(text[start:])
                break

            # Copy up to url start
            url_start = mid + 2
            out.append(text[start:url_start])

            # Parse url, allowing parentheses inside
            j = url_start
            if j < n and text[j] == "<":
                end = text.find(">", j + 1)
                if end < 0:
                    out.append(text[j:])
                    break
                raw_url = text[j + 1 : end]
                new_url = copied.get(raw_url) or handle_src(raw_url)
                copied[raw_url] = new_url
                out.append("<" + new_url + ">")
                # Expect closing ')'
                k = text.find(")", end + 1)
                if k < 0:
                    out.append(text[end + 1 :])
                    break
                out.append(text[end + 1 : k + 1])
                i = k + 1
                continue

            depth = 0
            raw_url_chars = []
            while j < n:
                ch = text[j]
                if ch == "(":
                    depth += 1
                    raw_url_chars.append(ch)
                    j += 1
                    continue
                if ch == ")":
                    if depth == 0:
                        break
                    depth -= 1
                    raw_url_chars.append(ch)
                    j += 1
                    continue
                raw_url_chars.append(ch)
                j += 1

            raw_url = "".join(raw_url_chars).strip()
            new_url = copied.get(raw_url) or handle_src(raw_url)
            copied[raw_url] = new_url
            out.append(new_url)

            # Append the closing ')' if present
            if j < n and text[j] == ")":
                out.append(")")
                j += 1
            i = j
        return "".join(out)

    def repl_html(m: re.Match) -> str:
        src = m.group(1)
        if src in copied:
            new_src = copied[src]
        else:
            new_src = handle_src(src)
            copied[src] = new_src
        return m.group(0).replace(src, new_src)

    body = rewrite_markdown_images(body)
    body = IMG_HTML_RE.sub(repl_html, body)
    return body


def to_frontmatter_yaml(data: dict) -> str:
    # Minimal YAML emitter (safe for our simple types)
    lines = ["---"]
    for k, v in data.items():
        if isinstance(v, bool):
            lines.append(f"{k}: {'true' if v else 'false'}")
        elif isinstance(v, (int, float)):
            lines.append(f"{k}: {v}")
        elif isinstance(v, list):
            if len(v) == 0:
                lines.append(f"{k}: []")
            else:
                lines.append(f"{k}:")
                for item in v:
                    lines.append(f"  - {quote_yaml_string(str(item))}")
        elif v is None:
            continue
        else:
            lines.append(f"{k}: {quote_yaml_string(str(v))}")
    lines.append("---")
    return "\n".join(lines) + "\n"


def quote_yaml_string(s: str) -> str:
    s = s.replace("\r\n", "\n").replace("\r", "\n")
    # Always quote to be safe with ":" and non-ascii
    s = s.replace('"', '\\"')
    return f'"{s}"'


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")

def is_valid_url_slug(slug: str) -> bool:
    if not slug:
        return False
    if slug == "#":
        return False
    if "://" in slug:
        return False
    if slug.startswith("http:") or slug.startswith("https:"):
        return False
    # We only support root pages (/foo) and article slugs (/article/{slug})
    if "/" in slug or "\\" in slug:
        return False
    return True

def remove_child_dirs(path: Path) -> None:
    if not path.exists():
        return
    for child in path.iterdir():
        if child.is_dir():
            shutil.rmtree(child)

def remove_child_md_files(path: Path) -> None:
    if not path.exists():
        return
    for child in path.iterdir():
        if child.is_file() and child.suffix.lower() == ".md":
            child.unlink()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", required=True, help="CSV metadata file path")
    ap.add_argument("--export-dir", required=True, help="Notion export folder path")
    ap.add_argument(
        "--astro-root",
        default=str(Path(__file__).resolve().parents[1]),
        help="Path to astro/ directory (default: repo/astro)",
    )
    ap.add_argument("--include-drafts", action="store_true")
    args = ap.parse_args()

    csv_path = Path(args.csv)
    export_root = Path(args.export_dir)
    astro_root = Path(args.astro_root)

    out_posts = astro_root / "src" / "content" / "posts"
    out_pages = astro_root / "src" / "content" / "pages"
    out_media = astro_root / "public" / "media"

    # Clean up previously generated nested directories (e.g. https:/...)
    remove_child_dirs(out_posts)
    remove_child_dirs(out_pages)
    # Remove stale generated files to avoid duplicate ids after re-import
    remove_child_md_files(out_posts)
    remove_child_md_files(out_pages)

    rows = read_csv_rows(csv_path)
    rows_by_slug = {}
    for r in rows:
        if r.type not in ("Post", "Page"):
            continue
        slug = normalize_slug_value(r.slug)
        if not slug:
            continue
        rows_by_slug[slug] = r

    export_mds = list(export_root.glob("*.md"))
    export_by_slug: dict[str, Path] = {}
    export_meta_by_slug: dict[str, dict[str, str]] = {}
    for p in export_mds:
        text = p.read_text(encoding="utf-8", errors="replace")
        meta = parse_export_meta(text)
        slug = normalize_slug_value(meta.get("slug", "")) or extract_slug_from_export_md(text)
        if slug and is_valid_url_slug(slug):
            export_by_slug[slug] = p
            export_meta_by_slug[slug] = meta

    imported_posts = 0
    imported_pages = 0
    missing_body = []

    for slug, row in rows_by_slug.items():
        if row.type not in ("Post", "Page"):
            continue
        is_published = row.status == "Published" or row.status == ""
        if not is_published and not args.include_drafts:
            continue

        date_iso = parse_date(row.date) or "1970-01-01"
        categories = split_list(row.category)
        categories = normalize_categories(categories)
        tags = split_list(row.tags)
        url_slug = slug  # for /article/{slug} and /{slug}

        export_path = export_by_slug.get(slug)
        body = ""
        if export_path and export_path.exists():
            raw = export_path.read_text(encoding="utf-8", errors="replace")
            body = strip_export_metadata(raw)
            body = rewrite_and_copy_assets(body, export_root, out_media, url_slug)
        else:
            missing_body.append(slug)
            body = row.summary or ""

        if row.type == "Post":
            fm = {
                "urlSlug": url_slug,
                "title": row.title,
                "date": date_iso,
                "description": row.summary.strip().replace("\n", " ").strip()[:200]
                if row.summary
                else None,
                "categories": categories,
                "tags": tags,
                "aliases": [],
                "draft": not is_published,
            }
            out_path = out_posts / f"{url_slug}.md"
            write_text(out_path, to_frontmatter_yaml(fm) + "\n" + body.strip() + "\n")
            imported_posts += 1
        else:
            fm = {
                "urlSlug": url_slug,
                "title": row.title,
                "description": row.summary.strip().replace("\n", " ").strip()[:200]
                if row.summary
                else None,
                "aliases": [],
                "draft": not is_published,
            }
            out_path = out_pages / f"{url_slug}.md"
            write_text(out_path, to_frontmatter_yaml(fm) + "\n" + body.strip() + "\n")
            imported_pages += 1

    # Import "orphan" export markdown files that were not covered by CSV,
    # but still look like valid Post/Page items. This is primarily to fix
    # cases like: slug: https://www.example.com/mac-one-click-cutout/
    for slug, export_path in export_by_slug.items():
        if slug in rows_by_slug:
            continue
        meta = export_meta_by_slug.get(slug, {})
        t = (meta.get("type") or "").strip() or "Post"
        if t not in ("Post", "Page"):
            continue
        status = (meta.get("status") or "").strip()
        is_published = status == "Published" or status == ""
        if not is_published and not args.include_drafts:
            continue

        title = (meta.get("__title__") or "").strip() or slug
        summary = (meta.get("summary") or "").strip()
        date_iso = parse_date(meta.get("date") or "") or "1970-01-01"
        categories = normalize_categories(split_list(meta.get("category") or ""))
        tags = split_list(meta.get("tags") or "")

        raw = export_path.read_text(encoding="utf-8", errors="replace")
        body = strip_export_metadata(raw)
        body = rewrite_and_copy_assets(body, export_root, out_media, slug)

        if t == "Post":
            fm = {
                "urlSlug": slug,
                "title": title,
                "date": date_iso,
                "description": summary.strip().replace("\n", " ").strip()[:200] if summary else None,
                "categories": categories,
                "tags": tags,
                "aliases": [],
                "draft": not is_published,
            }
            out_path = out_posts / f"{slug}.md"
            write_text(out_path, to_frontmatter_yaml(fm) + "\n" + body.strip() + "\n")
            imported_posts += 1
        else:
            fm = {
                "urlSlug": slug,
                "title": title,
                "description": summary.strip().replace("\n", " ").strip()[:200] if summary else None,
                "aliases": [],
                "draft": not is_published,
            }
            out_path = out_pages / f"{slug}.md"
            write_text(out_path, to_frontmatter_yaml(fm) + "\n" + body.strip() + "\n")
            imported_pages += 1

    print(f"imported posts: {imported_posts}")
    print(f"imported pages: {imported_pages}")
    if missing_body:
        print(f"missing export md for {len(missing_body)} slugs (used summary fallback):")
        for s in missing_body[:30]:
            print(" -", s)
        if len(missing_body) > 30:
            print(" - ...")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
