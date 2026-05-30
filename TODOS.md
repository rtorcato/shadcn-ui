# TODOs

Active roadmap. Tier 0–2 and most of Tier 3 are done; see `## Completed` at the bottom for the audit trail. Sibling repos referenced throughout:

- [`@rtorcato/js-common`](https://github.com/rtorcato/js-common) — runtime utilities
- [`@rtorcato/js-tooling`](https://github.com/rtorcato/js-tooling) — TS / Biome / Vitest / commitlint / semantic-release configs

---

## Tier 3 — Testing & coverage (in progress)

- [ ] Component tests for the rest of the core UI primitives beyond the existing Button/Input/Select/Dialog/Form set
- [ ] Visual smoke check for theme tokens — assert every `bg-*` / `text-*` / `border-*` utility referenced under `src/components/` resolves to a real CSS rule in `dist/styles.css`. Would have caught the `@theme inline` regression that surfaced when running Storybook
- [ ] Fix `<button>` inside `<button>` in `MultiSelect` (Radix Trigger renders a `button`, and each selected-badge has a `button` for remove → React/DOM warning). Probably swap the inner remove control to an `aria-label`'d `<span role="button">` or change the trigger to `asChild` div

## Tier 4 — Stretch / nice-to-have

### Storybook follow-ups
- [ ] Stories for the most-used `ui/` primitives — Button, Input, Select, Dialog, Form, Card, Badge, Tabs, Checkbox, Switch
- [ ] `pnpm build-storybook` step in GitLab CI so broken stories block merges (~12s; non-publishing job)
- [ ] Hosted Storybook preview — Chromatic or GitLab Pages auto-deployed from `main` *(explicitly deferred 2026-05-30 — local-only for now)*
- [ ] Storybook 9 → 10 upgrade (10.4.1 available; review the v9→v10 migration guide before bumping)

### Infra
- [ ] Wire `pnpm knip` into CI as a hard gate (now exits clean after removing the `lucide-react` optional flag)
- [ ] Replace `package.json` `scripts.dev` placeholder with `storybook dev -p 6006` so `pnpm dev` does the obvious thing
- [ ] Update `CONTRIBUTING.md` to document the Storybook workflow + theme toggle
- [ ] Audit `globals.css` for any further unmapped CSS variables (sidebar tokens were already correct; sweep for tokens introduced after this session)

### Bigger investments
- [ ] Publish a docs site (Astro Starlight, matching `js-common`'s site) — auto-deployed from `main`
- [ ] Install the skill-creator plugin (`/plugin install skill-creator@claude-plugins-official`) for skill authoring with evals
- [ ] Bundle-size budget per subpath (esbuild-analyzer is already wired; add a CI gate)

---

## Completed

### Tier 0 — Quick wins
- README rewrite + theming token table + CONTRIBUTING.md
- `@rtorcato/js-common` wired in (later removed when audit showed it unused — see Tier 2)
- `.husky/pre-push` runs `pnpm test --run`
- Initial vitest coverage threshold (30% floor)

### Tier 1 — Tooling alignment with `js-tooling`
- Biome, vitest (React preset), commitlint, semantic-release, and esbuild all extend / re-export `@rtorcato/js-tooling` presets
- `@rtorcato/js-tooling` upgraded to v2.6.0 (tarball URL since pnpm has no per-package registry routing)
- `pnpm doctor` script wired into GitLab CI `lint` stage (`allow_failure: true`)
- **knip** added; surfaced ~10 unused deps + 1 dead barrel, all cleaned up

### Tier 2 — Utility consolidation audit
- Audited `src/hooks/use-debounce.ts`, date pickers, and `src/lib/utils.ts` — **no swaps** to `js-common`; abstractions don't line up cleanly and there's no consumer demand to re-export
- Removed `@rtorcato/js-common` from `dependencies` (knip confirmed unused). README now calls it a "compatible companion package"
- Added `ThemeProvider` re-export from `next-themes` at `@rtorcato/shadcn-ui/theme-provider`
- Removed dead barrel `src/components/index.ts`
- Removed unused deps: `@hookform/resolvers`, `@storybook/react`, `zod`, `@changesets/cli`, `clean-package`, `webpack-bundle-analyzer`, duplicate `tailwind-merge`
- Added missing `commitizen` + `cz-conventional-changelog` for `pnpm commit`

### Tier 3 — Testing (so far)
- Hook tests added: `use-click-outside`, `use-debounce`, `use-local-storage`, `use-media-query`
- `ui-extended` tests added: `confirm-dialog`, `data-table`, `file-upload`, `multi-select`, `page-header`
- vitest coverage threshold raised 30% → 85% (suite at ~95.6% lines, 103 tests)

### Tier 4 — Storybook
- Storybook 9 + `@storybook/react-vite` + `@storybook/addon-a11y` installed
- `.storybook/main.ts` and `preview.ts` written; Tailwind v4 wired via the existing PostCSS pipeline; light/dark theme toolbar
- Seed stories for `ConfirmDialog`, `DataTable`, `FileUpload`, `MultiSelect`, `PageHeader`
- `pnpm storybook` (dev) and `pnpm build-storybook` (static) scripts; `storybook-static/` ignored and excluded from Biome
- `knip.json` updated to treat `.storybook/*` and `*.stories.tsx` as entry points

### Misc fixes
- `globals.css` `@theme inline` extended to map all shadcn design tokens (`--color-background`, `--color-popover`, `--color-card`, `--color-primary`, etc.) — fixed transparent-modal regression for both Storybook and `dist/styles.css` consumers
- `lucide-react` moved out of `peerDependenciesMeta` (no longer marked optional) so consumers see a missing-peer warning if they forget to install it

### Components (`ui-extended`)
- `ConfirmDialog` — AlertDialog wrapper with confirm/cancel + loading state
- `DataTable` — TanStack Table wrapper (sorting, pagination, column visibility)
- `FileUpload` — drag-and-drop input built on existing Input + shadcn primitives
- `MultiSelect` — multi-value select built on Command + Popover
- `PageHeader` — title + breadcrumb + action-slot layout

### Build / Infra
- `"./styles.css"` already covered by the `dist` glob in `package.json` `files`
- `tailwindcss` and `tw-animate-css` split to `peerDependencies` so consumers aren't double-bundling Tailwind
- Tests for `Button`, `Input`, `Select`, `Dialog`, `Form`, `use-mobile`, `use-sidebar`, `use-toast`, and the two date pickers
