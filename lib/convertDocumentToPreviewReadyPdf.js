const path = require('path')
const convertDocument = require('./convertDocument')
const useTmpDir = require('@m59/use-tmp-dir')
const previewifyDocument = require('./previewifyDocument')
const replaceExtension = require('replace-ext')

const libreOfficeCalcSpreadsheetExtensions = [
	`.ods`,
	`.ots`,
	`.fods`,
	`.uos`,
	`.xlsx`,
	`.xml`,
	`.xls`,
	`.xlt`,
	`.dif`,
	`.dbf`,
	`.html`,
	`.slk`,
	`.csv`,
	`.xlsx`,
	`.xlsm`
]
const isSpreadsheetExtension = extension => libreOfficeCalcSpreadsheetExtensions.includes(extension)

module.exports = options => ({inputFilePath, outputDirectoryPath }) => useTmpDir(async tmpDir => {
	/* const previewReadyDocumentFilePath = isSpreadsheetExtension(path.extname(inputFilePath)) */
	/* 	? await previewifyDocument ({ */
	/* 		...options, */
	/* 		inputFilePath, */
	/* 		outputFilePath: path.join(tmpDir, path.basename(inputFilePath)) */
	/* 	}) */
	/* 	: inputFilePath */
	return convertDocument({
		...options,
		inputFilePath,//: previewReadyDocumentFilePath,
		outputFilePath: path.join(
			outputDirectoryPath,
			replaceExtension(path.basename(inputFilePath), '.pdf')
		)
	})
})
