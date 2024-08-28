import baseConfig from '@rtorcato/js-tooling/eslint/base'
import nextConfig from '@rtorcato/js-tooling/eslint/nextjs'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [
      'src-ref',
      'coverage',
      'tailwind.config.ts',
      'vite.config.ts',
      'src/test',
    ],
  },
  ...baseConfig,
  ...nextConfig,
]
