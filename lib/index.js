const { getType: getMimetype } = require('mime')
const generatePreviewForVideo = require('./generatePreviewForVideo')
const generatePreviewForImageOrPdf = require('./generatePreviewForImageOrPdf')
const convertDocumentToPreviewReadyPdf = require('./convertDocumentToPreviewReadyPdf')
const useTmpDir = require('./useTmpDir')

// TODO: export a thing to start/stop that unoconv listener that improves unoconv perf

const previewGenerators = [
	{
		handles: [ 'image', 'pdf' ],
		generate: processingOptions => {
			const { document, video, ...general } = processingOptions
			return generatePreviewForImageOrPdf({ ...general, ...document })
		}
	},
	{
		handles: [ 'video' ],
		generate: processingOptions => {
			const { document, video, ...general } = processingOptions
			return generatePreviewForVideo({ ...general, ...video })
		}
	}
]

const previewGeneratorTypes = previewGenerators
	.map(({ handles }) => handles)
	.reduce((acc, types) => acc.concat(types), [])

const getGeneralType = mimetype => {
	const [ type, subtype ] = mimetype.split('/')
	return previewGeneratorTypes
		.find(t => t === type || t === subtype)
		|| 'document'
}

module.exports = (inputProcessingOptions = {}) => {
	const processingOptions = {
		// use file dimensions
		maxWidth = null,
		maxHeight = null,

		/*
			1-100
			Defaults:
				- ImageMagick: based on file quality if possible, otherwise 92
				- FFmpeg: 100
		*/
		quality = null,

		// color to use when background fill is required (i.e. transparent png to jpg)
		background = '#FFFFFF',

		outputFileExtension = 'jpg',

		document = {
			// first page
			startPage = 1,

			// last page
			endPage = -1,
		} = {},

		video = {
			// take first frame, and then a frame after a minute for 4 more minutes (5 total images)
			startTimeOffsetSeconds = 0,
			intervalSeconds = 60,
			maxThumbnails = 5,
			// chooses the best image for a thumbnail among N frames
			// lower = better performance, higher = better results
			framesConsideredPerThumbnail = 60
		} = {}
	} = inputProcessingOptions

	return ({
		inputFilePath = null,

		// will determine mimetype by extension
		inputMimetype = null,

		outputDirectoryPath = null
	} = {}) => useTmpDir(async tmpDir => {
		const chosenInputMimetype = inputMimetype || getMimetype(inputFilePath)
		const inputGeneralType = getGeneralType(chosenInputMimetype)

		const previewInput = inputGeneralType === 'document'
			? {
				filePath: await convertDocumentToPreviewReadyPdf({
					inputFilePath: inputFilePath,
					outputDirectoryPath: tmpDir,
					...processingOptions.document
				}),
				generalType: 'pdf'
			}
			: {
				filePath: inputFilePath,
				generalType: inputGeneralType
			}
		
		const { generate } = previewGenerators
			.find(({ handles }) => handles.includes(previewInput.generalType))
		return generate
			(processingOptions)
			({
				inputFilePath: previewInput.filePath,
				inputMimetype: chosenInputMimetype,
				outputDirectoryPath
			})
	})
}
