#!/usr/bin/env python3
"""Static regression checks for the multi-page Kaevoryn Studios website."""
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
pages = sorted(ROOT.rglob("*.html"))
excluded = {".git", ".github"}
pages = [p for p in pages if not any(part in excluded for part in p.parts)]

def require(ok,msg):
    if not ok: raise SystemExit(f"FAIL: {msg}")
    print(f"PASS: {msg}")

class Probe(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids=[]; self.links=[]; self.text=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if attrs.get("id"): self.ids.append(attrs["id"])
        href=attrs.get("href","")
        if href and not href.startswith(("http://","https://","mailto:","tel:","javascript:")):
            self.links.append(href)
    def handle_data(self, data): self.text.append(data)

probes={}
page_titles={}
for path in pages:
    source=path.read_text(encoding="utf-8")
    parser=Probe()
    parser.feed(source)
    title_match=re.search(r"<title>\s*(.*?)\s*</title>", source, re.IGNORECASE | re.DOTALL)
    description_match=re.search(r'<meta\s+name="description"\s+content="([^"]+)">?', source, re.IGNORECASE)
    require(bool(re.search(r'<html\s+lang="en"(?:\s|>)', source, re.IGNORECASE)), f"{path.relative_to(ROOT)} declares its document language")
    require(bool(title_match and title_match.group(1).strip()), f"{path.relative_to(ROOT)} has a non-empty page title")
    require(bool(description_match and description_match.group(1).strip()), f"{path.relative_to(ROOT)} has a non-empty meta description")
    require(bool(re.search(r'<meta\s+name="viewport"\s+content="[^"]+">?', source, re.IGNORECASE)), f"{path.relative_to(ROOT)} has responsive viewport metadata")
    if title_match:
        title=title_match.group(1).strip()
        require(title not in page_titles, f"page title is unique: {path.relative_to(ROOT)} (also found in {page_titles.get(title, 'another page')})")
        page_titles[title]=path.relative_to(ROOT).as_posix()
    duplicates=sorted({x for x in parser.ids if parser.ids.count(x)>1})
    if duplicates: raise SystemExit(f"FAIL: duplicate IDs in {path}: {duplicates}")
    probes[path]=parser

index=(ROOT/"index.html").read_text(encoding="utf-8")
for href in ("projects.html","explore.html","vision.html","invitation.html","contact.html"):
    require(f'href="{href}"' in index, f"homepage links to {href}")
require(len(re.findall(r'class="portal-card"',index)) == 6, "homepage has six clickable portal cards")
require('aria-label="Primary navigation"' in index and 'class="skip-link"' in index, "homepage navigation and skip link are accessible")
require('name="viewport"' in index and 'property="og:title"' in index, "homepage has viewport and social metadata")

required_files = ["projects.html","explore.html","vision.html","invitation.html","contact.html","games.html","worlds.html","music.html","shows.html","films.html","software.html"]
for name in required_files:
    require((ROOT/name).is_file(), f"dedicated page exists: {name}")
for path, parser in probes.items():
    missing=[]
    for href in parser.links:
        if href.startswith("#"):
            if href[1:] not in parser.ids: missing.append(href)
        elif href and not href.startswith(("http://","https://","mailto:","tel:","javascript:")):
            target=(path.parent/href.split("#",1)[0]).resolve()
            if not target.exists(): missing.append(href)
    require(not missing, f"local links resolve in {path.relative_to(ROOT)} (missing: {missing})")

invitation=(ROOT/"invitation.html").read_text(encoding="utf-8")
for phrase in ("KAEVORYN STUDIOS","GOLDEN INVITATION","ACCESS TO THE IMPOSSIBLE","CREATE THE IMPOSSIBLE","Create the Impossible — starting with the person who dreamed it.","DREAMER ACCESS","WHAT WILL YOU DREAM INTO EXISTENCE?"):
    require(phrase in invitation, f"canonical Golden Invitation wording is present: {phrase}")
explore=(ROOT/"explore.html").read_text(encoding="utf-8")
for status in ("Concept","Exploring","Prototype","Planned","In Development","Released","Future"):
    require(status in explore, f"official status key includes {status}")
for project in ("infinity-vision-ai.html","escape-from-the-nightmare-forge.html","infinity-motion-studio.html"):
    require((ROOT/"projects"/project).is_file(), f"existing project page is preserved: {project}")
print(f"Static checks completed for {len(pages)} HTML pages.")
