# Kaevoryn Studios — Visual Asset Library

Keep website images, illustrations, and visual resources organized by purpose. Before moving or renaming an existing asset, search for every reference to its current path and update those references in the same change.

## Folders

- `brand/` — official logos, K emblem exports, wordmarks, and brand graphics.
- `backgrounds/` — cosmic skies, nebulae, textures, and page backgrounds.
- `effects/` — portal artwork, stardust overlays, glow textures, and other visual effects.
- `artwork/` — original illustrations, concept art, and standalone creative pieces.
- `golden-invitation/` — Golden Invitation artwork, ticket graphics, and decorative details.
- `projects/` — project-specific artwork; create a clearly named subfolder for each project.
- `icons/` — interface icons and small decorative graphics.

## Naming rules

- Use descriptive, lowercase kebab-case names, such as `kaevoryn-k-emblem.svg` or `nightmare-forge-key-art.webp`.
- Keep the original source when creating an edited or optimized version.
- Use suffixes such as `-source`, `-web`, or `-mobile` only when they clarify the asset's role.
- Prefer SVG for clean vector artwork and appropriately optimized WebP/PNG for raster images with transparency or fine detail.
- Do not add copyrighted, licensed, or third-party artwork without confirming that it is permitted for the intended use.
- Before removing or moving an asset, check its references across all HTML, CSS, and other project files.

## Important

This is the folder structure and workflow guide. Existing visuals should only be moved after the repository's current asset inventory and references have been checked. CSS-drawn effects can remain in the stylesheet unless we intentionally convert them into image assets.

## Content-editor media workflow

The repository's `.pages.yml` configures the Pages content editor to read uploaded media from `media/` and publish it under `/media`. Its project entries also include an `image` field. Before using the content editor to add project artwork, confirm the uploaded file's resulting URL and check that the page actually renders that field; a configured field alone does not prove every page template displays it. Keep the original artwork and note the intended page/project when recording the asset.

## Initial repository inventory

The repository tree was checked on the `main` branch and the `effects/stronger-visible-magic` draft branch. Neither tree currently contains standalone image files (for example, `.png`, `.jpg`, `.jpeg`, `.webp`, or `.svg`). The HTML pages and `site.css` were also scanned for direct image/media references; the reviewed pages primarily use HTML/CSS visuals and text rather than local image assets.

This is an inventory of the website repository only. It does not include artwork stored outside the repository, such as in design tools, chat attachments, or personal folders. When original artwork is added to the repo, record its purpose and source here or in the relevant folder README, then check every reference before changing paths.


## Asset intake checklist

For every new visual, record these details in the relevant folder's README or a small adjacent manifest:

- **Filename:** the exact repository path.
- **Purpose:** where and why it appears on the site.
- **Creator/source:** who made it and where the original is stored.
- **Usage rights:** original, licensed, or permission confirmed; note any limits.
- **Accessibility:** meaningful alt text for informative images; empty alt text for purely decorative images.
- **Variants:** source/original and any optimized desktop or mobile exports.
- **References:** every page, stylesheet, or content file that uses it.
- **Status:** planned, ready for review, approved, or in use.

Before an asset is considered organized, verify that its file exists, the recorded path matches its actual name, its usage rights are clear, and all page references still resolve. Do not create fake placeholder artwork just to fill a folder.
