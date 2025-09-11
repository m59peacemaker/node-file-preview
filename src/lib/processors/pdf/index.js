const execProcessorCommand = require('../../execProcessorCommand')
const makeCommand = require('./pdfium/makeGeneratePreviewCommand')
const path = require('node:path')
const useTmpDir = require('@m59/use-tmp-dir')
const fs = require('node:fs/promises')
const execAsync = require('node:util').promisify(require('node:child_process').execFile)
const pdfjs = require('pdfjs-dist')

const calculate_fit = target => input => Math.min(
	target.width / input.width,
	target.height / input.height
)

module.exports = {
	process: async ({ document, image, ...options }) =>
		useTmpDir(async tmpDir => {
			const tmpInputFilePath = path.join(tmpDir, path.basename(options.inputFilePath))

			const data = new Uint8Array(await fs.readFile(options.inputFilePath))

			const doc = await pdfjs.getDocument({
				data,
				disableFontFace: true,
				isEvalSupported: false,
				enableXfa: false
			}).promise

			const pages = [];
			try {
				for (let p = 1; p <= doc.numPages; p++) {
					const page = await doc.getPage(p)
					const [ x1, y1, x2, y2 ] = page.view
					const length_x = x2 - x1
					const length_y = y2 - y1
					const [ width, height ] = (page.rotate % 180 === 0) ? [ length_x, length_y ] : [ length_y, length_x ]
					const fit = calculate_fit
						({ width: image.maxWidth, height: image.maxHeight })
						({ width, height })
					const scale = Number.isFinite(fit) ? fit : 3
					pages.push({
						number: p,
						x: [ x1, x2 ],
						y: [ y1, y2 ],
						width,
						height,
						fit,
						scale,
						rotate: page.rotate
					})
				}
			} finally {
				doc.destroy()
			}

			await fs.cp(options.inputFilePath, tmpInputFilePath, { recursive: true })

			await Promise.all(pages.map(page => {
				const [ command, ...args ] = makeCommand({
					...document,
					...image,
					...options,
					scale: page.scale,
					startPage: page.number,
					endPage: page.number,
					inputFilePath: tmpInputFilePath,
					outputDirectoryPath: tmpDir
				})
				return execAsync(command, args, { timeout: options.processTimeout, killSignal: 'SIGKILL' })
			}))

			await fs.rm(tmpInputFilePath)

			const files = (await fs.readdir(tmpDir))
				.map(name => path.join(options.outputDirectoryPath, name))

			await fs.cp(tmpDir, options.outputDirectoryPath, { recursive: true })

			return files
		})
	,
	supportedTypes: [
		{ extension: 'pdf', mimetype: 'application/pdf' }
	]
}
