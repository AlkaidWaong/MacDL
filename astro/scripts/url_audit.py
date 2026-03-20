#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.parse
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path


def iter_files(root: Path):
    for p in root.rglob("*"):
        if p.is_file():
            yield p


def encode_segment(seg: str) -> str:
    # Keep RFC3986-friendly chars unescaped in a *path segment*.
    # unreserved + sub-delims + ":" + "@"
    return urllib.parse.quote(seg, safe="-._~!$&'()*+,;=:@")


def normalize_path(path: str) -> str:
    if not path:
        return "/"
    if not path.startswith("/"):
        path = "/" + path
    # Collapse multiple slashes
    path = re.sub(r"/{2,}", "/", path)
    # Remove trailing slash (except root)
    if path != "/" and path.endswith("/"):
        path = path[:-1]
    return path


def canonicalize_url_path(raw_path: str) -> str:
    raw_path = normalize_path(raw_path)
    parts = raw_path.split("/")
    out = []
    for seg in parts:
        if seg == "":
            out.append("")
            continue
        try:
            dec = urllib.parse.unquote(seg)
        except Exception:
            dec = seg
        out.append(encode_segment(dec))
    canon = "/".join(out)
    return normalize_path(canon)


def url_from_dist_file(dist_root: Path, file_path: Path) -> str | None:
    rel = file_path.relative_to(dist_root)
    parts = list(rel.parts)
    if not parts:
        return "/"
    # Special 404.html -> /404 (Astro writes /404.html)
    if len(parts) == 1 and parts[0] == "404.html":
        return "/404"
    # Root index.html -> /
    if parts == ["index.html"]:
        return "/"
    # foo/index.html -> /foo
    if parts[-1] == "index.html":
        segs = [encode_segment(p) for p in parts[:-1]]
        return normalize_path("/" + "/".join(segs))
    # non-html assets at root of dist are served as-is
    segs = [encode_segment(p) for p in parts]
    return normalize_path("/" + "/".join(segs))


def load_built_paths(dist_root: Path) -> tuple[set[str], dict[str, str]]:
    built: set[str] = set()
    lower_map: dict[str, str] = {}
    for f in iter_files(dist_root):
        url = url_from_dist_file(dist_root, f)
        if not url:
            continue
        built.add(url)
        key = url.lower()
        if key not in lower_map:
            lower_map[key] = url
    return built, lower_map


@dataclass(frozen=True)
class RedirectRule:
    source: str
    destination: str
    permanent: bool


def host_matches(netloc: str, expected_host: str | None) -> bool:
    if not expected_host:
        return True
    candidates = [h.strip().lower() for h in expected_host.split(",") if h.strip()]
    value = (netloc or "").strip().lower()
    if not candidates:
        return True
    for host in candidates:
        if value == host:
            return True
        if value == f"www.{host}" or host == f"www.{value}":
            return True
    return False


def load_vercel_redirects(vercel_json: Path) -> list[RedirectRule]:
    if not vercel_json.exists():
        return []
    data = json.loads(vercel_json.read_text(encoding="utf-8"))
    rules = []
    for r in data.get("redirects", []) or []:
        rules.append(
            RedirectRule(
                source=r.get("source", ""),
                destination=r.get("destination", ""),
                permanent=bool(r.get("permanent", False)),
            )
        )
    return rules


def source_pattern_to_regex(source: str) -> re.Pattern[str]:
    # Convert vercel path patterns to regex:
    # /tag/ORC/page/:page -> /tag/ORC/page/2
    # /:path*.html -> /foo/bar.html
    out = []
    i = 0
    while i < len(source):
        ch = source[i]
        if ch == ":":
            j = i + 1
            while j < len(source) and re.match(r"[A-Za-z0-9_]", source[j]):
                j += 1
            name = source[i + 1 : j]
            if not name:
                out.append(re.escape(ch))
                i += 1
                continue
            star = j < len(source) and source[j] == "*"
            if star:
                out.append(f"(?P<{name}>.*)")
                j += 1
            else:
                out.append(f"(?P<{name}>[^/]+)")
            i = j
            continue
        out.append(re.escape(ch))
        i += 1
    return re.compile("^" + "".join(out) + "$")


def apply_destination_params(destination: str, params: dict[str, str]) -> str:
    out = destination
    # Replace star tokens first to avoid partial replacement.
    for key, value in params.items():
        out = out.replace(f":{key}*", value or "")
    for key, value in params.items():
        out = out.replace(f":{key}", value or "")
    return out


def match_simple_redirect(rules: list[RedirectRule], path: str) -> str | None:
    def norm_dest(dest: str) -> str:
        dest = (dest or "").strip()
        if dest.startswith("http://") or dest.startswith("https://"):
            return dest
        return normalize_path(dest)

    for r in rules:
        source = (r.source or "").strip()
        if not source:
            continue
        if ":" not in source and "*" not in source:
            if source == path:
                return norm_dest(r.destination)
            continue
        pattern = source_pattern_to_regex(source)
        m = pattern.match(path)
        if not m:
            continue
        dest = apply_destination_params(r.destination or "", m.groupdict())
        return norm_dest(dest)
    return None


def parse_sitemap_xml(xml_text: str) -> list[str]:
    xml_text = xml_text.strip()
    if not xml_text:
        return []
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        # Fallback for malformed sitemaps (e.g. unescaped '&' inside <loc>).
        return re.findall(r"<loc>([^<]+)</loc>", xml_text)

    # Both sitemapindex and urlset use namespaces; ignore by stripping.
    def local(tag: str) -> str:
        return tag.split("}", 1)[-1]

    urls = []
    if local(root.tag) == "sitemapindex":
        # Return sitemap locs (caller can fetch / provide them)
        for sm in root:
            if local(sm.tag) != "sitemap":
                continue
            loc = None
            for child in sm:
                if local(child.tag) == "loc":
                    loc = (child.text or "").strip()
            if loc:
                urls.append(loc)
        return urls

    if local(root.tag) == "urlset":
        for u in root:
            if local(u.tag) != "url":
                continue
            loc = None
            for child in u:
                if local(child.tag) == "loc":
                    loc = (child.text or "").strip()
            if loc:
                urls.append(loc)
        return urls

    return []


def extract_paths_from_urls(urls: list[str], expected_host: str | None) -> list[str]:
    out = []
    for u in urls:
        u = (u or "").strip()
        if not u:
            continue
        try:
            p = urllib.parse.urlparse(u)
        except Exception:
            continue
        if expected_host and p.netloc and not host_matches(p.netloc, expected_host):
            # Skip external URLs in sitemap
            continue
        out.append(p.path or "/")
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", required=True, help="Astro dist directory")
    ap.add_argument("--vercel-json", required=True, help="Path to vercel.json")
    ap.add_argument("--host", default="www.macapphq.com", help="Expected sitemap host")
    ap.add_argument("--sitemap-xml", action="append", help="Path to a sitemap XML file (can repeat)")
    ap.add_argument("--urls-file", help="Path to a file containing one URL per line")
    ap.add_argument("--out", default="astro/url_audit_report.md", help="Output report path")
    args = ap.parse_args()

    dist_root = Path(args.dist)
    vercel_json = Path(args.vercel_json)
    out_path = Path(args.out)

    built, built_lower = load_built_paths(dist_root)
    redirects = load_vercel_redirects(vercel_json)

    urls: list[str] = []
    if args.urls_file:
        for line in Path(args.urls_file).read_text(encoding="utf-8", errors="replace").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            urls.append(line)

    sitemap_paths = args.sitemap_xml or []
    for p in sitemap_paths:
        xml_text = Path(p).read_text(encoding="utf-8", errors="replace")
        urls.extend(parse_sitemap_xml(xml_text))

    if not urls:
        print("No URLs provided. Use --urls-file or --sitemap-xml.", file=sys.stderr)
        return 2

    paths = extract_paths_from_urls(urls, args.host)
    unique = []
    seen = set()
    for p in paths:
        canon = canonicalize_url_path(p)
        if canon in seen:
            continue
        seen.add(canon)
        unique.append(canon)

    ok = []
    redirect_ok = []
    missing = []
    case_mismatch = []

    for p in unique:
        if p in built:
            ok.append(p)
            continue
        dest = match_simple_redirect(redirects, p)
        if dest:
            if dest.startswith("http://") or dest.startswith("https://"):
                redirect_ok.append((p, dest, True))
            else:
                dest_canon = canonicalize_url_path(dest)
                redirect_ok.append((p, dest_canon, dest_canon in built))
            continue
        lower = p.lower()
        if lower in built_lower:
            case_mismatch.append((p, built_lower[lower]))
            continue
        missing.append(p)

    lines = []
    lines.append("# URL Audit Report")
    lines.append("")
    lines.append(f"- sitemap urls: {len(unique)}")
    lines.append(f"- built routes/assets: {len(built)}")
    lines.append(f"- ok: {len(ok)}")
    lines.append(f"- redirect matched: {len(redirect_ok)}")
    lines.append(f"- case mismatch: {len(case_mismatch)}")
    lines.append(f"- missing: {len(missing)}")
    lines.append("")

    if missing:
        lines.append("## Missing")
        for p in missing[:200]:
            lines.append(f"- {p}")
        if len(missing) > 200:
            lines.append(f"- ... ({len(missing) - 200} more)")
        lines.append("")

    if case_mismatch:
        lines.append("## Case Mismatch (Sitemap vs Built)")
        for a, b in case_mismatch[:200]:
            lines.append(f"- {a} -> {b}")
        if len(case_mismatch) > 200:
            lines.append(f"- ... ({len(case_mismatch) - 200} more)")
        lines.append("")

    if redirect_ok:
        lines.append("## Redirect Matches (from vercel.json)")
        for src, dst, dst_exists in redirect_ok[:200]:
            suffix = "OK" if dst_exists else "DEST_MISSING"
            lines.append(f"- {src} -> {dst} ({suffix})")
        if len(redirect_ok) > 200:
            lines.append(f"- ... ({len(redirect_ok) - 200} more)")
        lines.append("")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote report: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
