# TODOs


## Testing

- [ ] Add component tests for at least the core UI components: Button, Input, Select, Dialog, Form
- [ ] Add tests for all custom hooks (`use-mobile`, `use-sidebar`, `use-toast`)
- [ ] Add tests for `ui-extended` components (date pickers)
- [ ] Set a coverage threshold in `vitest.config` (e.g. 70% lines) so CI fails on regression
- [ ] Fill in the empty pre-push hook — `.husky/pre-push` is currently a no-op; consider running `pnpm test` to catch failures before CI



## Components (`ui-extended`)

- [x] `ConfirmDialog` — reusable AlertDialog wrapper with confirm/cancel callbacks and a loading state
- [x] `DataTable` — TanStack Table wrapper (sorting, pagination, column visibility) since recharts/form infra is already here
- [x] `FileUpload` — drag-and-drop input built on the existing Input + shadcn primitives
- [x] `MultiSelect` — multi-value select built on Command + Popover (common gap in shadcn)
- [x] `PageHeader` — standard page title + breadcrumb + action slot layout component

## Developer Experience

- [ ] Set up Storybook — `@storybook/react` is already in dependencies but unused; add stories for at least the extended components
- [ ] Add a `./styles.css` usage note to README with the full list of overridable CSS variables
- [ ] Export a `ThemeProvider` re-export from `next-themes` so consumers don't need a separate install for the common case
- [ ] Add a `CONTRIBUTING.md` explaining the `ui/` vs `ui-extended/` split and the `pnpm component-add` workflow
- [ ] Add a `/release` skill — document the semantic-release flow (conventional commits → CI → GitLab publish) for new contributors
- [ ] Install the skill-creator plugin — `/plugin install skill-creator@claude-plugins-official` — lets you create and refine skills using evals

## Build / Infra

- [ ] Add `"./styles.css"` to the `"files"` array in `package.json` — currently only `dist` is listed; if the CSS path ever changes this would silently break (verify the `dist` glob catches it)
- [ ] Consider splitting `tailwindcss` and `tw-animate-css` to `peerDependencies` so consumers aren't double-bundling Tailwind
