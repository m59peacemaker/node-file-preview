var path = require('path')
var fs = require('fs')
var os = require('os')
const { getType: getMimetype } = require('mime')
const generatePreviewForVideo = require('./generatePreviewForVideo')

// TODO: export a thing to start/stop that unoconv listener that improves unoconv perf

const previewGenerators = [
	{
		handles: [ 'image', 'pdf' ],
		generate: () => {}
	},
	{
		handles: [ 'video' ],
		generate: () => {}
	}
]

const previewGeneratorTypes = previewGenerators
	.map(({ handles }) => handles)
	.reduce((acc, types) => acc.concat(types), [])

const getGeneralType = mimetype => {
	const [ type, subtype ] = inputMimetype.split('/')
	return previewGeneratorTypes
		.find(t => t === type || t === subtype)
		|| 'document'
}

const generate = ({
	// TODO: un arrrrrrrg this situation
	aarrrggggggggggg = {
		// use file
		width = null,
		height = null,

		/*
			1-100
			Defaults:
				- ImageMagick: based on file quality if possible, otherwise 92
				- FFmpeg: 100
		*/
		quality = null,

		// color to use when background fill is required (i.e. transparent png to jpg)
		background = '#ffffff',
	} = {},

	document = {
	// first page
		startPage = 1,

		// last page
		endPage = -1
	} = {},

	video = {
		// take first frame, and then a frame after a minute for 4 more minutes (5 total images)
		startTimeOffsetSeconds = 0,
		intervalSeconds = 60,
		maxThumbnails = 5,
		// chooses the best image for a thumbnail among N frames (lower performs better)
		framesConsideredPerThumbnail = 60
	} = {}
} = {}) => ({
	inputFilePath = null,

	// will determine mimetype by extension
	inputMimetype = null,

	outputDirectoryPath = null,

	// for output file name and format
	outputFileExtension = 'jpg'
} = {}) => useTmpDir(async tmpDir => {
	const chosenInputMimetype = inputMimetype || getMimetype(inputFilePath)
	const inputGeneralType = getGeneralType(chosenInputMimetype)

	const previewInput = inputGeneralType === 'document'
		? {
			filePath: await convertDocument({
				inputFilePath: input.filePath,
				outputFilePath: path.join(tmpDir, replaceExtension(path.basename(inputFilePath), 'pdf')),
				startPage,
				endPage
			}),
			generalType: 'pdf'
		}
		: {
			filePath: input.filePath,
			generalType: inputGeneralType
		}
	
	const { generate } = previewGenerators
		.find(({ handles }) => handles.includes(previewInput.generalType))
	return generate (processingOptions) (previewInput)
}
