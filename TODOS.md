# TODOs

Active roadmap. Tiers 0–3 are done; the remaining items live in Tier 4. See `## Completed` at the bottom for the audit trail. Sibling repos referenced throughout:

- [`@rtorcato/js-common`](https://github.com/rtorcato/js-common) — runtime utilities
- [`@rtorcato/js-tooling`](https://github.com/rtorcato/js-tooling) — TS / Biome / Vitest / commitlint / semantic-release configs

---

## Tier 4 — Stretch / nice-to-have

### Storybook follow-ups
- [ ] Hosted Storybook preview — Chromatic or GitLab Pages auto-deployed from `main` *(explicitly deferred 2026-05-30 — local-only for now)*

### Bigger investments
- [ ] Publish a docs site (Astro Starlight, matching `js-common`'s site) — auto-deployed from `main`
- [ ] Install the skill-creator plugin (`/plugin install skill-creator@claude-plugins-official`) for skill authoring with evals

---

## Completed

### Tier 0 — Quick wins
- README rewrite + theming token table + CONTRIBUTING.md
- `@rtorcato/js-common` wired in (later removed when audit showed it unused — see Tier 2)
- `.husky/pre-push` runs `pnpm test --run`
- Initial vitest coverage threshold (30% floor)

### Tier 1 — Tooling alignment with `js-tooling`
- Biome, vitest (React preset), commitlint, semantic-release, and esbuild all extend / re-export `@rtorcato/js-tooling` presets
- `@rtorcato/js-tooling` upgraded to v2.6.0 (tarball URL since pnpm has no per-package registry routing; lockfile's missing `integrity:` field lifted manually from the URL's sha512 fragment so newer pnpm versions accept `--frozen-lockfile`)
- `pnpm doctor` script wired into GitLab CI `lint` stage (`allow_failure: true`); vitest preset drift cleared with a bare `import '@rtorcato/js-tooling/vitest/config'` so the job runs green
- **knip** added; surfaced ~10 unused deps + 1 dead barrel, all cleaned up; promoted to a blocking CI gate

### Tier 2 — Utility consolidation audit
- Audited `src/hooks/use-debounce.ts`, date pickers, and `src/lib/utils.ts` — **no swaps** to `js-common`; abstractions don't line up cleanly and there's no consumer demand to re-export
- Removed `@rtorcato/js-common` from `dependencies` (knip confirmed unused). README now calls it a "compatible companion package"
- Added `ThemeProvider` re-export from `next-themes` at `@rtorcato/shadcn-ui/theme-provider`
- Removed dead barrel `src/components/index.ts`
- Removed unused deps: `@hookform/resolvers`, `@storybook/react`, `zod`, `@changesets/cli`, `clean-package`, `webpack-bundle-analyzer`, duplicate `tailwind-merge`
- Added missing `commitizen` + `cz-conventional-changelog` for `pnpm commit`

### Tier 3 — Testing
- Hook tests added: `use-click-outside`, `use-debounce`, `use-local-storage`, `use-media-query`, `use-mobile`, `use-sidebar`, `use-toast`
- `ui-extended` tests added: `confirm-dialog`, `data-table`, `file-upload`, `multi-select`, `page-header`, both date pickers
- `ui/` primitive tests added — every shipped primitive is covered (48 test files: accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, button-group, calendar, card, carousel, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, empty, field, form, hover-card, input, input-group, input-otp, item, kbd, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip)
- vitest coverage threshold raised 30% → 85% (suite at ~95% lines, 194 tests across 67 files)
- Theme-token smoke check at `src/test/theme-tokens.test.ts` — fails the test run if any `bg-*` / `border-*` / `text-*` utility under `src/components/` references a design token that isn't declared in `@theme inline`, superseding the manual `globals.css` audit TODO
- jsdom shims in `src/test/setup.ts`: `ResizeObserver`, `IntersectionObserver`, `matchMedia`, pointer-capture, `scrollIntoView`
- `MultiSelect` remove-badge control swapped from nested `<button>` to `<span role="button" tabIndex={0}>` + `biome-ignore` for the a11y rule, with the rationale documented in-line
- `*.stories.tsx` excluded from coverage so demo stubs don't drag the global threshold

### Tier 4 — Storybook
- Storybook 9 + `@storybook/react-vite` + `@storybook/addon-a11y` installed; upgraded to Storybook 10.4.1 (config was already ESM-clean — no `__dirname`/`require`, no extensionless relative imports — so the bump was just deps + `engines.node` to `>=22.12`)
- `.storybook/main.ts` and `preview.ts` written; Tailwind v4 wired via the existing PostCSS pipeline; light/dark theme toolbar
- Seed stories for `ui-extended`: `ConfirmDialog`, `DataTable`, `FileUpload`, `MultiSelect`, `PageHeader`
- Stories for the ten most-used `ui/` primitives: Button, Input, Select, Dialog, Form, Card, Badge, Tabs, Checkbox, Switch
- `pnpm storybook` (dev) and `pnpm build-storybook` (static) scripts; `pnpm dev` now aliases `storybook dev -p 6006`; `storybook-static/` ignored and excluded from Biome
- `knip.json` updated to treat `.storybook/*` and `*.stories.tsx` as entry points
- `pnpm build-storybook` wired to GitLab CI as a blocking job so broken stories block merges
- `CONTRIBUTING.md` documents the Storybook + theme-toggle workflow and the updated CI gate table

### Misc fixes
- `globals.css` `@theme inline` extended to map all shadcn design tokens (`--color-background`, `--color-popover`, `--color-card`, `--color-primary`, etc.) — fixed transparent-modal regression for both Storybook and `dist/styles.css` consumers
- `lucide-react` moved out of `peerDependenciesMeta` (no longer marked optional) so consumers see a missing-peer warning if they forget to install it
- `packageManager: pnpm@11.1.3` pinned in `package.json`; CI swapped from `corepack prepare pnpm@latest --activate` to `corepack install` so dev + CI run the same pnpm

### Components (`ui-extended`)
- `ConfirmDialog` — AlertDialog wrapper with confirm/cancel + loading state
- `DataTable` — TanStack Table wrapper (sorting, pagination, column visibility)
- `FileUpload` — drag-and-drop input built on existing Input + shadcn primitives
- `MultiSelect` — multi-value select built on Command + Popover
- `PageHeader` — title + breadcrumb + action-slot layout

### Build / Infra
- `"./styles.css"` already covered by the `dist` glob in `package.json` `files`
- `tailwindcss` and `tw-animate-css` split to `peerDependencies` so consumers aren't double-bundling Tailwind
- Bundle-size gate at `scripts/check-bundle-size.mjs` + `bundle-size.json` budget snapshot — gzips every exported subpath and the shared `dist/chunks/` total, fails on growth past `budget * (1 + tolerance)` (default 10%). Wired into GitLab CI as a blocking `bundle-size` job that consumes the `build` artifact, and into the `publish` job's needs. Re-baseline with `pnpm bundle-size:write`
- Dropped the broken `.` root export — removed `main`/`module`/`types` and the `"."` entry from `package.json` `exports`, deleted stale `src/index.ts1`. Library is subpath-only; matches the README and build design. Clears the bundle-size gate's "missing dist artifact" warning
