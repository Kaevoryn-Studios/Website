const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "..", "index.html"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "..", "manifest.webmanifest"), "utf8"));
const worker = fs.readFileSync(path.join(root, "..", "sw.js"), "utf8");

test("embedded Creator Desk JavaScript parses", () => {
  const match = html.match(/<script>([\s\S]*?)<\/script>/i);
  assert.ok(match, "expected an embedded script");
  assert.doesNotThrow(() => new vm.Script(match[1]));
});

test("HTML IDs are unique", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, "duplicate id attributes break labels and controls");
});

test("all seven official Kaevoryn statuses are available", () => {
  for (const status of [
    "💡 Concept", "🔭 Exploring", "🧪 Prototype", "🧩 Planned",
    "🛠️ In Development", "✅ Released", "⏳ Future"
  ]) assert.ok(html.includes(status), "missing official status: " + status);
});

test("mobile install controls and offline shell are wired", () => {
  assert.equal((html.match(/id="installBtn"/g) || []).length, 1);
  assert.match(html, /beforeinstallprompt/);
  assert.match(html, /register\("\.\/sw\.js"\)/);
  assert.match(manifest.start_url, /^\.\//);
  assert.equal(manifest.display, "standalone");
  for (const asset of ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"]) {
    assert.ok(worker.includes(JSON.stringify(asset)), "offline shell missing " + asset);
  }
});

test("project references use GitHub Pages project-site-relative paths", () => {
  assert.match(html, /fetch\("\.\.\/content\/projects\.json"\)/);
  assert.match(html, /"\.\.\/projects\/"\+p\.slug\+"\.html"/);
  assert.doesNotMatch(html, /fetch\("\.\.\/\.\.\/content\/projects\.json"\)/);
});

test("save failure recovery guards are present", () => {
  assert.ok(html.includes("if(!persist()){entries=previousEntries;render();notify(\"Could not save this entry"));
  assert.ok(html.includes("if(!persist()){entries=previousEntries;hiddenSiteProjects=previousHidden;render();notify(\"Could not save the deletion"));
  assert.ok(html.includes("if(!persist()){entries=previousEntries;hiddenSiteProjects=previousHidden;render();notify(\"Import could not be saved"));
});

test("backup carries the hidden website-reference list", () => {
  assert.ok(html.includes("hiddenSiteProjects:[...hiddenSiteProjects]"));
  assert.ok(html.includes("data.hiddenSiteProjects.filter(x=>typeof x===\"string\")"));
});
