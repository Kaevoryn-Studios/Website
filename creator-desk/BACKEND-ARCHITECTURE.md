# Creator Control Center — Backend Decision Record

**Status: 🧩 Exploring.** This is a provisional architecture recommendation, not a configured service or final vendor commitment.

## Recommendation to evaluate first: Supabase

Supabase is the first candidate to evaluate because the Creator Control Center needs both account authentication and a relational database with server-enforced row-level access controls. It could provide a practical path from the existing GitHub Pages site to a private application without rebuilding the public site from scratch.

This recommendation is conditional. Before choosing it for production, confirm current plan/pricing, authentication methods (especially passkeys/WebAuthn and account recovery), data region, backup/restore options, operational limits, and whether the required controls fit the project. Do not assume fingerprint, face, or iris scanning is supplied directly by the website provider; biometric verification must remain with a supported platform authenticator.

## Proposed architecture

- **Public site:** GitHub Pages continues serving the public Kaevoryn Studios website.
- **Private Creator Control Center:** a separately configured authenticated application or protected route, connected to the backend only after authentication is implemented and tested.
- **Identity:** verified email and a unique username mapped to one owner account; strong password fallback; passkey where supported; secure recovery; MFA for sensitive owner actions.
- **Database:** relational records with stable IDs, owner IDs, category, official status, title, description, working notes, optional links, and created/updated timestamps.
- **Authorization:** deny by default; enforce owner-level and later role-level access in server/database policies for every read and write. Client-side checks alone are insufficient.
- **Drafts and publishing:** private drafts stay private. Public content changes move through preview and explicit approval; publishing credentials remain server-side.
- **Backups:** export/import for portability plus provider-managed backups and a tested restore procedure before real private use.

## Initial data model (proposal only)

### profiles
- id — same stable identity ID as the auth provider
- username — unique, normalized, and not used as a secret
- display_name
- created_at, updated_at

### creator_entries
- id — generated UUID
- owner_id — references the authenticated profile
- category — one of Projects, Music & Sound, Stories, Worlds, Announcements
- status — one of Concept, Exploring, Prototype, Planned, In Development, Released, Future
- title
- description
- notes
- links — validated structured data, optional
- created_at, updated_at

### publish_requests (only when publishing is designed)
- id, owner_id, entry_id
- proposed_public_content
- approval_state — draft, awaiting approval, approved, published, or rejected
- timestamps and a non-sensitive audit trail

Do not put passwords, access tokens, recovery secrets, or raw biometric data in these tables. Password handling belongs to the identity provider; raw biometric data must stay with the device/platform.

## Security gates before real data

- [ ] Provider account is intentionally created/connected by the owner.
- [ ] Pricing, terms, region, retention, and exportability are reviewed.
- [ ] Only the owner can create/use the initial admin account; no public admin registration.
- [ ] Database policies deny unauthenticated access and cross-owner reads/writes.
- [ ] Tests prove both allowed owner access and denied unauthorised access.
- [ ] Authentication recovery, session expiry, sign-out, and MFA are tested.
- [ ] No service-role or deployment secrets appear in browser code or repository.
- [ ] Backups are restored successfully in a test.
- [ ] Draft-to-publish workflow requires an explicit approval action.
- [ ] Privacy notice, deletion/export path, accessibility, and mobile testing are complete.

## Current blocker and next action

The Supabase integration is not yet connected to this conversation, and no backend project has been provisioned. After the owner connects the integration, inspect available projects and permissions first. Do not create a billable resource, change an existing database, enable public access, or deploy anything without reviewing the exact action and its consequences with the owner.

Until then, continue safe repository-only design work and keep all changes on the existing proposal branch.
