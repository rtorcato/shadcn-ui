import path from 'path'
import esbuild from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import fs from 'fs/promises'

// import { visualizer } from 'esbuild-visualizer'
// import { analyze } from 'esbuild-plugin-analyze'

async function getEntryPoints(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true })
	const entryPoints = entries
		.filter(
			(entry) =>
				!entry.isDirectory() && entry.name.endsWith('index.ts') && !entry.name.includes('.test.')
		)
		.map((entry) => path.join(dir, entry.name))
	return entryPoints
}

async function getComponentEntryPoints(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true })
	return entries
		.filter(
			(entry) => entry.isFile() && entry.name.endsWith('.tsx') && !entry.name.includes('.test.')
		)
		.map((entry) => path.join(dir, entry.name))
}

async function getFileEntryPoints(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true })
	return entries
		.filter(
			(entry) => entry.isFile() && entry.name.endsWith('.ts') && !entry.name.includes('.test.')
		)
		.map((entry) => path.join(dir, entry.name))
}

const hookEntryPoints = await getFileEntryPoints('src/hooks')
const uiEntryPoints = await getComponentEntryPoints('src/components/ui')
const uiExtendedEntryPoints = await getComponentEntryPoints('src/components/ui-extended')
const baseEntryPoints = await getComponentEntryPoints('src/components')
const libEntryPoints = await getFileEntryPoints('src/lib')
// allEntryPoints.push(...(await getEntryPoints("src/components")))
// allEntryPoints.push(...(await getEntryPoints("src/hooks")))
// allEntryPoints.push(...(await getEntryPoints("src/lib")))

async function build() {
	const allEntryPoints = [
		...baseEntryPoints,
		...uiEntryPoints,
		...uiExtendedEntryPoints,
		...hookEntryPoints,
		...libEntryPoints,
	]

	console.log('All entry points:', allEntryPoints)
	const result = await esbuild.build({
		// entryPoints: ["src/index.ts"],
		entryPoints: allEntryPoints,
		outdir: 'dist',
		bundle: true,
		sourcemap: true,
		minify: true,
		splitting: true,
		format: 'esm',
		target: ['esnext'],
		bundle: true,
		metafile: true,
		splitting: true,
		// logLevel: 'verbose',  // Add this line
		chunkNames: 'chunks/[name]-[hash]',
		external: ['react', 'react-dom'], // Add other external dependencies here
		plugins: [
			// visualizer({
			//   filename: 'bundle-visualizer.html' || 'bundle.html', // Ensure the output file path is not undefined
			//   // filename: 'dist/stats.html',
			//   open: true, // Opens in browser automatically
			//   format: 'json', // Other formats: 'html', 'json', 'treemap'
			// }),
			// analyze({ summaryOnly: true }), // Generates stats.json
			nodeExternalsPlugin({
				// These modules won't be externalized and will be included in the bundle
				// allowList: ['some-module', 'another-module'],
			}),
		],
		// plugins: [
		//   {
		//     name: 'make-all-packages-external',
		//     setup(build) {
		//       let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/; // Must not start with "/" or "./" or "../"
		//       build.onResolve({ filter }, args => ({ path: args.path, external: true }));
		//     },
		//   },
		// ],
	})
	// console.log(result)
	if (result.metafile) {
		// Ensure that metafile exists before trying to write it
		await fs.writeFile('meta.json', JSON.stringify(result.metafile))
		console.log('Metafile generated: meta.json')
	} else {
		console.error('Metafile is undefined. Build might have failed.')
	}
}

build().catch((e) => {
	console.error(e)
	process.exit(1)
})
