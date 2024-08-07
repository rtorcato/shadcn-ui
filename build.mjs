import fs from "fs/promises"
import path from "path"
import esbuild from "esbuild"
import { nodeExternalsPlugin } from "esbuild-node-externals"

async function getEntryPoints(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const entryPoints = entries
    .filter((entry) => !entry.isDirectory() && entry.name.endsWith(".ts"))
    .map((entry) => path.join(dir, entry.name))
  console.log("Found entry points:", entryPoints)
  return entryPoints
}

async function build() {
  const allEntryPoints = await getEntryPoints("src/components")
  allEntryPoints.push(...(await getEntryPoints("src/hooks")))
  allEntryPoints.push(...(await getEntryPoints("src/lib")))

  console.log("All entry points:", allEntryPoints)
  await esbuild.build({
    // entryPoints: ["src/index.ts"],
    entryPoints: allEntryPoints,
    outdir: "dist",
    bundle: true,
    sourcemap: true,
    minify: true,
    splitting: true,
    format: "esm",
    target: ["esnext"],
    bundle: true,
    splitting: true,
    chunkNames: "chunks/[name]-[hash]",
    external: ["react", "react-dom"], // Add other external dependencies here
    // plugins: [
    //   {
    //     name: 'make-all-packages-external',
    //     setup(build) {
    //       let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/; // Must not start with "/" or "./" or "../"
    //       build.onResolve({ filter }, args => ({ path: args.path, external: true }));
    //     },
    //   },
    // ],
    plugins: [nodeExternalsPlugin()],
  })
}

build().catch((e) => {
  console.error(e)
  process.exit(1)
})
