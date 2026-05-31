# js-tooling audit

Catalog of every piece of tooling in this repo, scored against the question:
**should this live in `@rtorcato/js-tooling` so the next project gets it for free?**

Use this as a checklist when picking the next js-tooling release: each item under
"Strong candidates" is a concrete upstream PR; "Maybe candidates" needs a design call;
"Project-local" stays here forever.

Reviewed against state at HEAD (`pnpm-lock.yaml` indexed against `@rtorcato/js-tooling@2.6.0`).

---

## 1. Already shared via js-tooling

These are the existing wins — the integration shape is what new tools should match.

| Tool | Local file | Imports from js-tooling |
|---|---|---|
| Biome lint/format | `biome.jsonc` | `extends: ["@rtorcato/js-tooling/biome"]` |
| commitlint | `commitlint.config.mjs` | `@rtorcato/js-tooling/commitlint/config` |
| semantic-release | `release.config.mjs` | `@rtorcato/js-tooling/semantic-release` |
| TypeScript (React) | `tsconfig.json` | `extends: "@rtorcato/js-tooling/typescript/react"` |
| Vitest (React) | `vitest.config.mjs` | `@rtorcato/js-tooling/vitest/react` (+ `/vitest/config` for doctor) |
| esbuild build wrapper | `build.mjs` | `buildCode`, `getEntryPoints` from `@rtorcato/js-tooling/esbuild` |
| `pnpm doctor` config drift check | `package.json` script | `js-tooling doctor` (CLI binary) |
| jsdom shim suite | `src/test/setup.ts` | `import '@rtorcato/js-tooling/vitest/jsdom-shims'` *(shipped in 2.7.0)* |
| knip preset (currently project-local) | `knip.json` | *not yet upstream — see §3* |

**Pattern observation:** every shared piece is a `.config` file that does `extends`/`re-export`,
or a CLI binary invoked from `package.json` scripts. Anything we upstream should match
one of those two shapes so consumers can adopt with one-line changes.

---

## 2. Strong candidates to upstream

Generic, valuable, not project-specific. Each of these is a real friction point we just hit
during the recent Tier 3/Tier 4 work, so the next project will hit them too.

### 2.1 Bundle-size gate

- **Local files:** `scripts/check-bundle-size.mjs`, `bundle-size.json`, `pnpm bundle-size{,:write}`
  scripts, the GitLab CI `bundle-size` job (`.gitlab-ci.yml:161`).
- **Provides:** gzip-walks `package.json` exports, fails if any subpath grew past
  `budget * (1 + tolerance)`. Also tracks `dist/chunks/` in aggregate.
- **Why it should move:** every library publishing per-subpath exports needs this.
  Nothing in the script touches anything project-specific — it discovers entries from
  `package.json` exports and reads `dist/`.
- **Proposed shape:** `js-tooling bundle-size [--write]` CLI; consumers just add the script
  and commit a `bundle-size.json` baseline. CI snippet can live in the GitLab template (§2.5).

### 2.2 Husky hook bundle

- **Local files:** `.husky/pre-commit`, `.husky/pre-push`, `.husky/commit-msg`
- **Provides:** `typecheck → check → format` on pre-commit, `pnpm test --run` on pre-push,
  commitlint on commit-msg (with a `[skip ci]` bypass for semantic-release commits).
- **Why it should move:** the scripts are dead-simple but every project copies them by hand,
  which means drift. A `js-tooling install-hooks` would scaffold them and `doctor` could
  verify they're up-to-date.
- **Proposed shape:** `js-tooling install-hooks` writes the three files; `js-tooling doctor`
  flags drift if they're stale.

### 2.3 `setup.sh` / `NPM_TOKEN` env loader

- **Local file:** `setup.sh`
- **Provides:** sources `.env`, exports `NPM_TOKEN`, errors clearly if missing.
- **Why it should move:** identical pain in every repo that consumes a private GitLab
  npm registry. Pairs with the `varcheck` CI job (§2.4).
- **Proposed shape:** `js-tooling setup-env` (or shipped as a static `setup.sh` template
  via `js-tooling fix setup-env`).

### 2.4 `varcheck` CI job

- **Local file:** `.gitlab-ci.yml:99` (the `varcheck` job)
- **Provides:** fails the pipeline early if `GITLAB_TOKEN` or `NPM_TOKEN` are unset.
- **Why it should move:** every release-publishing repo wants this. Currently a 22-line
  shell block copy-pasted into each `.gitlab-ci.yml`.
- **Proposed shape:** part of the GitLab CI template (§2.5).

### 2.5 GitLab CI template

- **Local file:** `.gitlab-ci.yml` (the entire file is ~95% generic).
- **Provides:** `dependencies`, `lint`, `typecheck`, `commitlint`, `knip`, `doctor`,
  `varcheck`, `test: [22|24]` matrix, `build`, `storybook`, `bundle-size`, `publish`
  (semantic-release with `.npmrc` injection), `renovate` (scheduled).
- **Why it should move:** there's almost nothing in here that's project-specific — even
  the publish job's `.npmrc` injection is generic for any GitLab private-registry consumer.
  The only project-local bits are which build artifacts get cached.
- **Proposed shape:** a hosted template referenced via GitLab's `include: project`:
  ```yaml
  include:
    - project: rtorcato/js-tooling
      file: /ci/gitlab/base.yml
  ```
  Consumers add only their job overrides (e.g. `bundle-size` budget paths,
  custom build targets).

### 2.6 Renovate config

- **Local file:** `renovate.json`
- **Provides:** monthly schedule, semantic-commit naming, grouped updates (eslint,
  semantic-release), lockfile maintenance.
- **Why it should move:** zero project-specific values. Could be a shareable Renovate preset
  (`extends: ["github>rtorcato/js-tooling//renovate"]`) so consumers get a single line.

### 2.7 pnpm-workspace.yaml settings

- **Local file:** `pnpm-workspace.yaml`
- **Provides:** `allowBuilds: esbuild`, `verifyDepsBeforeRun: false`,
  `minimumReleaseAgeExclude: [@rtorcato/js-common, @rtorcato/js-tooling]`.
- **Why it should move:** every js-tooling consumer wants exactly these knobs.
  pnpm 10's supply-chain age cutoff in particular blocks every fresh `@rtorcato/*` publish
  until it ages 24h, so without this every repo trips it.
- **Proposed shape:** `js-tooling fix pnpm-workspace` scaffolds the file; `doctor` checks drift.

---

## 3. Maybe candidates — needs a design call

Generic in *idea*, but the shape needs more thought before upstreaming.

### 3.1 Theme-token smoke test

- **Local file:** `src/test/theme-tokens.test.ts`
- **Provides:** at `pnpm test` time, walks `src/components/**` for `bg-{token}`/
  `text-{token}`/`border-{token}`/`ring-{token}`/`fill-{token}`/`stroke-{token}` usage
  and asserts every non-built-in token is declared as `--color-{token}` under
  `@theme inline` in `globals.css`. Caught the transparent-modal regression that
  surfaced when Storybook came up.
- **Why it might move:** every Tailwind v4 project with a custom design-token layer
  benefits. The check is parameterized by paths (`COMPONENTS_DIR`, `GLOBALS_CSS`) and
  by the built-in-token set.
- **Why it might not:** the Tailwind v4 utility regex is fragile, and the project-local
  built-in list will drift as Tailwind adds families. May want to wrap it with a
  Tailwind-aware tool (e.g. tap into `tailwindcss/lib/util`) instead of regex.
- **Proposed shape (if upstream):** `@rtorcato/js-tooling/vitest/tailwind-tokens`
  exports a `themeTokensSmokeTest({ componentsDir, globalsCss })` factory that
  registers the two `it`s.

### 3.2 PostCSS config

- **Local file:** `postcss.config.cjs` (4 lines: `@tailwindcss/postcss` + `autoprefixer`)
- **Why it might move:** identical for every Tailwind v4 project.
- **Why it might not:** four lines isn't much friction; shipping it as a preset adds an
  import indirection for trivial gain.
- **Proposed shape:** `@rtorcato/js-tooling/postcss/tailwind` re-export — only if §3.4
  ships, because then it'd ride along with the Storybook preset.

### 3.3 knip config

- **Local file:** `knip.json`
- **Why it might move (partial):** the `project: ["!src/**/*.test.{ts,tsx}", ...]` and
  `ignoreDependencies` patterns are generic.
- **Why it might not:** the `entry:` array is the project's actual API surface and must
  stay local. Hard to factor cleanly without a "merge user entry with shared exclusions"
  helper.
- **Proposed shape:** export a `defineConfig({ entry, project, ignoreDependencies })` helper
  that defaults the generic bits. Consumer writes only their `entry` patterns.

### 3.4 Storybook preset

- **Local files:** `.storybook/main.ts`, `.storybook/preview.ts`
- **Provides:** `@storybook/react-vite` + `@storybook/addon-a11y`, light/dark theme toolbar
  that toggles a `dark` class on `<html>`, `@`/`~` alias wiring, Tailwind v4 globals import.
- **Why it might move:** every shadcn-on-Tailwind-v4 project will write the same file.
- **Why it might not:** stories layout (`'../src/**/*.stories.@(ts|tsx)'`) and the globals
  import path are project-local. The theme toolbar is opinionated.
- **Proposed shape:** ship `@rtorcato/js-tooling/storybook/{main,preview}` with the
  framework + addon defaults; consumer's `.storybook/main.ts` extends and only adds
  `stories:`/`viteFinal:` overrides.

---

## 4. Project-local — stays here forever

These reference paths or shapes that are inherent to this repo; upstreaming would
just mean re-parameterizing every constant.

- `biome.jsonc` `files.includes` list (project paths)
- `tsconfig.json` `paths`, `include`, `rootDir`, `baseUrl`
- `vitest.config.mjs` `coverage.include`/`exclude` paths
- `tailwind.config.ts` (also legacy — Tailwind v4 mostly reads `@theme inline` from CSS;
  consider deleting this file as a separate cleanup)
- `components.json` (shadcn-cli configuration)
- `build.mjs` entry-point gathering (per-component decisions about which folders to ship)
- `src/styles/globals.css` (the actual design tokens; the *checker* could move per §3.1
  but the tokens themselves are the brand)
- `bundle-size.json` (project-specific budget numbers, even if the script moves per §2.1)

---

## Suggested rollout order

js-tooling **2.7.0** shipped §2.1's predecessor — `vitest/jsdom-shims` —
in https://github.com/rtorcato/js-tooling/pull/13 and is in use here at
`src/test/setup.ts`. Remaining order:

1. **§2.2 husky hooks** + **§2.3 setup-env** + **§2.7 pnpm-workspace** — bundle the
   "scaffold a new repo correctly" trio; `js-tooling setup` becomes one command
2. **§2.5 GitLab CI template** — once #1 ships, the CI template can reference the same scripts

Defer §2.1 bundle-size and §2.6 Renovate until #1–2 prove the API patterns; both are
self-contained and easy to add later.

§3.* items wait until we hit the same pain in a second project — premature abstraction
risk is high for the theme-token and Storybook ones.

## Lessons from the §2.1 (now-shipped) pilot
- **PR titles must be ≤67 chars** so the squash-merge `(#N)` suffix doesn't
  trip js-tooling's commitlint header-max-length=72 gate. Codified in
  `js-tooling/CONTRIBUTING.md` so future contributors don't relearn this.
- **pnpm `verifyDepsBeforeRun` + `minimumReleaseAge`** can deadlock a repo
  when a fresh transitive dep ages in. js-tooling now has a
  `minimumReleaseAgeExclude` whitelist; shadcn-ui already does. New repos
  should inherit both via the upstream pnpm-workspace template (§2.7).
