#!/usr/bin/env python3
"""Static regression checks for the multi-page Kaevoryn Studios website."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
pages = sorted(ROOT.rglob("*.html"))
excluded = {".git", ".github"}
pages = [p for p in pages if not any(part in excluded for part in p.parts)]

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
for path in pages:
    parser=Probe()
    parser.feed(path.read_text(encoding="utf-8"))
    duplicates=sorted({x for x in parser.ids if parser.ids.count(x)>1})
    if duplicates: raise SystemExit(f"FAIL: duplicate IDs in {path}: {duplicates}")
    probes[path]=parser

def require(ok,msg):
    if not ok: raise SystemExit(f"FAIL: {msg}")
    print(f"PASS: {msg}")

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

# The project directory is editable through content/projects.json. Keep its
# optional artwork metadata and destination pages consistent with the editor.
project_data_path = ROOT / "content" / "projects.json"
project_editor_path = ROOT / ".pages.yml"
project_script_path = ROOT / "scripts" / "projects.js"
project_data = json.loads(project_data_path.read_text(encoding="utf-8"))
require(project_script_path.is_file(), "project directory renderer exists")
require('src="scripts/projects.js"' in (ROOT / "projects.html").read_text(encoding="utf-8"), "project directory loads its renderer")
require("image_alt" in project_editor_path.read_text(encoding="utf-8") and "name: image" in project_editor_path.read_text(encoding="utf-8"), "content editor supports project artwork and alternative text")
require(len(project_data) == 4, "project content preserves the three linked projects and future entry")
project_titles = [entry.get("title") for entry in project_data]
require(len(project_titles) == len(set(project_titles)), "project content titles are unique")
for entry in project_data:
    require(bool(entry.get("title")) and bool(entry.get("description")), "each project entry has a title and description")
    if entry.get("slug"):
        require((ROOT / "projects" / (entry["slug"] + ".html")).is_file(), f"project content destination exists: {entry['slug']}")
    image = entry.get("image", "")
    if image:
        require(bool(entry.get("image_alt", "").strip()), f"project artwork has alternative text: {entry['title']}")
        image_path = ROOT / image.lstrip("/")
        require(image_path.is_file(), f"project artwork file exists: {entry['title']}")

print(f"Static checks completed for {len(pages)} HTML pages.")
