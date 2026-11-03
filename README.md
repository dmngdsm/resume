# Ivan Manchev — temporary landing page

Minimal personal landing page built with Next.js, TypeScript and Tailwind CSS.

## Local development

```sh
pnpm install
pnpm dev
```

## Checks and build

```sh
pnpm typecheck
pnpm build
```

## GitHub Pages

The temporary site is intended for the `temporary-landing` branch of `dmngdsm/resume`. Keep the previous site on `master` for rollback.

Run `pnpm pages` to build and copy the static export into `docs/`, preserving `docs/design.md`. Commit the generated export together with source changes. Do not manually edit exported files.

In Settings → Pages, select **Deploy from a branch**, branch **temporary-landing**, folder **/docs**. The export includes `.nojekyll` for Next.js assets and `CNAME` for `www.ivanmanchev.com`. This setting replaces the site served at the existing domain.

To roll back, restore the previous Pages source branch and folder.
