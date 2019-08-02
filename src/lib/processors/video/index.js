const execProcessorCommand = require('../../execProcessorCommand')
const makeCommand = require('./ffmpeg/makeGeneratePreviewCommand')
const supportedTypes = require('./supportedTypes')

module.exports = {
	process: ({ video, ...options }) => execProcessorCommand(makeCommand, { ...video, ...options }),
	supportedTypes
}
