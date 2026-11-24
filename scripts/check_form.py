#!/usr/bin/env python3
"""Check that the issue form's Section choices match README.md's sections, and that add_entry.py works."""

import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
readme = (ROOT / "README.md").read_text()
sections = [s for s in re.findall(r"^## (.+)$", readme, re.M) if s != "Contents"]
form = (ROOT / ".github/ISSUE_TEMPLATE/suggest-resource.yml").read_text()
block = form.split("id: section", 1)[1].split("validations:", 1)[0]
choices = re.findall(r"^\s+- (.+)$", block, re.M)
if choices != sections:
    sys.exit(f"Issue form sections {choices} do not match README sections {sections}")

body = ("### Name\n\nCheck entry\n\n### Link\n\nhttps://example.org/check\n\n"
        f"### Section\n\n{sections[0]}\n\n### Description\n\na test entry\n")
with tempfile.TemporaryDirectory() as tmp:
    t = Path(tmp)
    (t / "scripts").mkdir()
    (t / "scripts/add_entry.py").write_text((ROOT / "scripts/add_entry.py").read_text())
    (t / "README.md").write_text(readme)
    (t / "issue.md").write_text(body)
    r = subprocess.run([sys.executable, "-I", "scripts/add_entry.py", "issue.md"], cwd=t, capture_output=True, text=True)
    if r.returncode or "- [Check entry](https://example.org/check) - A test entry." not in (t / "README.md").read_text():
        sys.exit(f"add_entry.py failed: {r.stdout}{r.stderr}")
print(f"ok: {len(sections)} sections; add_entry.py works")
