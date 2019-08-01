const path = require('path')
const replaceExtension = require('replace-ext')
const useTmpDir = require('@m59/use-tmp-dir')
const convertDocument = require('./unoconv/convertDocument')
//const previewifyDocument = require('./libreoffice/previewifyDocument')

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

// TODO: libreoffice previewify stuff is not currently used, so spreadsheet preview is not ideal
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
