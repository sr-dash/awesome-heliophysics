#!/usr/bin/env python3
"""Add one entry to README.md from a "Suggest a resource" issue.

Reads the issue body (the issue form's Markdown) from the file named by the first argument, or from
standard input, checks it, and inserts the entry in alphabetical order in its section. Prints a
JSON summary for the workflow: {"name", "url", "section", "line"}. Exits with status 1 and an
"error" message when the suggestion cannot be added as it is (the workflow posts it on the issue).

Standard library only. The issue text is untrusted: it is only parsed and written into README.md as
one Markdown list line, never run.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.parse
from pathlib import Path

README = Path(__file__).resolve().parent.parent / "README.md"
FIELDS = {"Name": "name", "Link": "url", "Section": "section", "Description": "description"}
MAX_NAME, MAX_DESC = 60, 200


class EntryError(ValueError):
    pass


def parse_form(body: str) -> dict[str, str]:
    """The answers of the issue form: '### Label' headings, each followed by the answer."""
    out, label, buf = {}, None, []
    for line in body.splitlines() + ["### end"]:
        m = re.match(r"^###\s+(.+?)\s*$", line)
        if m:
            if label in FIELDS:
                text = "\n".join(buf).strip()
                out[FIELDS[label]] = "" if text == "_No response_" else text
            label, buf = m.group(1), []
        else:
            buf.append(line)
    return out


def clean(entry: dict[str, str], sections: list[str]) -> dict[str, str]:
    name = " ".join(entry.get("name", "").split())
    url = entry.get("url", "").strip()
    section = entry.get("section", "").strip()
    desc = " ".join(entry.get("description", "").split())
    if not name or len(name) > MAX_NAME or re.search(r"[\[\]()<>`|]", name):
        raise EntryError(f"The name should be plain text of at most {MAX_NAME} characters.")
    p = urllib.parse.urlparse(url)
    if p.scheme not in ("http", "https") or not p.netloc or re.search(r"[\s()<>\[\]`]", url):
        raise EntryError("The link should be one http(s) address.")
    if section not in sections:
        raise EntryError(f"Unknown section {section!r}.")
    if not desc or len(desc) > MAX_DESC or re.search(r"[\[\]<>`|]|https?://", desc):
        raise EntryError(f"The description should be one plain sentence of at most {MAX_DESC} characters, "
                         "without links or Markdown.")
    desc = desc[0].upper() + desc[1:]
    if desc[-1] not in ".!?":
        desc += "."
    return {"name": name, "url": url, "section": section, "description": desc}


def sections_of(text: str) -> list[str]:
    return [m.group(1) for m in re.finditer(r"^## (.+)$", text, re.M) if m.group(1) != "Contents"]


def insert(text: str, e: dict[str, str]) -> tuple[str, str]:
    """README text with the entry added in alphabetical order (case ignored) in its section."""
    line = f"- [{e['name']}]({e['url']}) - {e['description']}"
    lines = text.split("\n")
    start = lines.index(f"## {e['section']}")
    end = next((i for i in range(start + 1, len(lines)) if lines[i].startswith("## ")), len(lines))
    items = [i for i in range(start + 1, end) if lines[i].startswith("- [")]
    for i in items:
        m = re.match(r"- \[([^\]]+)\]\(([^)]+)\)", lines[i])
        if m.group(1).lower() == e["name"].lower():
            raise EntryError(f"{m.group(1)} is already listed.")
    if e["url"].rstrip("/") in {re.search(r"\]\(([^)]+)\)", lines[i]).group(1).rstrip("/") for i in range(len(lines))
                                if lines[i].startswith("- [")}:
        raise EntryError("That link is already on the list.")
    key = e["name"].lower()
    pos = next((i for i in items if re.match(r"- \[([^\]]+)\]", lines[i]).group(1).lower() > key),
               (items[-1] + 1) if items else start + 2)
    lines.insert(pos, line)
    return "\n".join(lines), line


def main(argv: list[str]) -> int:
    body = Path(argv[1]).read_text() if len(argv) > 1 else sys.stdin.read()
    text = README.read_text()
    try:
        e = clean(parse_form(body), sections_of(text))
        new, line = insert(text, e)
    except EntryError as err:
        print(json.dumps({"error": str(err)}))
        return 1
    README.write_text(new)
    print(json.dumps({"name": e["name"], "url": e["url"], "section": e["section"], "line": line}))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
