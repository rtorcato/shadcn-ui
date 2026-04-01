# TODOs

- [ ] Commit new files — `CLAUDE.md`, `.claude/settings.json`, `.claude/skills/` are team-shared and should be checked in
- [ ] Install the skill-creator plugin — `/plugin install skill-creator@claude-plugins-official` — lets you create and refine skills using evals
- [ ] Add Storybook or visual test setup — 50+ components but no visual regression layer; consider `/plugin install playwright@claude-plugins-official`
- [ ] Add a `/release` skill — document the semantic-release flow (conventional commits → CI → GitLab publish) for new contributors
- [ ] Browse official plugins — `/plugin` shows the full catalog; MCP servers and agent bundles for design systems, accessibility checks, etc.
- [ ] Fill in the empty pre-push hook — `.husky/pre-push` is currently a no-op; consider running `pnpm test` to catch failures before CI
