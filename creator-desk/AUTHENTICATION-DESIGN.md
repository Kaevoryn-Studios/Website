# Creator Control Center — Authentication Design

**Status: 🧩 Planned — design only. No login has been implemented.**

## Goal

Provide the Kaevoryn Studios owner with a secure, mobile-friendly way to enter the Creator Control Center while keeping private drafts and studio administration separate from the public website.

## Proposed sign-in experience

1. A branded **KAEVORYN STUDIOS — CREATOR ACCESS** screen using the site's dark cinematic visual direction with restrained cyan/purple accents.
2. Accept either the account's verified email address or its unique username, both mapped to the same account.
3. Offer a strong account password. Do not treat a short PIN as a substitute for account authentication.
4. Offer a passkey as the preferred convenient option on supported devices. A passkey may invoke the device's built-in fingerprint, face recognition, or another supported device unlock method.
5. Keep an accessible password-based alternative and a clear, secure recovery path.
6. Require multi-factor authentication for the owner account where supported, especially before sensitive administrative actions.
7. Provide clear signed-in account identity, sign-out, session/device management, and re-authentication for high-impact actions.

## Biometrics and PINs

- **Fingerprint:** use a platform authenticator/passkey where available. The site must never receive or store raw fingerprint images or templates.
- **Face scan:** use a platform authenticator/passkey where available. The site must never collect or store face scans or templates.
- **Eye/iris scan:** do not build a website-level iris scanner or claim universal support. If a device supports an appropriate secure platform authenticator, let the operating system handle it.
- **PIN:** if supported, use it only as a device-local authenticator/unlock method or a carefully designed secondary convenience control. Never store a PIN in plain text or use a weak PIN as the only account barrier.
- **Fallback:** biometrics can be unavailable, disabled, or fail; provide secure fallback and recovery without weakening account protection.

## Authorization and privacy requirements

- Start with one owner account. Do not create an open public registration form for an administrative system.
- If collaborators are added later, use individual accounts and explicit roles; never share the owner's login.
- Enforce access on the server for every read and write. Hiding an admin link or page is not security.
- Keep authentication secrets, session-signing keys, and publishing credentials out of client-side JavaScript and the public repository.
- Use server-side persistence with owner-scoped records and record-level authorization.
- Separate saved drafts from public content. Publishing requires preview, explicit owner approval, and a narrowly scoped server-side publishing process.
- Record important security and publishing events without logging passwords, tokens, or biometric data.
- Include rate limiting, secure session handling, CSRF protection where applicable, secure recovery, data validation, and tested backup/restore.
- Provide accessible alternatives for users who cannot or choose not to use a particular biometric method.

## Architecture boundary

GitHub Pages can serve the public static website and a visual login mockup, but a form placed on a static page does not create secure authentication or private storage. Production Creator Control Center needs a selected identity provider and trusted backend/server-side service, configured and tested before private use.

No provider is selected by this document. Evaluate provider security, costs, data location, exportability, recovery, and integration with the existing website before committing.

## Acceptance checklist

- [ ] Owner identity can sign in with verified email and/or unique username.
- [ ] Password and secure recovery are tested.
- [ ] Passkey works on supported devices and has a safe fallback.
- [ ] Biometric processing remains with the device/platform; the website stores no raw biometric data.
- [ ] Unauthenticated requests and cross-account access are denied by the server.
- [ ] Owner-only actions require appropriate authorization and re-authentication where warranted.
- [ ] Drafts cannot publish without explicit approval.
- [ ] Session expiry, sign-out, recovery, rate limiting, and backup restoration are tested.
- [ ] Keyboard, screen-reader, mobile, and non-biometric access are tested.
- [ ] Privacy and retention/deletion behavior are documented.
- [ ] Security review is complete before launch.
