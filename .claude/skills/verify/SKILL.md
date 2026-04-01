---
name: verify
description: Run the full verification suite (typecheck + biome check + tests) before marking work done. Use this after making changes to confirm nothing is broken.
---

Run the following commands in sequence and report the results. Stop on first failure and surface the error clearly.

```bash
pnpm typecheck
pnpm check
pnpm test
```

If all pass, confirm to the user that typecheck, lint/format, and tests are green.
If any fail, show the relevant error output and suggest a fix.
