# Creator Realm private backend — current status

## Connected components

- Dedicated Supabase project: **Kaevoryn Creator Realm** (project ref: itcbyurixjfszmktlwnh), separate from TikNation.
- Region: US East.
- Owner Auth account: contact.kaevorynstudios@gmail.com.
- Owner UUID is registered in the private.creator_realm_owners table; the browser must not hardcode that UUID.
- Draft projects and revision tables have RLS enabled and require both the authenticated owner session and matching auth.uid().
- The owner-status RPC is public.creator_realm_owner_status(). It uses invoker security and calls the private allowlist helper; only authenticated sessions can execute it.
- The prototype file creator-realm/index.html on branch prototype/creators-realm-v1 now contains the owner sign-in gate and client-side draft save/load integration using the project's publishable key. A publishable key is intended for browser use; never put a secret or service-role key in the repository.
- Saving a draft writes a new JSON revision. Loading a draft reads the latest revision. Neither action changes the public homepage.

## Required security boundaries

- GitHub Pages is a static host. The sign-in gate improves the owner experience, but it does not make the HTML file itself secret. Actual draft data is protected by Supabase Auth, the private owner allowlist, and RLS.
- Public registration is not offered by the prototype UI. The allowlist and RLS must remain the real authorization boundary even if an unapproved user obtains a Supabase Auth account.
- The public website's default branch has not been changed by this prototype work. Do not merge PR #16 until the owner login, cloud save/load, responsive tests, and security checks are reviewed.
- The publish action remains disabled. A future publishing service must validate the exact approved revision, require explicit owner approval, deploy server-side, record the result, and preserve a rollback target.
- Do not store passwords, service-role keys, GitHub write tokens, or AI secrets in GitHub files, public JavaScript, screenshots, or chat.

## Manual owner test

1. Open the prototype branch preview only after the GitHub checks pass.
2. Sign in using the owner email and the password saved in your password manager.
3. Confirm the owner gate disappears and the header reports an owner session.
4. Change a visible field and tap **Save to cloud**.
5. Confirm a revision number appears. Open **Cloud drafts**, load the saved draft, and verify the change returns.
6. Sign out and confirm the sign-in gate returns.
7. Do not try publishing; it is intentionally unavailable.

## Security follow-up

Run Supabase Security Advisors after schema or policy changes. The informational warning for private.creator_realm_owners having RLS but no direct policies is intentional: client roles have no direct table grants; the narrowly scoped private helper performs the allowlist check. Enable Supabase leaked-password protection in Auth security settings when available for this project. Keep the database trigger that rejects browser-authenticated attempts to set published or published_at.

## Cost and scope

The project creation was checked at **$0/month at creation time**. This is not a guarantee that all usage or future services will always be free. The current integration covers owner authentication and private cloud draft storage only; live AI and publishing are not connected.
