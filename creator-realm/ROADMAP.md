# Creator's Realm implementation roadmap

## Product principles

1. **Owner in control:** the AI may suggest changes but never publish without explicit approval.
2. **Drafts are separate:** editing and previewing must not mutate the public site.
3. **No-code first:** common edits should use visual controls; advanced work remains optional.
4. **Phone and desktop:** the same project model should support both.
5. **Budget-aware:** start with existing GitHub infrastructure and free tiers, but verify limits and avoid assuming AI or backend services are unlimited or free.
6. **Honest status:** label each feature as prototype, in development, or released according to what actually works.

## Milestones

### 1. Prototype — current
- [x] Responsive cinematic workspace concept
- [x] Basic visual controls for sample content and effects
- [x] Phone/desktop preview
- [x] Local browser draft save
- [x] JSON export/import for manual cross-device transfer
- [x] Sample AI companion suggestions
- [x] Publishing deliberately disconnected

### 2. Private foundation — next
- [ ] Choose an authentication provider and verify current free plan limits.
- [ ] Require verified owner identity for every private data operation.
- [ ] Create a private draft storage model and access policies.
- [ ] Add session handling, recovery, and optional multi-factor authentication.
- [ ] Never expose service-role keys, provider secrets, or write tokens in browser code.

### 3. Website editing
- [ ] Define a schema for supported editable components.
- [ ] Map editable fields to a separate draft, not directly to production files.
- [ ] Add validation, undo history, revision labels, and autosave feedback.
- [ ] Add asset library metadata and safe image replacement.
- [ ] Make the visual editor keyboard-accessible and touch-friendly.

### 4. AI companion
- [ ] Connect an AI service only after pricing, privacy, and data retention are reviewed.
- [ ] Convert prompts into a structured proposed-change list.
- [ ] Show before/after changes and allow each proposal to be accepted or rejected.
- [ ] Validate generated output before it enters a draft.
- [ ] Keep AI credentials server-side.

### 5. Preview and publishing
- [ ] Build an isolated preview for a selected revision.
- [ ] Run link, asset, accessibility, and build checks.
- [ ] Require an explicit confirmation naming the revision being published.
- [ ] Deploy through a controlled workflow with least-privilege credentials.
- [ ] Preserve and test rollback to the last known-good version.
- [ ] Record approval and deployment metadata.

## Definition of done for a production release

- Private routes and APIs enforce authorization server-side.
- Drafts cannot be read or changed by anonymous users.
- Public website content remains unchanged until an owner approves a tested revision.
- Secrets do not appear in repository content, client bundles, or logs.
- The owner can recover a previous known-good revision.
- Mobile and desktop flows pass the manual test checklist.
- Current service costs and free-tier limits are documented.
