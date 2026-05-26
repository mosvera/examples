# Agent Guidance

This repo is the canonical public source for Mosvera examples, aesthetic packs,
gallery metadata, and public-safe thumbnail assets.

## Safety Rules

- Do not commit secrets, `.env*`, local config, vault references, generated
  media metadata, caches, private notes, or local machine paths.
- Preserve unrelated user changes and keep edits narrow.
- Use DCO-signed commits when committing.
- Do not publish packages, rotate credentials, change repo visibility, or
  trigger releases unless explicitly asked.

## Repo Boundaries

- Keep `.mosvera.json` packs limited to registry documents.
- Do not put assets, provider credentials, remote auth, generated video/audio,
  or zip contents inside packs.
- Ensure thumbnail assets are public-safe and optimized.
- The website mirrors gallery data from here; this repo is the source of truth.

## Verification

- Run `node scripts/validate-gallery.mjs`.
- Run `git diff --check` before committing.
