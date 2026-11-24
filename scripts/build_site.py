#!/usr/bin/env python3
"""Build the website in _site/ from README.md and the files in site/.

README.md is the single source of the list. This script parses it, adds repository facts for
GitHub links (stars, language, licence, last push, archived) when the GitHub API can be reached,
and writes:

  _site/data/entries.json   the list, for the page's search and filters
  _site/index.html          site/index.html with every entry pre-rendered (for readers without
                            JavaScript and for search engines) and the JSON-LD ItemList
  _site/sitemap.xml, _site/llms.txt and the static files of site/

Usage:  python3 scripts/build_site.py [--no-github]
GITHUB_TOKEN (optional) raises the GitHub API rate limit. Standard library only.
"""

from __future__ import annotations

import html
import json
import os
import re
import shutil
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
OUT = ROOT / "_site"
URL = "https://sr-dash.github.io/awesome-heliophysics/"
REPO = "https://github.com/sr-dash/awesome-heliophysics"

# Section colours follow the false-colour tables of SDO/AIA channels (and HMI grey)
SECTION_STYLE = {
    "Data archives and portals": ("#E9B44C", "171 Å"),
    "Event catalogues and indices": ("#E0603F", "304 Å"),
    "Python software": ("#4FC1B4", "131 Å"),
    "IDL and other software": ("#8FD16A", "94 Å"),
    "Data formats and standards": ("#E3A88A", "1074.7 nm"),
    "Viewers and visualisation": ("#C9925A", "193 Å"),
    "Models and simulation codes": ("#B07CE8", "211 Å"),
    "Space-weather services": ("#5E8DF0", "335 Å"),
    "Missions and observatories": ("#D7C26A", "1600 Å"),
    "Machine-learning datasets": ("#EA7FB0", "1700 Å"),
    "Learning": ("#A9B4CC", "HMI"),
    "Community": ("#7FD4E6", "4500 Å"),
}


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def parse_readme(text: str) -> tuple[str, list[dict]]:
    tagline = re.search(r"^> (.+)$", text, re.M).group(1).strip()
    entries, section = [], None
    for line in text.splitlines():
        if line.startswith("## "):
            section = line[3:].strip()
            continue
        m = re.match(r"^- \[([^\]]+)\]\(([^)]+)\) - (.+)$", line)
        if m and section and section != "Contents":
            name, url, desc = m.groups()
            host = urllib.parse.urlparse(url).netloc.removeprefix("www.")
            gh = re.match(r"https://github\.com/([^/]+)/([^/#?]+)/?$", url)
            entries.append({"name": name, "url": url, "desc": desc, "section": section, "host": host,
                            "repo": f"{gh.group(1)}/{gh.group(2)}" if gh else None})
    return tagline, entries


def github_facts(repo: str, token: str | None) -> dict | None:
    req = urllib.request.Request(f"https://api.github.com/repos/{repo}",
                                 headers={"Accept": "application/vnd.github+json",
                                          "User-Agent": "awesome-heliophysics-site",
                                          **({"Authorization": f"Bearer {token}"} if token else {})})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            d = json.load(r)
    except Exception:
        return None
    return {"stars": d.get("stargazers_count"), "language": d.get("language"),
            "license": (d.get("license") or {}).get("spdx_id") if d.get("license") else None,
            "pushed": (d.get("pushed_at") or "")[:10], "archived": bool(d.get("archived")),
            "topics": d.get("topics", [])[:6]}


def entry_html(e: dict, i: int) -> str:
    esc = html.escape
    meta = []
    gh = e.get("github") or {}
    if gh.get("stars") is not None:
        meta.append(f'<span class="m-stars" title="GitHub stars">{gh["stars"]:,}</span>')
    if gh.get("language"):
        meta.append(f'<span class="m-lang">{esc(gh["language"])}</span>')
    if gh.get("archived"):
        meta.append('<span class="m-archived">Archived</span>')
    return (f'<li class="entry" id="{esc(e["id"])}" data-i="{i}">'
            f'<a class="e-name" href="{esc(e["url"])}" rel="noopener">{esc(e["name"])}</a>'
            f'<span class="e-host">{esc(e["host"])}</span>'
            f'<p class="e-desc">{esc(e["desc"])}</p>'
            f'<div class="e-meta">{"".join(meta)}</div></li>')


def main(argv: list[str]) -> int:
    text = (ROOT / "README.md").read_text()
    tagline, entries = parse_readme(text)
    token = os.environ.get("GITHUB_TOKEN")
    if "--no-github" not in argv:
        repos = sorted({e["repo"] for e in entries if e["repo"]})
        with ThreadPoolExecutor(8) as ex:
            facts = dict(zip(repos, ex.map(lambda r: github_facts(r, token), repos)))
        for e in entries:
            if e["repo"] and facts.get(e["repo"]):
                e["github"] = facts[e["repo"]]
        print(f"GitHub facts for {sum(1 for v in facts.values() if v)} of {len(repos)} repositories")
    for e in entries:
        e["id"] = f'{slug(e["section"])}--{slug(e["name"])}'
    sections = []
    for name, (color, channel) in SECTION_STYLE.items():
        items = [e for e in entries if e["section"] == name]
        if items:
            sections.append({"name": name, "id": slug(name), "color": color, "channel": channel, "count": len(items)})
    unknown = {e["section"] for e in entries} - set(SECTION_STYLE)
    if unknown:
        sys.exit(f"Add a colour for these sections in SECTION_STYLE: {sorted(unknown)}")

    now = datetime.now(timezone.utc)
    if OUT.exists():
        shutil.rmtree(OUT)
    shutil.copytree(SITE, OUT)
    (OUT / "data").mkdir(exist_ok=True)
    data = {"generated": now.strftime("%Y-%m-%dT%H:%MZ"), "tagline": tagline, "repo": REPO,
            "sections": sections, "entries": entries}
    (OUT / "data/entries.json").write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")))

    # Pre-rendered list: every entry is in the HTML; the script takes over when it loads
    blocks = []
    for s in sections:
        items = [(i, e) for i, e in enumerate(entries) if e["section"] == s["name"]]
        blocks.append(f'<section class="group" id="{s["id"]}" style="--c:{s["color"]}">'
                      f'<h2 class="g-title"><span>{html.escape(s["name"])}</span>'
                      f'<span class="g-channel">{html.escape(s["channel"])}</span>'
                      f'<span class="g-count">{s["count"]}</span></h2>'
                      f'<ul class="entries">{"".join(entry_html(e, i) for i, e in items)}</ul></section>')
    ld = {"@context": "https://schema.org", "@type": "ItemList", "name": "Awesome Heliophysics",
          "description": tagline, "url": URL, "numberOfItems": len(entries),
          "itemListElement": [{"@type": "ListItem", "position": n + 1, "name": e["name"], "url": e["url"],
                               "description": e["desc"]} for n, e in enumerate(entries)]}
    page = (OUT / "index.html").read_text()
    # Version the stylesheet and script so browsers fetch new copies after each change
    import hashlib
    for name in ("style.css", "app.js", "extras.js"):
        v = hashlib.sha256((OUT / name).read_bytes()).hexdigest()[:10]
        page = page.replace(f'href="{name}"', f'href="{name}?v={v}"').replace(f'src="{name}"', f'src="{name}?v={v}"')
    page = (page.replace("<!--LIST-->", "".join(blocks))
                .replace("<!--ITEMLIST-->", json.dumps(ld, ensure_ascii=False).replace("</", "<\\/"))
                .replace("{{COUNT}}", str(len(entries)))
                .replace("{{SECTIONS}}", str(len(sections)))
                .replace("{{UPDATED}}", now.strftime("%Y-%m-%d"))
                .replace("{{UPDATED_LONG}}", now.strftime("%-d %B %Y")))
    (OUT / "index.html").write_text(page)

    (OUT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f'  <url><loc>{URL}</loc><lastmod>{now:%Y-%m-%d}</lastmod><changefreq>weekly</changefreq></url>\n</urlset>\n')
    lines = [f"# Awesome Heliophysics\n\n> {tagline}\n",
             f"The list is maintained in {REPO} (README.md). This page: {URL}. "
             f"Machine-readable list: {URL}data/entries.json\n"]
    for s in sections:
        lines.append(f"\n## {s['name']}\n")
        lines += [f"- [{e['name']}]({e['url']}): {e['desc']}" for e in entries if e["section"] == s["name"]]
    (OUT / "llms.txt").write_text("\n".join(lines) + "\n")
    print(f"Built {OUT} with {len(entries)} entries in {len(sections)} sections")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
