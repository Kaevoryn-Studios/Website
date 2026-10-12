#!/usr/bin/env python3
"""Real-browser responsive and interaction checks for the Kaevoryn homepage."""
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


with local_site() as url, sync_playwright() as p:
    browser = p.chromium.launch()
    for label, width, height in (
        ("small phone", 320, 720),
        ("phone", 390, 844),
        ("tablet", 768, 1024),
        ("desktop", 1440, 900),
    ):
        page = browser.new_page(viewport={"width": width, "height": height},
                                reduced_motion="reduce")
        page.goto(url, wait_until="networkidle")
        page.locator("nav[aria-label='Primary navigation']").wait_for()
        require(page.locator("#main-content").is_visible(),
                f"{label}: main content is visible")
        require(page.locator("nav a[href='#worlds']").is_visible(),
                f"{label}: project navigation is visible")
        dimensions = page.evaluate("""() => ({
          viewport: document.documentElement.clientWidth,
          document: document.documentElement.scrollWidth
        })""")
        require(dimensions["document"] <= dimensions["viewport"] + 1,
                f"{label}: no horizontal page overflow "
                f"({dimensions['document']}px document / {dimensions['viewport']}px viewport)")

        page.get_by_role("button", name="DISCOVER THE INVITATION").click()
        require(page.locator("#golden").is_visible(),
                f"{label}: hero invitation action reveals the invitation section")
        page.locator(".golden-ticket").click()
        require(page.locator("#golden-message .dreamer-path").count() == 4,
                f"{label}: invitation ticket reveals four dreamer paths")
        page.locator(".dreamer-path[data-path='World Builder']").click()
        require("World Builder" in page.locator("#dreamer-selection").inner_text(),
                f"{label}: selecting a path updates the on-page confirmation")
        contact_href = page.locator("#dreamer-contact").get_attribute("href")
        require("World%20Builder" in contact_href or "World+Builder" in contact_href,
                f"{label}: contact link carries the selected dreamer path")
        page.close()
    browser.close()

print("Browser checks completed.")
