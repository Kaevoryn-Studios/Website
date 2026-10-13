#!/usr/bin/env python3
"""Static regression checks for the multi-page Kaevoryn Studios website."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse
import re
import xml.etree.ElementTree as ET

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
            target=(path.parent/href.split("#",1)[0].split("?",1)[0]).resolve()
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

# Sitemap checks catch malformed XML, duplicate entries, and URLs that point to
# pages that do not exist in this GitHub Pages repository.
sitemap_path = ROOT / "sitemap.xml"
sitemap_ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
try:
    sitemap = ET.parse(sitemap_path).getroot()
except (ET.ParseError, OSError) as exc:
    raise SystemExit(f"FAIL: sitemap.xml is valid XML: {exc}")
root_tag = "{http://www.sitemaps.org/schemas/sitemap/0.9}urlset"
require(sitemap.tag == root_tag, "sitemap uses the standard urlset root element")
locations = [node.text.strip() for node in sitemap.findall("sm:url/sm:loc", sitemap_ns) if node.text and node.text.strip()]
require(bool(locations), "sitemap contains at least one URL")
require(len(locations) == len(set(locations)), "sitemap URLs are unique")
site_prefix = "https://kaevoryn-studios.github.io/Website/"
for location in locations:
    parsed = urlparse(location)
    require(location.startswith(site_prefix) and parsed.scheme == "https" and parsed.netloc == "kaevoryn-studios.github.io", f"sitemap URL uses the canonical GitHub Pages origin: {location}")
    require(not parsed.query and not parsed.fragment, f"sitemap URL has no query string or fragment: {location}")
    relative = unquote(parsed.path[len("/Website/"):])
    target = (ROOT / relative if relative else ROOT / "index.html").resolve()
    require(target == ROOT.resolve() or ROOT.resolve() in target.parents, f"sitemap URL stays inside the repository: {location}")
    if target.is_dir():
        target = target / "index.html"
    require(target.is_file(), f"sitemap URL resolves to a repository page: {location}")

robots_path = ROOT / "robots.txt"
robots = robots_path.read_text(encoding="utf-8") if robots_path.is_file() else ""
require("Sitemap: https://kaevoryn-studios.github.io/Website/sitemap.xml" in robots, "robots.txt advertises the canonical sitemap")
print(f"Static checks completed for {len(pages)} HTML pages and {len(locations)} sitemap URLs.")
