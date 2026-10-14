# Creator's Realm — Website integration contract

**Status:** Implementation specification for the draft PR only. Nothing in this document changes the live site.

## Goal

Integrate Creator's Realm into the existing single Kaevoryn Studios website. It is not a separate public project site and it is not part of TikNation.

## Route and navigation

- Intended website-relative route: `/creator-realm/` (GitHub Pages project-site deployments may need the repository base path).
- Keep the current public homepage and navigation unchanged until private authentication and authorization have been implemented and tested.
- Do not add a public navigation link to the prototype while it has no authentication. A hard-to-guess URL is not access control.
- Once the owner gate exists, provide an owner-only entry point that works on phone and desktop. Unauthenticated visitors should be sent to sign-in and then returned to the Realm only after the server-backed session is validated.
- Never imply that hiding the route or checking a browser-side flag makes the Realm private.

## Editing contract

1. The visual editor changes a local draft model only.
2. Save creates or updates a draft revision, never the production homepage.
3. Preview renders one identified revision in an isolated preview surface.
4. Validation checks supported fields, links, asset references, accessibility basics, and mobile overflow.
5. The owner sees the exact revision ID and a before/after summary before approving.
6. Publishing is unavailable unless the authenticated server confirms the owner identity, the revision is valid, and explicit approval was recorded for that same revision.
7. A publish workflow must keep credentials server-side, deploy only the approved revision, record the deployment result, and preserve a rollback target.

## Supported first-release fields

Start with a deliberately small, validated allowlist: homepage title, tagline, supporting copy, selected portal labels/links, accent color, Core glow intensity, particles, and reduced-motion preference. Do not allow arbitrary HTML, JavaScript, shell commands, or unvalidated deployment paths from the visual editor or AI.

## Data boundaries

- Public website: the current committed files on the default branch.
- Private draft: owner-only database records and approved asset references.
- Preview: generated from one draft revision without changing production.
- Production: changed only by a controlled deployment workflow after owner approval.
- AI: returns structured proposals; it cannot access deployment credentials or publish directly.
- Exported JSON: manual transfer only until private cloud sync is implemented; treat it as sensitive.

## Integration acceptance checklist

- [ ] Public site remains byte-for-byte unchanged until an approved deployment is intentionally made.
- [ ] Route respects the GitHub Pages base path and works when opened directly.
- [ ] Unauthenticated and non-owner requests cannot read or mutate drafts.
- [ ] No service-role key, GitHub write token, or AI secret appears in browser code or public repository files.
- [ ] Phone layout works at 320px and wider; desktop layout remains usable.
- [ ] Preview identifies the revision and never writes to production.
- [ ] Publish is disabled by default and fails closed if auth, validation, or approval is missing.
- [ ] Rollback to the last known-good deployment is documented and tested.

## Platform limitation

GitHub Pages serves static files; it does not provide private page access control by itself. The Realm's security must come from a separate authentication and server-side authorization layer. Until that layer is configured and tested, this remains a prototype, not a private production editor.
