// import resolve from '@rollup/plugin-node-resolve';
import { readFileSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import alias from "@rollup/plugin-alias"
import commonjs from "@rollup/plugin-commonjs"
import image from "@rollup/plugin-image"
import resolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import postcss from "rollup-plugin-postcss"
import ts from "typescript"

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"))
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
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
        // preserveModules: true,
        preserveModulesRoot: "src",
        // dir: "dist/cjs",
        exports: "named",
      },
      {
        file: packageJson.module,
        format: "esm",
        // preserveModules: true,
        // dir: "dist/esm",
        preserveModulesRoot: "src",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins: [
      peerDepsExternal(),
      // resolve({
      //   extensions: [".js", ".jsx", ".ts", ".tsx"],
      // }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        outDir: "dist",
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
      "class-variance-authority",
      "tailwind-merge",
      "clsx",
      "react-day-picker",
      "embla-carousel-react",
      "vaul",
      "recharts",
      "input-otp",
      "react-resizable-panels",
      // Add any other dependencies you want to keep external
      ...createExternals(packageJson),
    ],
  },
  // {
  //   input: "src/index.ts",
  //   output: {
  //     file: "dist/cjs/index.d.ts",
  //     format: "cjs",
  //     preserveModulesRoot: "src",
  //   },
  //   external: [/\.css$/],
  //   plugins: [dts()],
  // },
  // {
  //   input: "src/index.ts",
  //   external: [/\.css$/],
  //   output: {
  //     file: "dist/esm/index.d.ts",
  //     format: "esm",
  //     preserveModulesRoot: "src",
  //   },
  //   plugins: [dts()],
  // },
]
