const fs = require('fs-extra')
const path = require('path')
const useTmpDir = require('@m59/use-tmp-dir')
const execAsync = require('../util/execAsync')

/*
	Output files to a new tmp dir so that we can list them before moving them move them to outputDirectoryPath, which may contain other files.
*/
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
	generatePreviewForPdf: require('./mupdf/makeGeneratePreviewCommand'),
	generatePreviewForImage: require('./ImageMagick/makeGeneratePreviewCommand'),
	generatePreviewForVideo: require('./ffmpeg/makeGeneratePreviewCommand')
})
	.map(([ name, makeCommand ]) => [
		name,
		makeGeneratePreviewFunction(makeCommand)
	])
	.reduce((acc, [ k, v ]) => Object.assign(acc, { [k]: v }), {})
