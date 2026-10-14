# Kaevoryn Creator's Realm — Prototype

**Status:** Concept prototype / not production-ready  
**Branch:** `prototype/creators-realm-v1`  
**Pull request:** [#16 — Add interactive Creator's Realm prototype](https://github.com/Kaevoryn-Studios/Website/pull/16)

## What this prototype does

Open `index.html` in a modern browser to explore the responsive design sandbox.

- Edit the sample homepage title, tagline, supporting copy, and portal label.
- Adjust the accent color and Core glow intensity.
- Toggle particles and reduced motion.
- Switch between phone and desktop preview sizes.
- Enter preview mode to pause the editing controls.
- Undo recent control changes.
- Save a draft in the current browser's local storage.
- Export a JSON draft file and import that file on another device.
- Try sample Imagination Companion suggestions.

## Important limitations

This is **not yet a secure Creator's Realm** and must not be presented as one.

- There is no authentication or owner authorization.
- There is no server-side draft store or cross-device sync.
- The Imagination Companion uses sample responses; it does not call an AI service.
- The project library is a placeholder.
- Publishing and deployment are intentionally not connected.
- The demo edits sample content only and does not modify the public Kaevoryn website.

Export/import provides a manual bridge between devices, not secure cloud synchronization. Treat exported JSON files as ordinary files and keep them in a private location.

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

## Prepared backend work

- `SCHEMA.sql` is a reviewed draft for owner-allowlisted projects and revisions with RLS and explicit grants.
- `PRIVATE_BACKEND_SETUP.md` explains how to connect a separate Supabase project safely.
- Neither file has been applied to a live project. The only currently connected Supabase project found was TikNation, which is intentionally not reused.

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
