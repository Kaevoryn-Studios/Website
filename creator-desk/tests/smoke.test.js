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

test("entry action buttons have item-specific accessible names", () => {
  assert.match(html, /edit\.setAttribute\("aria-label","Edit "\+item\.title\)/);
  assert.match(html, /del\.setAttribute\("aria-label","Delete "\+item\.title\)/);
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
  assert.ok(html.includes("The entry has been restored."));
  assert.ok(html.includes("if(!persist()){entries=previousEntries;hiddenSiteProjects=previousHidden;render();notify(\"Import could not be saved"));
});

test("failed hidden-reference backup save rolls imported entries back", () => {
  assert.match(html, /Import could not save the website-reference list/);
  assert.match(html, /localStorage\.setItem\(KEY,JSON\.stringify\(entries\)\)/);
  assert.match(html, /entries=previousEntries;hiddenSiteProjects=previousHidden/);
});

test("backup import limits size and count and sanitizes imported fields", () => {
  assert.match(html, /file\.size>2\*1024\*1024/);
  assert.match(html, /incoming\.length>1000/);
  assert.match(html, /title:x\.title\.trim\(\)\.slice\(0,140\)/);
  assert.match(html, /notes:safe\(x\.notes\)\.slice\(0,4000\)/);
  assert.match(html, /source:"local"/);
});

test("imported hidden website references are bounded", () => {
  assert.match(html, /data\.hiddenSiteProjects\.filter\(x=>typeof x==="string"&&x\.length<=200\)\.slice\(0,1000\)/);
});

test("imported links are restricted to web URLs or relative website references", () => {
  assert.match(html, /startsWith\("http:\/\/"\)/);
  assert.match(html, /startsWith\("https:\/\/"\)/);
  assert.match(html, /startsWith\("\.\.\/"\)/);
});

test("backup carries the hidden website-reference list", () => {
  assert.ok(html.includes("hiddenSiteProjects:[...hiddenSiteProjects]"));
  assert.ok(html.includes("data.hiddenSiteProjects.filter(x=>typeof x===\"string\"&&x.length<=200).slice(0,1000)"));
});

test("security documentation clearly labels authentication and backend as not implemented", () => {
  const auth = fs.readFileSync(path.join(root, "..", "AUTHENTICATION-DESIGN.md"), "utf8");
  const backend = fs.readFileSync(path.join(root, "..", "BACKEND-ARCHITECTURE.md"), "utf8");
  const readiness = fs.readFileSync(path.join(root, "..", "PRODUCTION-READINESS.md"), "utf8");
  assert.match(auth, /No login has been implemented/i);
  assert.match(backend, /not a configured service/i);
  assert.match(readiness, /no user authentication or server-side database/i);
});

test("production checklist links the security test plan", () => {
  const readiness = fs.readFileSync(path.join(root, "..", "PRODUCTION-READINESS.md"), "utf8");
  const securityPlan = fs.readFileSync(path.join(root, "..", "SECURITY-TEST-PLAN.md"), "utf8");
  assert.match(readiness, /SECURITY-TEST-PLAN\.md/);
  assert.match(securityPlan, /Database authorization tests/);
  assert.match(securityPlan, /Publishing and launch gates/);
});

test("entry text is rendered as text rather than interpreted as HTML", () => {
  assert.match(html, /function el\(tag,cls,text\)\{const node=document\.createElement\(tag\);if\(cls\)node\.className=cls;if\(text!==undefined\)node\.textContent=text;return node\}/);
  assert.doesNotMatch(html, /\.innerHTML\s*=/, "untrusted entry content must not be parsed as HTML");
});

test("external entry links open without granting the new tab opener access", () => {
  assert.match(html, /a\.target="_blank";a\.rel="noopener noreferrer"/);
  assert.match(html, /if\(\/\^https\?:\\\/\\\/\/i\.test\(valid\)\|\|valid\.startsWith\("\.\.\/"\)\)/);
});
