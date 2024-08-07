// import resolve from '@rollup/plugin-node-resolve';
import { readFileSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import alias from "@rollup/plugin-alias"
import commonjs from "@rollup/plugin-commonjs"
import image from "@rollup/plugin-image"
// import resolve from '@rollup/plugin-node-resolve';
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
// import external from 'rollup-plugin-peer-deps-external';
import postcss from "rollup-plugin-postcss"

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"))
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
        // preserveModules: true,
        // dir: "dist/cjs",
        exports: "named",
      },
      {
        file: packageJson.module,
        format: "esm",
        // preserveModules: true,
        // dir: "dist/esm",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins: [
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        outDir: "dist",
        // declarationDir: "dist/types",
        rootDir: "./src",
        exclude: ["*/**/test"],
      }),
      alias({
        entries: [{ find: "~", replacement: path.resolve(__dirname, "src") }],
      }),
      postcss({
        extract: path.resolve("dist/styles.css"),
        minimize: true,
        modules: false,
      }),
      terser(),
      image(),
    ],
    external: [
      /\.css$/, // telling rollup anything that is .css aren't part of type exports
      "react",
      "react-dom",
      "react/jsx-runtime",
      // "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      // Add any other dependencies you want to keep external
    ],
  },

  {
    input: "src/index.ts",
    output: { file: "dist/cjs/index.d.ts", format: "cjs" },
    external: [/\.css$/],
    plugins: [dts()],
  },
  {
    input: "src/index.ts",
    external: [/\.css$/],
    output: { file: "dist/esm/index.d.ts", format: "esm" },
    plugins: [dts()],
  },
]
