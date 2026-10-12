# Creator Control Center — Security Test Plan

**Status: 🧪 Planned test plan. No production backend is connected and no security test here is claimed as passed.**

This plan is for the future private Kaevoryn Studios Creator Control Center. Keep the current browser-only prototype free of passwords, access tokens, recovery codes, and sensitive private material.

## Environment and separation

- [ ] Use a dedicated Kaevoryn Supabase organization/project; do not repurpose the existing TikNation project.
- [ ] Confirm the project owner, region, pricing, recovery, and backup terms before provisioning.
- [ ] Keep development/test data separate from any real creator records.
- [ ] Keep service-role keys, database passwords, deployment credentials, and signing secrets out of GitHub and all browser bundles.
- [ ] Verify the public GitHub Pages site exposes no private Creator Control Center data or secrets.

## Authentication tests

- [ ] Unauthenticated visitors cannot access private entries or administrative endpoints.
- [ ] Email sign-in and username mapping resolve only to the intended account; usernames are not treated as secrets.
- [ ] Incorrect credentials, rate limits, password reset, account recovery, sign-out, and session expiry behave safely.
- [ ] Passkeys/platform authenticators work where supported, with an accessible secure fallback.
- [ ] Face, fingerprint, or iris verification is handled only by the platform authenticator; the application never receives or stores raw biometric scans/templates.
- [ ] No public self-service registration can create an administrator account.
- [ ] Sensitive owner actions require a fresh authentication/MFA step where appropriate.

## Database authorization tests

- [ ] Row Level Security is enabled on every table exposed to the application.
- [ ] Anonymous requests cannot select, insert, update, or delete private creator records.
- [ ] An authenticated non-owner cannot read or alter owner records.
- [ ] The owner can perform only the intended actions on their own records.
- [ ] Attempts to change owner IDs, roles, status values, or approval state are rejected unless explicitly authorized.
- [ ] Tests exercise both allowed and denied paths; do not rely on hidden UI controls.
- [ ] Security advisor findings are reviewed after schema or policy changes.

## Data validation and reliability

- [ ] Reject unknown categories and statuses; use only the seven official Kaevoryn statuses.
- [ ] Validate and limit title, description, notes, and link fields on the server.
- [ ] Treat imported JSON and all client input as untrusted.
- [ ] Handle failed saves and concurrent edits without falsely reporting success or silently discarding newer work.
- [ ] Verify backup export and restore in a non-production test; document retention and deletion.
- [ ] Logs never include passwords, access tokens, recovery secrets, or raw biometric data.

## Publishing and launch gates

- [ ] Draft edits do not change the public site.
- [ ] Publishing requires a preview and explicit owner approval.
- [ ] Publishing runs server-side with a narrowly scoped credential unavailable to the browser.
- [ ] Restore a backup successfully before storing important private work.
- [ ] Test mobile layout, keyboard-only navigation, screen readers, contrast, and reduced motion.
- [ ] Document privacy, data export/deletion, incident recovery, and account ownership.
- [ ] Complete a final review before entering real private content or enabling production publishing.

## Current next step

Create a dedicated Kaevoryn organization in Supabase first. The available workspace currently shows an existing TikNation organization/project, which should remain untouched. After the dedicated organization exists, inspect its plan and permissions, check the exact cost for a project, and obtain explicit confirmation of that cost before provisioning. No project, schema, or production data should be created or changed before those checks.
