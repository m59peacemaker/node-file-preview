const execProcessorCommand = require('../../execProcessorCommand')
const makeCommand = require('./mupdf/makeGeneratePreviewCommand')

module.exports = {
	process: ({ document, ...options }) =>
		execProcessorCommand(makeCommand, { ...document, ...options }),
	supportedTypes: [
		{ extension: 'pdf', mimetype: 'application/pdf' }
	]
}
