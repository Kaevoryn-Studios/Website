#!/usr/bin/env python3
"""Validate the project directory data and its linked project pages."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "content" / "projects.json"

try:
    projects = json.loads(DATA.read_text(encoding="utf-8"))
except (OSError, json.JSONDecodeError) as exc:
    raise SystemExit(f"FAIL: content/projects.json is readable valid JSON: {exc}")

def require(ok, message):
    if not ok:
        raise SystemExit(f"FAIL: {message}")
    print(f"PASS: {message}")

require(isinstance(projects, list) and bool(projects), "project directory is a non-empty JSON list")

seen_slugs = set()
seen_titles = set()
for index, project in enumerate(projects, start=1):
    require(isinstance(project, dict), f"project entry {index} is an object")
    for field in ("category", "title", "description"):
        require(isinstance(project.get(field), str) and bool(project[field].strip()),
                f"project entry {index} has a non-empty {field}")
    title = project["title"].strip().casefold()
    require(title not in seen_titles, f"project title is unique: {project['title']}")
    seen_titles.add(title)

    slug = project.get("slug")
    if slug is None or not str(slug).strip():
        # Some future/teaser entries intentionally have no destination page yet.
        print(f"INFO: {project['title']} is a teaser without a project page slug.")
        continue

    require(isinstance(slug, str) and slug == slug.strip(),
            f"project slug is a clean string: {project['title']}")
    require(slug not in (".", "..") and "/" not in slug and "\\" not in slug,
            f"project slug is a single safe path segment: {slug}")
    require(slug not in seen_slugs, f"project slug is unique: {slug}")
    seen_slugs.add(slug)

    page = ROOT / "projects" / f"{slug}.html"
    require(page.is_file(), f"project page exists for {project['title']}: {page.relative_to(ROOT)}")
    html = page.read_text(encoding="utf-8")
    require("<title>" in html and "</title>" in html,
            f"project page has a title element: {project['title']}")
    require("<h1" in html, f"project page has a primary heading: {project['title']}")

print(f"Project content checks completed for {len(projects)} entries and {len(seen_slugs)} linked pages.")
