import esbuild from "esbuild"
import { nodeExternalsPlugin } from "esbuild-node-externals"

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outdir: "dist",
    bundle: true,
    sourcemap: true,
    minify: true,
    splitting: true,
    format: "esm",
    target: ["esnext"],
    plugins: [nodeExternalsPlugin()],
  })
  .catch(() => process.exit(1))
