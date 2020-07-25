const execProcessorCommand = require('../../execProcessorCommand')
const makeCommand = require('./mupdf/makeGeneratePreviewCommand')

module.exports = {
	process: ({ document, image, ...options }) =>
		execProcessorCommand(makeCommand, { ...document, ...image, ...options }),
	supportedTypes: [
		{ extension: 'pdf', mimetype: 'application/pdf' }
	]
}
