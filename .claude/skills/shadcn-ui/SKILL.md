---
name: shadcn-ui
description: Expert guidance for working with shadcn/ui in this repo. Use when adding or editing components (primitives in `ui/` or custom in `ui-extended/`), wiring design tokens, theming, debugging Radix/Tailwind interactions, or answering "how does shadcn do X" questions. Fetches current docs from Context7 instead of guessing from training data.
---

You are the shadcn/ui expert for `@rtorcato/shadcn-ui`. This skill encodes this repo's conventions and tells you when to fetch fresh upstream docs.

## When to fetch docs (don't guess)

Use Context7 the moment you need anything beyond what's already on disk:

- **`/websites/ui_shadcn`** — the official docs site (ui.shadcn.com/docs). Use for component usage, props, accessibility notes, theming guides, CLI commands.
- **`/shadcn-ui/ui`** — the upstream source repo. Use when you need the *current* implementation of a primitive (e.g., to diff against this repo's `src/components/ui/<name>.tsx`) or to check internal patterns.

```
mcp__plugin_context7_context7__query-docs
  libraryId: /websites/ui_shadcn
  query: "<specific question — e.g., 'Combobox usage with Popover and Command'>"
```

Don't fetch docs preemptively. Fetch when you'd otherwise be uncertain.

## Repo layout (this is non-obvious)

| Path | Rule |
|---|---|
| `src/components/ui/` | shadcn-generated primitives only. **Do not hand-edit.** Add via `pnpm component-add <name>` (wraps `npx shadcn@latest add`). Biome lints exclude this folder. |
| `src/components/ui-extended/` | Custom components built on top of primitives. Hand-write here. Biome lints these. |
| `src/hooks/` | Custom React hooks. Each one needs a `.test.ts` sibling. |
| `src/styles/globals.css` | Tailwind v4 entrypoint + `@theme inline` token mappings. **Every design token referenced via `bg-*` / `text-*` / `border-*` in components must be declared here** — `src/test/theme-tokens.test.ts` fails the test run otherwise. |
| `src/test/setup.ts` | Re-exports jsdom shims from `@rtorcato/js-tooling`. Don't add inline shims. |

## Adding a shadcn primitive

```bash
pnpm component-add button   # or any shadcn name
```

This drops the file into `src/components/ui/`. Then:

1. **Build entry is automatic** — `build.mjs` scans `src/components/ui/*.tsx` so the new primitive gets its own subpath export. No `build.mjs` edit needed.
2. **Add the subpath to `package.json` `exports`** — bundlers can't tree-shake without it. Match the pattern of the others: `"./components/ui/<name>": { "types": "./dist/components/ui/<name>.d.ts", "import": "./dist/components/ui/<name>.js" }`.
3. **Write a test** at `src/components/ui/<name>.test.tsx` — coverage floor is 85% (CI blocks below that). Mirror the existing thin smoke tests in the folder; testing-library + jsdom is wired in `src/test/setup.ts`.
4. **Re-baseline the bundle-size budget**: `pnpm bundle-size:write` — the gate fails on missing entries.
5. **Check for new peer deps** the primitive pulls in. If it adds a Radix package, that's already covered by the existing `radix-ui` dep. If it adds something new (e.g., `vaul`, `cmdk`), add to `dependencies` — not `peerDependencies` unless consumers should bring their own.

## Authoring a custom component (`ui-extended/`)

- Compose existing primitives — don't fork them. If you find yourself wanting to fork, the right move is usually a Radix slot/asChild pattern or a wrapper.
- Export named, not default: `export function MultiSelect(...)` — matches the pattern.
- Add a Storybook story at `src/components/ui-extended/<name>.stories.tsx` — Storybook 10 is wired via `.storybook/main.ts`. `*.stories.tsx` is excluded from coverage so demo stubs don't drag the threshold.
- Add a `.test.tsx` sibling. Look at `confirm-dialog.test.tsx` or `data-table.test.tsx` for the established shape (rendering + one interaction path).
- Update `package.json` `exports` with the new subpath (same pattern as `ui/`).

## Theme tokens

Tailwind v4 + shadcn use CSS variables under `@theme inline` in `globals.css`. The token wiring is:

1. Shadcn defines runtime CSS vars on `:root` and `.dark` (e.g., `--background`, `--primary`, `--popover`).
2. `@theme inline` maps those to Tailwind color tokens (e.g., `--color-background: var(--background)`).
3. Components use `bg-background`, `text-foreground`, etc.

**Every utility class in `src/components/` that references a token must be backed by a `--color-*` entry in `@theme inline`.** The smoke test in `src/test/theme-tokens.test.ts` enforces this — if it fails, add the missing mapping rather than the missing CSS var.

## Previewing themes in Storybook

The Storybook toolbar has three theme controls wired in `.storybook/preview.ts`:

- **Theme** — color preset dropdown (Default, Orange, Blue, Rose, Green, Violet) backed by CSS files in `.storybook/themes/`. Adding a preset means adding a `.theme-<name>` scoped CSS file and registering it in the `withThemeByClassName` map.
- **Mode** — light/dark toggle (toggles `.dark` on `html`).
- **Radius** — `--radius` selector (0, 0.3, 0.5, 0.75, 1 rem).

Preset files only override `--primary`, `--primary-foreground`, `--ring` (and dark equivalents). Structural tokens stay shared with `globals.css` to keep presets focused on the brand color.

## Theming-related debugging checklist

When a component renders with wrong/transparent colors:

1. Inspect element → is the CSS variable resolving? If not, `@theme inline` is missing a mapping.
2. Is the consumer importing `@rtorcato/shadcn-ui/styles.css`? It's required.
3. Is Tailwind's `content` glob picking up the package? Consumers need `'./node_modules/@rtorcato/shadcn-ui/dist/**/*.{js,mjs}'`.
4. For Storybook specifically: `.storybook/preview.ts` imports `globals.css` directly — if a story has theme issues but the built component works, it's a preview decorator problem, not a token problem.

## Testing

- Unit tests live next to the component: `<name>.test.tsx`.
- Use `@testing-library/react` + `@testing-library/user-event` — see existing tests for the shape.
- jsdom shims (`ResizeObserver`, `IntersectionObserver`, `matchMedia`, pointer-capture, `scrollIntoView`) come from `@rtorcato/js-tooling` via `src/test/setup.ts`. Don't re-declare locally.
- Coverage threshold is 85% lines globally. `*.stories.tsx` is excluded.
- Run a single test: `pnpm test -- src/components/ui-extended/multi-select.test.tsx`.

## Exports rules (this is a subpath-only library)

- The library does **not** ship a bare-name `import { Button } from '@rtorcato/shadcn-ui'` entry. Every component is its own subpath. Don't reintroduce a `.` export.
- Adding a new component means adding its `exports` entry to `package.json`. Forgetting this is the #1 cause of "module not found" for consumers — `build.mjs` emits the file but nothing maps it.
- `./styles.css` is the only non-JS export.

## What NOT to do

- **Don't hand-edit `src/components/ui/*.tsx`** unless fixing a specific upstream bug. Biome doesn't lint these on purpose — they're meant to track upstream.
- **Don't add `@rtorcato/js-common` as a dep** — knip audit removed it; the README calls it a "compatible companion package." Use it if a consumer wants to; don't pull it in here.
- **Don't pin `lucide-react` as a hard dependency** — it's a `peerDependency` (consumers bring their own version). Same for `react`, `react-dom`, `tailwindcss`, `tw-animate-css`.
- **Don't bump the package version manually** — semantic-release in GitHub Actions does this from conventional commits.
- **Don't add inline jsdom shims** — use the shared `@rtorcato/js-tooling` shims (already imported in `src/test/setup.ts`).

## CI gates you must not break

Every gate in `.github/workflows/ci.yml` is blocking:

- `pnpm typecheck` · `pnpm check` (biome) · `pnpm knip` · `pnpm test` (85% coverage) · `pnpm build-prod` · `pnpm build-storybook` · `pnpm bundle-size`

Run `/verify` after non-trivial changes. For the bundle-size gate, re-baseline with `pnpm bundle-size:write` when growth is intentional.

## Quick reference: where to look first

| Question | First place to check |
|---|---|
| "How do I use `<X>`?" | Fetch from Context7 `/websites/ui_shadcn` |
| "What's the prop shape of `<X>` in this repo?" | `src/components/ui/<x>.tsx` directly |
| "Why is my color wrong?" | `src/styles/globals.css` → `@theme inline` |
| "Why did CI fail on bundle-size?" | `bundle-size.json` (the budget snapshot) + `scripts/check-bundle-size.mjs` |
| "How are tests set up?" | `src/test/setup.ts` + an existing `*.test.tsx` |
| "What's released vs. unreleased?" | `git log --oneline` + `CHANGELOG.md` |
