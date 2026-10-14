# Creator's Realm — Security Acceptance Checklist

**Status:** Test plan only. No live backend is connected or verified.

Do not call Creator's Realm private or production-ready until the checks below have been run against its dedicated backend and recorded with results.

## Identity and access

- [ ] Only the intended owner account can sign in; public registration is disabled after the owner account is provisioned.
- [ ] Signed-out requests cannot read, create, update, or delete Realm projects or revisions.
- [ ] A signed-in account that is not on the private owner allowlist is denied all project and revision access.
- [ ] The owner can read and edit only the owner's own projects and revisions.
- [ ] Attempts to insert a row for another owner, change an existing owner ID, or attach a revision to another owner's project are rejected.
- [ ] The private allowlist schema is not exposed through the public Data API and has no grants for `anon` or `authenticated`.

## Publishing boundary

- [ ] An authenticated browser client cannot set a project or revision status to `published`.
- [ ] An authenticated browser client cannot set `published_at` to a non-null value.
- [ ] The database guard rejects those attempts, including when the request is otherwise authorized as the owner.
- [ ] The trusted deployment service validates owner identity, explicit approval, and the exact revision ID/hash before deployment.
- [ ] No browser bundle, repository file, issue, or log contains a service-role or other privileged secret.
- [ ] Failed validation, failed tests, missing approval, or uncertain deployment state fails closed and leaves the live site unchanged.

## Draft integrity and recovery

- [ ] Invalid JSON/content shape and unsupported fields are rejected by server-side validation.
- [ ] Each saved revision belongs to an existing project and cannot be reassigned across owners.
- [ ] Preview uses a draft revision and cannot publish it as a side effect.
- [ ] Approval is tied to the exact revision being deployed; any later edit requires fresh approval.
- [ ] The last known-good public version can be restored using a documented rollback procedure.
- [ ] Approval and deployment events record who approved which revision and when.

## Browser and device checks

- [ ] Test on a real phone and desktop browser.
- [ ] Test narrow viewport, keyboard navigation, focus visibility, and reduced-motion preference.
- [ ] Verify sign-out clears private UI state and prevents stale cached data from being shown to another session.
- [ ] Confirm exported draft files are clearly treated as private files and never uploaded publicly by default.

## Release gate

- [ ] Dedicated backend exists and is not TikNation.
- [ ] Schema reviewed and applied to the dedicated backend.
- [ ] Owner allowlist provisioned from the actual Auth user UUID.
- [ ] Security checks above pass and their results are recorded.
- [ ] Owner explicitly approves merging the prototype into the website.
- [ ] Live publishing remains disabled until a tested server-side deployment service exists.

**Current honest state:** the UI prototype and prepared schema are repository drafts. This checklist has not been executed against a live backend. Passing browser-interface tests alone does not prove backend security.
