# Private backend setup — not yet connected

This document prepares the backend step for Creator's Realm. No Supabase project was created, and `SCHEMA.sql` has not been run.

## Critical separation

Create a **separate** Supabase project for Kaevoryn Creator's Realm. Do not reuse the TikNation project. A public GitHub Pages frontend must never contain a Supabase `service_role` key or any secret key.

Supabase's current security guidance separates Data API grants from Row Level Security (RLS): grants decide which roles can reach a table, and RLS decides which rows those roles can read or change. Both are required. Read the current [Securing your API guide](https://supabase.com/docs/guides/api/securing-your-api) and [RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security) before applying the schema.

## Planned setup sequence

1. Create a dedicated project named **Kaevoryn Creator Realm** in the chosen Supabase organization. Check the Dashboard's current project cost/free-plan limits before confirming creation.
2. Create or invite only the owner's Auth account.
3. Disable public sign-ups after the owner account exists. This project is not for public registration.
4. Open the new project's SQL Editor and review/run `SCHEMA.sql` once.
5. In Authentication → Users, copy the owner's exact user UUID.
6. Replace `<OWNER_AUTH_USER_UUID>` in the following statement with that UUID and run it in the SQL Editor:

   ```sql
   insert into private.creator_realm_owners (user_id)
   values ('<OWNER_AUTH_USER_UUID>');
   ```

   This allowlist insert is intentionally separate from the schema so the owner identity is not guessed or hardcoded in repository files.

7. In the project's Data API settings, confirm the `public` schema is exposed for the client API if the frontend will use `supabase-js`. The schema grants no table access to `anon`, and RLS plus the private owner allowlist restricts authenticated access.
8. Run Supabase Security Advisors and verify anonymous requests cannot read or write either table, a signed-in non-owner is denied, and the allowlisted owner can save/read a draft. Also verify an authenticated browser request cannot set either a project or revision to `published` or set `published_at`; the schema's trigger should reject that attempt.
9. Only after those checks, connect a **publishable** key and project URL to the frontend. Publishable keys are designed to be exposed in browser apps; secret/service-role keys are not.
10. Keep actual publishing disabled until the release workflow enforces explicit approval of the exact revision and preserves rollback.

## What the schema supports

- Projects with owner, name, lifecycle status, and timestamps.
- Versioned JSON revisions linked to their parent project.
- Private owner allowlisting stored in a non-exposed schema.
- RLS policies on both public tables, with explicit minimum grants.
- Ownership checks on insert and update so the owner identifier cannot be reassigned.
- A database trigger blocks browser-authenticated clients from setting `published` or `published_at`; the trusted deployment service is the only intended publication path.

## Important limitations

- This SQL is a **prepared draft**, not an applied or verified live database migration.
- The project has not been created; therefore no login, cloud draft sync, or backend security test is active yet.
- The schema does not deploy website changes. A future publishing service must validate and deploy only an owner-approved revision.
- Do not put credentials in GitHub commits, public JavaScript, screenshots, or chat messages. Use the project's settings and secure secret storage.
