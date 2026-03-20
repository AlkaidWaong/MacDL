#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
import re
from pathlib import Path
from urllib.parse import urlparse


def normalize_url(url: str) -> str | None:
    url = (url or "").strip()
    if not url:
        return None
    if not (url.startswith("http://") or url.startswith("https://")):
        return None
    try:
        p = urlparse(url)
    except Exception:
        return None
    if not p.netloc:
        return None
    return url


def clean_text(s: str) -> str:
    s = (s or "").strip()
    s = re.sub(r"\s+", " ", s)
    return s


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", required=True, help="Friend links CSV path")
    ap.add_argument(
        "--out",
        required=True,
        help="Output JSON path (e.g. astro/src/data/friendlinks.json)",
    )
    args = ap.parse_args()

    csv_path = Path(args.csv)
    out_path = Path(args.out)

    rows = []
    with csv_path.open("r", encoding="utf-8-sig", errors="replace", newline="") as f:
        reader = csv.DictReader(f)
        for raw in reader:
            name = clean_text(raw.get("Name", "") or raw.get("name", ""))
            url = normalize_url(raw.get("URL-TEXT", "") or raw.get("url", "") or raw.get("URL", ""))
            desc = clean_text(raw.get("简介", "") or raw.get("desc", "") or raw.get("description", ""))
            if not name or not url:
                continue
            rows.append({"name": name, "url": url, "description": desc})

    # de-dup by url
    seen = set()
    dedup = []
    for r in rows:
        key = r["url"].rstrip("/")
        if key in seen:
            continue
        seen.add(key)
        dedup.append(r)

    dedup.sort(key=lambda x: x["name"].lower())

    payload = {
        "generatedFrom": str(csv_path),
        "count": len(dedup),
        "links": dedup,
    }
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote: {out_path} ({len(dedup)} links)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

