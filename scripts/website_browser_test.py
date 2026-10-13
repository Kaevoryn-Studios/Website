#!/usr/bin/env python3
"""Real-browser checks for the multi-page Kaevoryn Studios website."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from threading import Thread
from contextlib import contextmanager
from urllib.parse import urlparse, parse_qs
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

class QuietHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def log_message(self, *_args):
        pass

@contextmanager
def local_site():
    server = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_port}/"
    finally:
        server.shutdown()
        thread.join(timeout=2)
        server.server_close()

def require(condition, message):
    if not condition:
        raise AssertionError(message)
    print(f"PASS: {message}")

with local_site() as url, sync_playwright() as p:
    browser = p.chromium.launch()
    for label, width, height in (("small phone",320,720),("phone",390,844),("tablet",768,1024),("desktop",1440,900)):
        page = browser.new_page(viewport={"width":width,"height":height}, reduced_motion="reduce")
        page.goto(url, wait_until="networkidle")
        require(page.locator("nav[aria-label='Primary navigation']").is_visible(), f"{label}: primary navigation is visible")
        require(page.locator('nav[aria-label="Primary navigation"] a[aria-current="page"][href="index.html"]').count() == 1, f"{label}: homepage is identified as the current page")
        page.keyboard.press("Tab")
        require(page.locator(".skip-link").evaluate("(el) => el === document.activeElement"), f"{label}: keyboard users can focus the skip link first")
        require(page.locator(".skip-link").is_visible(), f"{label}: focused skip link is visible")
        require(page.locator("#main-content").is_visible(), f"{label}: main content is visible")
        for href in ("projects.html","explore.html","vision.html","invitation.html","contact.html"):
            link = page.locator(f'nav[aria-label="Primary navigation"] a[href="{href}"]')
            require(link.is_visible(), f"{label}: {href} has a visible navigation link")
            require(link.get_attribute("href") == href, f"{label}: {href} navigates to a separate page, not a homepage anchor")
        page.locator('nav[aria-label="Primary navigation"] a[href="projects.html"]').click()
        require(urlparse(page.url).path.endswith("/projects.html") and not urlparse(page.url).fragment, f"{label}: clicking Projects opens a separate page without anchor scrolling")
        page.goto(url, wait_until="networkidle")
        require(page.locator(".portal-card").count() == 6, f"{label}: homepage presents six clickable destinations")
        dims = page.evaluate("() => ({viewport:document.documentElement.clientWidth,document:document.documentElement.scrollWidth})")
        require(dims["document"] <= dims["viewport"] + 1, f"{label}: no horizontal overflow ({dims['document']}px / {dims['viewport']}px)")
        page.goto(url+"projects.html", wait_until="networkidle")
        require(page.locator('nav[aria-label="Primary navigation"] a[aria-current="page"][href="projects.html"]').count() == 1, f"{label}: project directory is identified as the current page")
        for path in ("projects/infinity-vision-ai.html","projects/escape-from-the-nightmare-forge.html","projects/infinity-motion-studio.html"):
            require(page.locator(f'a[href="{path}"]').count() == 1, f"{label}: project directory links to {path}")
        require(page.locator(".project-grid").get_attribute("data-projects-rendered") == "true", f"{label}: project directory renders editable content data")
        require(page.locator(".project-card").count() == 4, f"{label}: project directory renders all four content entries")
        require(page.locator(".project-card h2").all_text_contents() == ["Infinity Vision AI", "Escape From The Nightmare Forge", "Infinity Motion Studio", "Coming Soon"], f"{label}: project titles match the content directory")
        require(page.locator(".project-card").last.evaluate("(el) => el.tagName.toLowerCase()") == "article", f"{label}: future project is not presented as a broken link")
        page.goto(url+"explore.html", wait_until="networkidle")
        require(page.locator('nav[aria-label="Primary navigation"] a[aria-current="page"][href="explore.html"]').count() == 1, f"{label}: Explore is identified as the current page")
        for path in ("games.html","worlds.html","music.html","shows.html","films.html","software.html"):
            require(page.locator(f'a[href="{path}"]').count() == 1, f"{label}: Explore links to {path}")
        for path in ("games.html","worlds.html","music.html","shows.html","films.html","software.html"):
            page.goto(url+path, wait_until="networkidle")
            require(page.locator('nav[aria-label="Primary navigation"] a[aria-current="location"][href="explore.html"]').count() == 1, f"{label}: {path} marks Explore as the active section")
            require(page.locator("#main-content h1").is_visible(), f"{label}: {path} has a visible main heading")
        page.goto(url+"invitation.html", wait_until="networkidle")
        page.get_by_role("button", name="ACCEPT THE INVITATION").click()
        require(page.locator(".dreamer-path").count() == 4 and page.locator("#dreamer-paths").is_visible(), f"{label}: invitation reveals four dreamer paths")
        page.locator(".dreamer-path[data-path='World Builder']").click()
        require("World Builder" in page.locator("#dreamer-selection").inner_text(), f"{label}: selected dreamer path is confirmed")
        require("path=World%20Builder" in page.locator("#dreamer-contact").get_attribute("href"), f"{label}: selected path is carried to contact")
        page.locator("#dreamer-contact").click()
        require("Your chosen path: World Builder" in page.locator("#selected-path").inner_text(), f"{label}: contact page acknowledges the selected path")
        require("World%20Builder" in page.locator("#contact-email").get_attribute("href"), f"{label}: contact email is prefilled for the selected path")
        page.close()
    browser.close()
print("Multi-page browser checks completed.")
