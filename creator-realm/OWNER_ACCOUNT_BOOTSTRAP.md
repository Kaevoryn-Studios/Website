# Creator's Realm — owner account bootstrap

This guide is for the private Kaevoryn Creator Realm Supabase project only.
Project ref: `itcbyurixjfszmktlwnh`.

## Current status

- The separate Supabase project exists.
- Private draft tables and row-level security are installed.
- The private owner allowlist has no entries yet.
- No auth users exist in this project yet.
- The public website is not connected to this backend.
- Publishing is not configured and must stay disabled.

## Create the owner account

1. Open the [Creator Realm Supabase dashboard](https://supabase.com/dashboard/project/itcbyurixjfszmktlwnh).
2. In the left navigation, open **Authentication** → **Users**.
3. Choose **Add user** (not a public sign-up flow).
4. Enter the email address you personally control and set a strong, unique password. Never send the password to anyone or put it in a repository.
5. If Supabase offers an email-confirmation option, only mark the account confirmed if you intentionally want to skip the confirmation email for this private owner account.
6. Save the user, then copy the user's **UUID/ID** from the Users list. The UUID is needed to add this account to the private allowlist.

Do not enable open public sign-ups for this single-owner editor. If the dashboard requires email delivery or you are unsure about the confirmation setting, stop and ask before changing project-wide auth settings.

## Add the account to the owner allowlist

After the owner account exists, run this in the project's SQL Editor, replacing the placeholder with that account's UUID (keep the single quotes):

```sql
insert into private.creator_realm_owners (user_id)
values ('PASTE_OWNER_USER_UUID_HERE'::uuid)
on conflict (user_id) do nothing;
```

Never insert an email address or password into this table. Only the UUID belongs there. Verify that exactly one expected UUID is present, and do not share screenshots that reveal private account information.

## Security checks before connecting the website

- Confirm `private.creator_realm_owners`, `public.creator_realm_projects`, and `public.creator_realm_revisions` all have RLS enabled.
- Confirm the owner check function is in the non-public `private` schema.
- Test signed-out access and a non-owner account before using real drafts.
- Keep service-role credentials and deployment tokens server-side only.
- Keep publishing disconnected until exact-revision approval and rollback are implemented and tested.

This setup guide does not itself make the website route private. GitHub Pages serves static files publicly; private data must be protected by Supabase authorization.
