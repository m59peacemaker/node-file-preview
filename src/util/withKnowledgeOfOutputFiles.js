const path = require('path')
const fs = require('fs-extra')
const useTmpDir = require('@m59/use-tmp-dir')
/*
	Output files to a new tmp dir so that we can list them before moving them move them to outputDirectoryPath, which may contain other files.
*/

module.exports = (outputDirectoryPath, fn) => useTmpDir(async tmpDir => {
	const result = await fn(tmpDir)
	const files = (await fs.readdir(tmpDir))
		.map(name => path.join(outputDirectoryPath, name))
	await fs.copy(tmpDir, outputDirectoryPath)
	return { result, files }
})
