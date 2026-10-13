#!/usr/bin/env python3
"""Focused accessibility regression checks for standalone Kaevoryn pages."""
from contextlib import contextmanager
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
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
    page = browser.new_page(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
    page.goto(url + "infinity-ai.html", wait_until="networkidle")

    require(page.locator(".skip-link").count() == 1, "Infinity Vision AI provides a skip link")
    page.keyboard.press("Tab")
    require(page.locator(".skip-link").evaluate("(el) => el === document.activeElement"), "skip link receives the first keyboard focus")
    require(page.locator(".skip-link").is_visible(), "skip link becomes visible when focused")
    require(page.locator("nav[aria-label='Primary navigation']").count() == 1, "navigation landmark has an accessible label")
    require(page.locator(".stars[aria-hidden='true']").count() == 1, "decorative starfield is hidden from assistive technology")
    require(page.locator("main#main-content h1").is_visible(), "skip-link destination contains the page heading")
    animation = page.locator(".core").evaluate("(el) => getComputedStyle(el, '::before').animationName")
    require(animation == "none", "AI core pulse animation respects reduced-motion preference")
    scroll_behavior = page.locator("html").evaluate("(el) => getComputedStyle(el).scrollBehavior")
    require(scroll_behavior == "auto", "smooth scrolling is disabled for reduced-motion preference")

    browser.close()
print("Infinity Vision AI accessibility checks completed.")
