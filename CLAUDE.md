# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`@rtorcato/shadcn-ui` is a React component library built on shadcn/ui, Radix UI, TypeScript, and Tailwind CSS v4. It publishes to the public npm registry. Just run `pnpm install` — all dependencies resolve from public npm, no token required.

## Build

```bash
pnpm build-dev    # development build (clean → CSS → esbuild → tsc declarations)
pnpm build-prod   # production build
pnpm build:css    # CSS only (PostCSS + Tailwind → dist/styles.css)
```

Build uses a custom esbuild wrapper (`build.mjs`) that auto-discovers entry points by scanning `src/components/`, `src/lib/`, and `src/hooks/` directories. New components must follow the folder structure — the build picks them up automatically.

## Test

```bash
pnpm test             # run once
pnpm test:watch       # watch mode
pnpm coverage         # with coverage report
pnpm test -- src/path/to/test.test.tsx   # single file
```

Test environment: Vitest + jsdom + Testing Library. Setup file: `src/test/setup.ts`.

## Lint, format, typecheck

```bash
pnpm check        # biome lint + format check (read-only)
pnpm check:fix    # biome lint + format (applies fixes)
pnpm format       # format only
pnpm lint         # lint only
pnpm typecheck    # tsc --noEmit
```

Pre-commit hook runs `typecheck` then `check` then `format` automatically.

## Component authoring

- **`src/components/ui/`** — shadcn/ui generated components only. Add with `pnpm component-add <name>` (wraps `npx shadcn@latest add`). Do not hand-edit these unless fixing a specific issue.
- **`src/components/ui-extended/`** — custom components written manually.
- **`src/hooks/`** — custom React hooks.

Biome does not lint `components/ui/` (excluded in `biome.jsonc`).

## Path aliases

Use `@/*` or `~/*` for imports from `src/`. Both aliases resolve to `./src/*`.

## Commits and branches

- Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) — enforced by commitlint on every commit. Use `pnpm commit` for an interactive prompt.
- Branch names mirror commit types: `feat/`, `fix/`, `chore/`, etc.
- Semantic Release runs automatically in CI on `main` — do not manually bump the version in `package.json`.

## Releases

Versioning and npm publishing are fully automated via `semantic-release` in GitHub Actions (`.github/workflows/ci.yml`) on `main`. CI requires the `NPM_TOKEN` repository secret (public npm publish); `GITHUB_TOKEN` is provided automatically. Do not run `semantic-release` locally.
