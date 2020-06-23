const execProcessorCommand = require('../../execProcessorCommand')
const makeCommand = require('./ffmpeg/makeGeneratePreviewCommand')
const supportedTypes = require('./supportedTypes')
const supportedOutputFileExtensions = [ 'jpg', 'png' ]

module.exports = {
	process: ({ video, image, ...options }) => execProcessorCommand(
		makeCommand,
		{
			...video,
			...image,
			...options,
			outputFileExtension: supportedOutputFileExtensions.includes(options.outputFileExtension) ? options.outputFileExtension : 'png'
		}
	),
	supportedTypes
}
