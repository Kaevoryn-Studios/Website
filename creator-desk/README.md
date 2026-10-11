# Kaevoryn Studios Creator Desk — Prototype

A mobile-first workspace prototype for organizing creative work across Projects, Music & Sound, Stories, Worlds, and Announcements.

## Prototype features

- Create, edit, and delete entries
- Filter by category and Kaevoryn's seven official statuses
- Search titles, descriptions, and notes
- Save entries to the current browser using local storage
- Export and import a JSON backup
- Optional home-screen installation and cached app shell on supported browsers

## Open it

After this pull request is reviewed and merged, the intended GitHub Pages route is:

`https://kaevoryn-studios.github.io/Website/creator-desk/`

This URL is not expected to work until the branch is merged and GitHub Pages has deployed it. Before that, review the source here in the pull request.

## Important limitations

This is a frontend prototype, not a production private app. It has no login, roles, server database, cloud sync, or publishing connection. Local entries are stored in the browser and do not automatically move to another device. The route is not linked in public navigation, but that does **not** make it private. Never enter passwords, credentials, or sensitive material.

The project-list import is a convenience for reference only; it must not invent missing statuses or overwrite the source website's content. Changes made here are local drafts and do not publish to the public site.

## Automated checks

A GitHub Actions smoke-test workflow runs on pull requests touching this folder. It checks embedded JavaScript syntax, duplicate HTML IDs, all seven official statuses, install/offline-shell wiring, project-site-relative links, save-failure recovery, and backup preservation. [View Creator Desk smoke-test runs](https://github.com/Kaevoryn-Studios/Website/actions).

## Production security plan

See [PRODUCTION-READINESS.md](./PRODUCTION-READINESS.md) for the provider-neutral checklist for authentication, server-side storage, authorization, backups, and controlled publishing. These are future requirements, not implemented features.

## Suggested test checklist

- [ ] Test narrow phone width and tablet/desktop layouts
- [ ] Create, edit, delete, search, and filter entries
- [ ] Reload and confirm local entries persist
- [ ] Export a backup, clear test data, then import the backup
- [ ] Check project-list loading and links on the deployed Pages route
- [ ] Test install prompt and offline shell on supported browsers
- [ ] Review accessibility, keyboard navigation, and screen-reader behavior
- [ ] Decide on authentication, cloud persistence, roles, and a safe publish workflow before using real private content
