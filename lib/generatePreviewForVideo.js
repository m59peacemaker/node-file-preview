const fs = require('fs-extra')
const path = require('path')
const execAsync = require('./execAsync')
const useTmpDir = require('./useTmpDir')
const make_FFMPEG_generate_preview_command = require('./make_FFMPEG_generate_preview_command')

module.exports = processingOptions => fileOptions => useTmpDir(async tmpDir => {
	const { outputDirectoryPath } = fileOptions
	const [ command, ...args ] = make_FFMPEG_generate_preview_command
		(processingOptions)
		({ ...fileOptions, outputDirectoryPath: tmpDir })
	await execAsync(command, args)
	const files = (await fs.promises.readdir(tmpDir))
		.map(name => path.join(fileOptions.outputDirectoryPath, name))
	await fs.copy(tmpDir, outputDirectoryPath)
	return { files }
})
