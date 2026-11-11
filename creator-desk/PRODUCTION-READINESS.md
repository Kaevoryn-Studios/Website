# Creator Desk — Production Readiness Plan

**Status: 🧩 Planned.** This document is a design checklist, not a claim that production security or backend services exist.

## Current boundary

The current Creator Desk is a browser-only prototype. It stores drafts in local storage, has no user authentication or server-side database, does not sync across devices, and cannot publish to the public website. Browser storage is not a secure private vault. Do not put credentials or sensitive material in it.

## Authentication design

See [AUTHENTICATION-DESIGN.md](./AUTHENTICATION-DESIGN.md) for the proposed owner sign-in experience, passkey/biometric boundaries, recovery, and security acceptance checklist. This is a plan only; no real login is implemented.

## Backend architecture proposal

See [BACKEND-ARCHITECTURE.md](./BACKEND-ARCHITECTURE.md) for the provisional provider evaluation, proposed data model, and security gates. Supabase is only the first candidate to evaluate; no backend has been provisioned or connected.

## Security test plan

See [SECURITY-TEST-PLAN.md](./SECURITY-TEST-PLAN.md) for explicit tests covering authentication, database authorization, data validation, backups, publishing approval, and launch gates. These are planned tests, not evidence that a production backend has passed them.

## Required before real private use

1. **Choose and configure an identity provider.** Require authenticated sessions; keep provider secrets and administrative credentials on the server, never in browser JavaScript or the public repository.
2. **Use server-side persistence.** Store records with an owner ID, validated category/status, created/updated timestamps, and a stable record ID. Enforce authorization on every read and write; hiding UI controls is not access control.
3. **Enforce least privilege.** Users may read and change only records they own or are explicitly authorized to access. Test cross-account access denial and unauthenticated requests.
4. **Validate all incoming data.** Apply a strict schema for categories, the seven official statuses, title/description/notes lengths, and optional links. Treat imported JSON as untrusted input.
5. **Make backups recoverable.** Keep user-triggered export, add server-side backups only after choosing a provider, and test restore without silently overwriting newer records. Include the hidden website-reference list in exports.
6. **Separate drafts from publishing.** Creator Desk edits must remain drafts by default. Publishing should require an explicit preview and approval, then use a server-side workflow or narrowly scoped deployment credential. Never ship a personal access token or deployment secret to the browser.
7. **Plan for failures.** Show clear save status, handle offline/conflict/storage errors, preserve unsaved edits, and avoid reporting success when a write fails.
8. **Accessibility and device testing.** Test keyboard-only use, screen readers, reduced motion, narrow mobile widths, supported browsers, installation, and offline behavior.

## Suggested delivery gates

- [ ] Create a dedicated Kaevoryn organization/project and review exact pricing before provisioning.
- [ ] Pick the backend/identity provider and review its costs, data location, and recovery options.
- [ ] Implement authenticated server endpoints and per-record authorization.
- [ ] Add schema validation and automated authorization tests.
- [ ] Add server backup/restore and conflict handling.
- [ ] Design a preview-and-approve publishing flow separate from draft editing.
- [ ] Complete mobile/accessibility/manual testing.
- [ ] Review privacy notice and retention/deletion behavior.
- [ ] Only then consider a production launch.

## Architecture decisions still open

The backend provider, authentication method, collaborator roles, backup retention, and exact public publishing workflow are not selected. Keep these decisions explicit rather than quietly committing the project to a provider or exposing private drafts.
