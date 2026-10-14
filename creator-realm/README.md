# Kaevoryn Creator's Realm — Prototype

**Status:** Concept prototype / not production-ready  
**Branch:** `prototype/creators-realm-v1`  
**Pull request:** [#16 — Add interactive Creator's Realm prototype](https://github.com/Kaevoryn-Studios/Website/pull/16)

## What this prototype does

Open `index.html` in a modern browser. The prototype now starts with an owner sign-in gate connected to the dedicated Creator Realm Supabase project.

- Edit the sample homepage title, tagline, supporting copy, and portal label.
- Adjust the accent color and Core glow intensity.
- Toggle particles and reduced motion.
- Switch between phone and desktop preview sizes.
- Enter preview mode to pause the editing controls.
- Undo recent control changes.
- Manage multiple named projects in the local Creation Vault.
- Save a draft in the current browser's local storage.
- Sign in with the allowlisted studio owner account.
- Save private cloud revisions to the separate Supabase project and load the latest revision from Cloud Drafts.
- Export a JSON draft file and import that file on another device.
- Try sample Imagination Companion suggestions.

## Important limitations

This is an **early connected prototype, not production-ready**. Draft data is protected by Supabase Auth, a private owner allowlist, and RLS; the static HTML itself is not secret.

- Owner authentication and cloud draft save/load are connected on this branch but still require manual end-to-end owner testing.
- The Imagination Companion uses sample responses; it does not call an AI service.
- The Creation Vault remains local. Use Cloud Drafts for the separately saved server-side revisions.
- Publishing and deployment are intentionally not connected.
- The demo edits sample content only and does not modify the public Kaevoryn website.

Export/import remains a manual bridge between devices. Keep exported JSON files in a private location.

## Quick manual test checklist

1. Open the page on a phone and on a desktop browser.
2. Change the title and supporting message; confirm the preview updates.
3. Change the accent color and Core glow; confirm the visual changes.
4. Toggle particles and reduced motion.
5. Switch phone/desktop preview and enter/exit preview mode.
6. Use Undo after changing a control.
7. Save a draft, refresh the page, and confirm it reloads in that browser.
8. Export a JSON file; import it in another browser/device and confirm the values are restored.
9. Try importing an unrelated or malformed JSON file; the page should reject it.
10. Confirm that no control publishes or changes the live site.

## Security acceptance checklist

See [`SECURITY_ACCEPTANCE_CHECKLIST.md`](SECURITY_ACCEPTANCE_CHECKLIST.md) for the backend identity, owner-isolation, publishing-guard, rollback, and release-gate checks. This checklist is a plan and is not yet executed against a live backend.

## Website integration contract

See [`INTEGRATION_CONTRACT.md`](INTEGRATION_CONTRACT.md) for the intended website route, navigation safety, draft-to-preview-to-approval boundaries, supported first-release fields, and acceptance checklist. The public site's navigation must remain unchanged until the connected prototype passes manual owner testing and the production integration is reviewed; GitHub Pages alone cannot make a page private.

## Prepared backend work

- `SCHEMA.sql` documents the owner-allowlisted projects and revision tables with RLS and explicit grants.
- `PRIVATE_BACKEND_SETUP.md` records the dedicated project, owner allowlist, integration status, and remaining security checks.
- The separate Kaevoryn Creator Realm Supabase project is connected on this prototype branch. TikNation's database is not reused.

## Production path

### Phase A — Foundation
- Decide on an authentication provider after checking current free-tier terms.
- Enforce owner access on the server; a hidden URL or client-side check is not security.
- Keep secrets and privileged tokens out of public HTML and JavaScript.
- Define a private draft schema and server-side validation.

### Phase B — Real editing
- Define the supported editable page sections and component schema.
- Store revisions separately from the public version.
- Add preview builds and automated checks.
- Make AI changes structured proposals, not arbitrary direct writes.

### Phase C — Controlled publishing
- Require explicit owner approval of the exact revision.
- Deploy only an approved, tested revision.
- Preserve the last known-good version and document rollback.
- Keep audit records for approval and deployment actions.

## Release safety

Do not merge this prototype into the default branch or enable publishing solely because the interface looks complete. Review it, test it on actual devices, and implement the production security and deployment boundaries first.
