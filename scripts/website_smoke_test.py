#!/usr/bin/env python3
"""Lightweight regression checks for the static Kaevoryn Studios homepage."""
from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / "index.html").read_text(encoding="utf-8")


class MarkupProbe(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.fragment_links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        href = attrs.get("href", "")
        if href.startswith("#") and len(href) > 1:
            self.fragment_links.append(href[1:])


probe = MarkupProbe()
probe.feed(html)
probe.close()


def require(condition, message):
    if not condition:
        raise SystemExit(f"FAIL: {message}")
    print(f"PASS: {message}")


duplicates = sorted({item for item in probe.ids if probe.ids.count(item) > 1})
missing = sorted(set(probe.fragment_links) - set(probe.ids))

require(bool(re.search(r"<main\\b", html, re.I)) and bool(re.search(r"</main\\s*>", html, re.I)),
        "homepage has a main landmark")
require('class="skip-link"' in html and 'href="#main-content"' in html,
        "keyboard skip link targets main content")
require(not duplicates, f"HTML IDs are unique (duplicates: {duplicates})")
require(not missing, f"internal fragment links resolve (missing: {missing})")
require(bool(re.search(r"prefers-reduced-motion\\s*:\\s*reduce", html)),
        "reduced-motion preferences are respected")
require(bool(re.search(r"""fetch\\(\\s*['"]content/projects\\.json['"]\\s*\\)""", html)),
        "project content loader is present")
require(bool(re.search(r"function\\s+revealGoldenInvitation\\s*\\(", html)),
        "Golden Invitation interaction function is present")

style_open = len(re.findall(r"<style\\b", html, re.I))
style_close = len(re.findall(r"</style\\s*>", html, re.I))
script_open = len(re.findall(r"<script\\b", html, re.I))
script_close = len(re.findall(r"</script\\s*>", html, re.I))
require(style_open == style_close == 1, "style element is balanced")
require(script_open == script_close, "script elements are balanced")

scripts = re.findall(r"<script\\b[^>]*>([\\s\\S]*?)</script\\s*>", html, re.I)
with tempfile.TemporaryDirectory(prefix="kaevoryn-smoke-") as temp_dir:
    for index, source in enumerate(scripts, start=1):
        script_path = Path(temp_dir) / f"inline-{index}.js"
        script_path.write_text(source, encoding="utf-8")
        result = subprocess.run(
            ["node", "--check", str(script_path)],
            capture_output=True,
            text=True,
            check=False,
        )
        require(result.returncode == 0,
                f"inline JavaScript block {index} parses" +
                (f": {result.stderr.strip()}" if result.returncode else ""))

print("Website smoke checks completed.")
