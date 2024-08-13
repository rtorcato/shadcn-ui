// import resolve from '@rollup/plugin-node-resolve';
import { readFileSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import alias from "@rollup/plugin-alias"
// import { babel } from "@rollup/plugin-babel"
import pluginCommonjs from "@rollup/plugin-commonjs"
import image from "@rollup/plugin-image"
import pluginNodeResolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import pluginTypescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import postcss from "rollup-plugin-postcss"
import ts from "typescript"

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"))
const moduleName = packageJson.name.replace(/^@.*\//, "")
const banner = `
  /**
   * @license
   * author: ${packageJson.author}
   * ${moduleName}.js v${packageJson.version}
   * Released under the ${packageJson.license} license.
   */`
const inputFileName = "src/index.ts"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createExternals = (pkg) => [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

// const createTildeResolver = () => {
//   return (node) => {
//     if (
//       ts.isImportDeclaration(node) &&
//       node.moduleSpecifier &&
//       ts.isStringLiteral(node.moduleSpecifier) &&
//       node.moduleSpecifier.text.startsWith("~/")
//     ) {
//       const newModuleSpecifier = ts.factory.createStringLiteral(
//         node.moduleSpecifier.text.replace("~/", "../")
//       )
//       return ts.factory.updateImportDeclaration(
//         node,
//         node.decorators,
//         node.modifiers,
//         node.importClause,
//         newModuleSpecifier,
//         node.assertClause
//       )
//     }
//     return node
//   }
// }

export default [
  {
    input: inputFileName,
    output: [
      {
        name: moduleName,
        // file: packageJson.main,
        dir: "dist/cjs",
        format: "cjs",
        sourcemap: true,
        // preserveModules: true,
        preserveModulesRoot: "src",
        // dir: "dist/cjs",
        exports: "named",
        banner,
      },
      {
        name: moduleName,
        // file: packageJson.module,
        dir: "dist/esm",
        format: "esm",
        // dir: "dist/esm",
        // preserveModules: true,
        preserveModulesRoot: "src",
        sourcemap: true,
        exports: "named",
        banner,
      },
    ],
    plugins: [
      peerDepsExternal(),
      // resolve({
      //   extensions: [".js", ".jsx", ".ts", ".tsx"],
      // }),
      // babel({
      //   babelHelpers: "bundled",
      //   configFile: path.resolve(__dirname, ".babelrc.js"),
      // }),
      pluginNodeResolve({
        browser: false,
      }),
      pluginCommonjs({
        extensions: [".js", ".ts"],
      }),
      pluginTypescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        // outDir: "dist",
        declarationDir: "./dist/types",
        // declarationDir: "dist/types",
        rootDir: "./src",
        exclude: ["**/__tests__", "**/*.test.ts", "**/*.test.tsx", "dist"],
        // transformers: {
        //   before: [
        //     {
        //       type: "program",
        //       factory: (program) => {
        //         const typeChecker = program.getTypeChecker()
        //         return (ctx) => {
        //           const tildeResolver = createTildeResolver()
        //           return (sourceFile) => ts.visitNode(sourceFile, tildeResolver)
        //         }
        //       },
        //     },
        //   ],
        // },
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
      "tailwind-merge",
      "clsx",
      "react-day-picker",
      "embla-carousel-react",
      "vaul",
      "recharts",
      "input-otp",
      "react-resizable-panels",
      ...createExternals(packageJson),
    ],
  },
  {
    input: "dist/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
    external: createExternals(packageJson),
  },
  // {
  //   input: "dist/esm/types/index.d.ts",
  //   output: {
  //     file: "dist/index.d.ts",
  //     format: "cjs",
  //     preserveModulesRoot: "src",
  //     exports: "named",
  //   },
  //   external: [/\.css$/],
  //   plugins: [dts()],
  // },
  // {
  //   input: "dist/esm/types/index.d.ts",
  //   external: [/\.css$/],
  //   output: {
  //     file: "dist/esm/index.d.ts",
  //     format: "es",
  //     preserveModulesRoot: "src",
  //     exports: "named",
  //   },
  //   plugins: [dts()],
  // },
]
