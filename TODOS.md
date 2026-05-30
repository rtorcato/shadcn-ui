# TODOs

Roadmap organised by tier — Tier 0 lands first, Tier 3 is stretch. The headline initiative is the **`js-common` + `js-tooling` adoption** so this package stops re-implementing config and utility code that already lives in the sibling repos:

- [`@rtorcato/js-common`](https://github.com/rtorcato/js-common) — runtime utilities
- [`@rtorcato/js-tooling`](https://github.com/rtorcato/js-tooling) — TS / Biome / Vitest / commitlint / semantic-release configs

---

## Tier 0 — Quick wins (≤ 30 min each)

Low-risk edits, mostly docs and config wiring. Do these first.

- [x] Rewrite `README.md` to position the package as "install once, all shadcn components included" and call out `js-common` / `js-tooling`
- [x] Add `@rtorcato/js-common` to `dependencies` in `package.json` (via npm tarball URL, same routing reason as `js-tooling`)
- [x] Add a `./styles.css` usage note and the full list of overridable CSS variables to README (Theming section + token table)
- [x] Write `CONTRIBUTING.md` covering the `ui/` vs `ui-extended/` split, `pnpm component-add`, Tailwind v3/v4 strategy, commit conventions, semantic-release flow, and CI gates
- [x] Fill in the `.husky/pre-push` hook so `pnpm test --run` runs before push
- [x] Set a coverage threshold in `vitest.config.mjs` (currently 30% lines — real floor; raise as Tier 3 tests land)

## Tier 1 — Tooling alignment with `js-tooling`

Migrate configs from local copies to the shared `@rtorcato/js-tooling` presets. Each step is independent and reversible.

- [x] Replace local Biome config with `@rtorcato/js-tooling/biome` (extends; project-specific ignores preserved)
- [x] Replace `vitest.config.mjs` with the React preset from `@rtorcato/js-tooling/vitest/react` (jsdom + v8 coverage from shared; setupFiles/aliases/threshold overridden locally)
- [x] `commitlint.config.mjs` re-exports `@rtorcato/js-tooling/commitlint/config`
- [x] `release.config.mjs` extends `@rtorcato/js-tooling/semantic-release`
- [x] `build.mjs` uses `buildCode` / `getEntryPoints` from `@rtorcato/js-tooling/esbuild`
- [x] Upgrade `@rtorcato/js-tooling` to v2.6.0 (via direct tarball URL — pnpm doesn't support per-package registry routing)
- [x] Add a `pnpm doctor` script that calls `npx js-tooling doctor` (wired into the GitLab CI `lint` stage with `allow_failure: true`)
- [x] Add **knip** for unused-export / unused-file detection — `knip.json` configured for this project's entry points; surfaced ~10 unused deps + 1 dead barrel that we cleaned up

## Tier 2 — Utility consolidation with `js-common`

Audited `src/lib/`, `src/hooks/`, and `ui-extended/` and found that the patterns we use don't have clean swaps for `js-common`:

- [x] Audit `src/hooks/use-debounce.ts` — **no swap**. The hook returns a debounced *value* via `useState` + `useEffect`; js-common's `debounce` returns a debounced *function*. Different abstraction; wrapping it would add indirection, not save lines.
- [x] Audit date-picker components — **no swap**. They use `date-fns` `addDays` + `format` with date-fns-syntax format strings (`'LLL dd, y'`, `'PPP'`). js-common's `/date` either passes through date-fns (no savings — js-common already pulls it transitively) or has a simpler API that would require rewriting format strings. Not worth the churn.
- [x] Audit `src/lib/utils.ts` — `cn` stays. No formatting/validation helpers from `js-common` are needed by anything in src/.
- [x] **Removed `@rtorcato/js-common` from `dependencies` entirely** (audit + knip both flagged it unused). Listing it as `peerDependencies` for code we don't ship is misleading; consumers who want it can install it directly. The README now describes it as a "compatible companion package".
- [x] **Skipped** re-exporting `js-common` subpaths — would be pure pass-through with no consumer demand.
- [x] Added `ThemeProvider` re-export from `next-themes` at `@rtorcato/shadcn-ui/theme-provider` so consumers don't need to know about `next-themes` for the common dark-mode case.

### Other dependency cleanup surfaced by knip

- Removed dead barrel `src/components/index.ts` (nothing imported it).
- Removed unused `dependencies`: `@hookform/resolvers`, `@storybook/react`, `zod` (form helpers consumers can add if they want validation).
- Removed unused `devDependencies`: `@changesets/cli` (replaced by semantic-release), `clean-package`, `webpack-bundle-analyzer` (replaced by esbuild-analyzer), duplicate `tailwind-merge` (kept in `dependencies`).
- Added missing `commitizen` + `cz-conventional-changelog` for the `pnpm commit` workflow that the existing `config.commitizen` entry expected.

## Tier 3 — Testing & coverage

Bring the test suite up to a level where the coverage threshold is meaningful.

- [ ] Component tests for the rest of the core UI primitives beyond the existing Button/Input/Select/Dialog/Form set
- [x] Tests for the remaining custom hooks (`use-click-outside`, `use-debounce`, `use-local-storage`, `use-media-query`)
- [x] Tests for the remaining `ui-extended` components (`confirm-dialog`, `data-table`, `file-upload`, `multi-select`, `page-header`)
- [x] Raise the vitest coverage threshold once the suite is broad enough (30% → 85%; suite now at ~95% lines)

## Tier 4 — Stretch / nice-to-have

Larger investments — pick up once Tiers 0–3 are healthy.

- [ ] Set up Storybook — `@storybook/react` is already in dependencies but unused; add stories for at least the extended components
- [ ] Publish a docs site (Astro Starlight, matching `js-common`'s site) — auto-deployed from `main`
- [ ] Install the skill-creator plugin (`/plugin install skill-creator@claude-plugins-official`) for skill authoring with evals
- [ ] Bundle-size budget per subpath (esbuild-analyzer is already wired; add a CI gate)

---

## Completed

### Components (`ui-extended`)
- [x] `ConfirmDialog` — reusable AlertDialog wrapper with confirm/cancel callbacks and a loading state
- [x] `DataTable` — TanStack Table wrapper (sorting, pagination, column visibility)
- [x] `FileUpload` — drag-and-drop input built on the existing Input + shadcn primitives
- [x] `MultiSelect` — multi-value select built on Command + Popover
- [x] `PageHeader` — standard page title + breadcrumb + action slot layout component

### Build / Infra
- [x] `"./styles.css"` already covered by the `dist` glob in `package.json` `files` — no change needed
- [x] Split `tailwindcss` and `tw-animate-css` to `peerDependencies` so consumers aren't double-bundling Tailwind
- [x] Tests for `Button`, `Input`, `Select`, `Dialog`, `Form`, `use-mobile`, `use-sidebar`, `use-toast`, and the two date pickers
