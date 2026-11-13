# AGENTS.md

## Project
This is a personal portfolio website for a professional in the field of marketing, startups and Web3.
Main flows: Learn about Ivan Manchev, his background, achievements, social profiles and public appearances. Get in touch with Ivan.
Stack: [Next.js, TypeScript, Tailwind].
Package manager: pnpm.

## Current implementation
Temporary prose landing page with inline links, a canvas paint interaction and a scrambling header. Next.js App Router, TypeScript and Tailwind CSS; static export to `out/`. Full portfolio is still in planning.

## Commands
- Install: `pnpm install`
- Develop: `pnpm dev`
- Type check: `pnpm typecheck`
- Build: `pnpm build`
- Prepare GitHub Pages: `pnpm pages` (builds and copies export into `docs/`)

Two autonomous koi-like paint strokes are enabled by default, with mouse and passive touch painting. Add `?koi=0` for a pointer-only comparison. Respect native mobile scrolling, pinch zoom and reduced motion.

No lint or test runner is configured for the temporary static page.

## Code map
- `src/app/`: routes and layouts
- `src/app/page.tsx`: temporary introduction and contact/social links
- `src/app/globals.css`: responsive typography and page styling
- `src/components/ui/`: paint, text and header interactions
- `src/lib/`: paint coverage, koi motion and scramble helpers
- `docs/design.md`: design guidance
- `docs/` other files: generated GitHub Pages export; regenerate with `pnpm pages`
- `scripts/prepare-pages.mjs`: packages static export and custom-domain configuration

## Implementation
- Never create filenames containing spaces.
- Follow nearby code patterns.
- Reuse existing components before creating new ones.
- Keep business logic outside presentation components.
- Use the existing validation and data-fetching conventions.
- Keep changes focused on the requested task.

## Design and UX
- Never set interface text below 12px, including mobile captions and labels.
- Create and follow `docs/design.md` for visual decisions.
- Support mobile and desktop without horizontal overflow.
- Use semantic HTML, labelled inputs, and visible keyboard focus.
- Implement relevant loading, empty, error, and success states.
- Respect reduced-motion preferences.
- Preserve page metadata and meaningful heading structure.

## Boundaries
- Never commit credentials or expose server secrets to the client.
- Do not edit generated files.
- Explain any new dependency and why existing tools are insufficient.
- Obtain explicit authorization before production deployment
  or destructive database operations.

## Verification
- Run checks relevant to the change.
- For UI changes, inspect affected pages in a browser at
  375 px and 1440 px widths.
- Exercise the changed interaction, including failure states.
- Add regression tests for behaviour changes where useful.
- Report what changed, what was verified, and any remaining issues.
- If a check cannot run, state the reason.

## Maintenance
Update these instructions when commands, architecture,
or project conventions change.
