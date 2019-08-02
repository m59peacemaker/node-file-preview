const convertDocumentToPreviewReadyPdf = require('./convertDocumentToPreviewReadyPdf')
const supportedTypes = require('./supportedTypes')

module.exports = {
	process: ({ document, ...options }) =>
		convertDocumentToPreviewReadyPdf({ ...document, ...options }),
	supportedTypes
}
