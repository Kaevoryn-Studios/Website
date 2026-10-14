#!/usr/bin/env python3
"""Browser smoke checks for the Creator's Realm concept prototype."""
import json
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from threading import Thread
from contextlib import contextmanager
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

with local_site() as base_url, sync_playwright() as p:
    browser = p.chromium.launch()
    for label, width, height in (("small phone", 320, 720), ("phone", 390, 844), ("tablet", 768, 1024), ("desktop", 1440, 900)):
        page = browser.new_page(viewport={"width": width, "height": height}, reduced_motion="reduce")
        page.goto(base_url + "creator-realm/index.html", wait_until="networkidle")
        require("Creator's Realm" in page.title(), f"{label}: prototype page loads")
        require(page.get_by_text("Interactive prototype — not a secure private editor yet.", exact=False).is_visible(), f"{label}: prototype limitations are visible")
        page.locator("#titleInput").fill("DREAM BEYOND")
        require(page.locator("#previewTitle").inner_text() == "DREAM BEYOND", f"{label}: title edit updates the canvas")
        page.locator("#accentInput").fill("#f3d48c")
        require(page.locator("#accentInput").input_value() == "#f3d48c", f"{label}: accent color control accepts a new color")
        page.locator("#glowInput").fill("82")
        require(page.locator("#glowValue").inner_text() == "82%", f"{label}: Core glow slider updates its value")
        page.locator("#deviceBtn").click()
        require("phone" in page.locator("#sitePreview").get_attribute("class"), f"{label}: phone preview can be enabled")
        page.locator("#deviceBtn").click()
        page.locator("#previewBtn").click()
        require(page.locator("#titleInput").is_disabled(), f"{label}: preview mode pauses editing")
        page.locator("#previewBtn").click()
        page.locator("#promptInput").fill("Make the Core feel more magical")
        page.locator("#askBtn").click()
        require(page.locator("#proposalPreview").is_visible(), f"{label}: companion shows a proposal for review")
        require(page.locator("#glowInput").input_value() == "82", f"{label}: preparing a proposal does not apply it automatically")
        page.locator("#acceptSuggestionBtn").click()
        require(page.locator("#glowInput").input_value() == "100", f"{label}: accepted proposal updates the local draft")
        with page.expect_download() as download_info:
            page.locator("#exportBtn").click()
        download = download_info.value
        require(download.suggested_filename == "kaevoryn-creator-realm-draft.json", f"{label}: draft can be exported")
        page.locator("#saveBtn").click()
        page.reload(wait_until="networkidle")
        require(page.locator("#titleInput").input_value() == "DREAM BEYOND", f"{label}: local draft survives a page reload")
        imported = {
            "format": "kaevoryn-creator-realm-draft",
            "version": 1,
            "state": {
                "title": "IMPORTED DREAM", "tagline": "CREATE THE IMPOSSIBLE",
                "copy": "A test import.", "portal": "ENTER THE REALM",
                "accent": "#b4a0ff", "glow": 64, "particles": False, "reducedMotion": True
            }
        }
        page.locator("#importFile").set_input_files({
            "name": "draft.json",
            "mimeType": "application/json",
            "buffer": json.dumps(imported).encode("utf-8")
        })
        require(page.locator("#titleInput").input_value() == "IMPORTED DREAM", f"{label}: a valid exported-style draft can be imported")
        require(page.locator("#glowInput").input_value() == "64", f"{label}: imported settings are restored")
        dims = page.evaluate("() => ({viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth})")
        require(dims["document"] <= dims["viewport"] + 1, f"{label}: no horizontal page overflow ({dims['document']}px / {dims['viewport']}px)")
        page.close()
    browser.close()
print("Creator's Realm browser checks completed.")
