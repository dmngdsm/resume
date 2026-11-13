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

The live site is published from the `master` branch of `dmngdsm/resume`.

Run `pnpm pages` to build and copy the static export into `docs/`, preserving `docs/design.md`. Commit the generated export together with source changes. Do not manually edit exported files.

In Settings → Pages, select **Deploy from a branch**, branch **master**, folder **/docs**. The export includes `.nojekyll` for Next.js assets and `CNAME` for `www.ivanmanchev.com`.

The old CV website is retained in Git history. To roll back a change, revert its commit and publish the restored export from `master`.
