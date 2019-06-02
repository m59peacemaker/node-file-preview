const fs = require('fs-extra')
const path = require('path')
const execAsync = require('./execAsync')
const useTmpDir = require('@m59/use-tmp-dir')

const makeGeneratePreviewFunction = makeCommand =>
	processingOptions =>
		fileOptions =>
			useTmpDir(async tmpDir => {
				const { outputDirectoryPath } = fileOptions
				const [ command, ...args ] = makeCommand
					(processingOptions)
					({ ...fileOptions, outputDirectoryPath: tmpDir })
				await execAsync(command, args)
				const files = (await fs.readdir(tmpDir))
					.map(name => path.join(outputDirectoryPath, name))
				await fs.copy(tmpDir, outputDirectoryPath)
				return files
			})

module.exports = Object.entries({
	generatePreviewForPdf: require('./make_MuPDF_generate_preview_command'),
	generatePreviewForImage: require('./make_ImageMagick_generate_preview_command'),
	generatePreviewForVideo: require('./make_FFMPEG_generate_preview_command')
})
	.map(([ name, makeCommand ]) => [
		name,
		makeGeneratePreviewFunction(makeCommand)
	])
	.reduce((acc, [ k, v ]) => Object.assign(acc, { [k]: v }), {})
