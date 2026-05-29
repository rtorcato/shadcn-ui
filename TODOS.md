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
- [ ] Add a `pnpm doctor` script that calls `npx js-tooling doctor` (and wire it into the GitLab CI lint stage)
- [ ] Add **knip** for unused-export / unused-file detection — `npx js-tooling fix knip` scaffolds it; useful for `src/lib`, `src/hooks`, and the auto-discovered esbuild entry points

## Tier 2 — Utility consolidation with `js-common`

Audit `src/lib/`, `src/hooks/`, and `ui-extended/` for code that duplicates `js-common`. Replace duplicates and re-export from `js-common` where it makes sense for consumers.

- [ ] Audit `src/hooks/use-debounce.ts` — back the hook with `debounce` from `@rtorcato/js-common/functions`
- [ ] Audit date-picker components — replace ad-hoc `date-fns` usage with `@rtorcato/js-common/date` helpers where equivalent
- [ ] Audit `src/lib/utils.ts` — `cn` stays (clsx + tailwind-merge is shadcn canonical), but check if formatting/validation helpers from `js-common` should be re-exported here
- [ ] Add `js-common` to `peerDependencies` so consumers share a single install instead of double-bundling
- [ ] Re-export commonly used `js-common` subpaths from this package (`/utils/date`, `/utils/format`) so a single install covers UI + helpers
- [ ] Add a `ThemeProvider` re-export from `next-themes` so consumers don't need a separate install for the common case

## Tier 3 — Testing & coverage

Bring the test suite up to a level where the coverage threshold is meaningful.

- [ ] Component tests for the rest of the core UI primitives beyond the existing Button/Input/Select/Dialog/Form set
- [ ] Tests for the remaining custom hooks (`use-click-outside`, `use-debounce`, `use-local-storage`, `use-media-query`)
- [ ] Tests for the remaining `ui-extended` components (`confirm-dialog`, `data-table`, `file-upload`, `multi-select`, `page-header`)
- [ ] Raise the vitest coverage threshold once the suite is broad enough

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
