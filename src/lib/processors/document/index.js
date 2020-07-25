const path = require('path')
const replaceExtension = require('replace-ext')
const convertDocument = require('./unoconv/convertDocument')
const supportedTypes = require('./supportedTypes')

module.exports = {
	process: ({ document, inputFilePath, outputDirectoryPath, ...options }) =>
		convertDocument({
			...options,
			...document,
			inputFilePath,
			outputFilePath: path.join(
				outputDirectoryPath,
				replaceExtension(path.basename(inputFilePath), '.pdf')
			)
		}),
	supportedTypes
}
