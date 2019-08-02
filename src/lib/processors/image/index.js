const execProcessorCommand = require('../../execProcessorCommand')
const makeCommand = require('./ImageMagick/makeGeneratePreviewCommand')
const supportedTypes = require('./supportedTypes')

module.exports = {
	process: ({ image, ...options }) => execProcessorCommand(makeCommand, { ...image, ...options }),
	supportedTypes
}
