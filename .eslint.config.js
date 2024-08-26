import baseConfig from "@rtorcato/js-tooling/tooling/eslint/base"
import nextConfig from "@rtorcato/js-tooling/tooling/eslint/nextjs"

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["src-ref"],
  },
  ...baseConfig,
  ...nextConfig,
]
