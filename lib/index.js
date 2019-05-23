const path = require('path')
const fs = require('fs-extra')
const { getType: getMimetype } = require('mime')
const useTmpDir = require('./useTmpDir')
const convertDocumentToPreviewReadyPdf = require('./convertDocumentToPreviewReadyPdf')
const castArray = v => Array.isArray(v) ? v : [ v ]

const {
	generatePreviewForPdf,
	generatePreviewForImage,
	generatePreviewForVideo
} = require('./generatePreviewFunctions')

// TODO: export a thing to start/stop that unoconv listener that improves unoconv perf

/*
	Do not expect that a processor will output the desired file type.
	A processor just needs to make a file that is as close to the desired result as it is capable.
	Some files require intermediate conversions.
	i.e. docx -> pdf -> png -> jpg
*/
const processors = [
	{
		handles: [ 'document' ],
		process: convertDocumentToPreviewReadyPdf
	},
	{
		handles: [ 'pdf' ],
		process: generatePreviewForPdf
	},
	{
		handles: [ 'image' ],
		process: generatePreviewForImage
	},
	{
		handles: [ 'video' ],
		process: generatePreviewForVideo
	}
]

const generalTypes = processors.flatMap(({ handles }) => handles)

const getGeneralType = mimetype => {
	const [ type, subtype ] = mimetype.split('/')
	return generalTypes
		.find(t => t === type || t === subtype)
		|| 'document'
}

module.exports = (inputProcessingOptions = {}) => {
	const processingOptions = {
		// use file dimensions
		maxWidth = null,
		maxHeight = null,
		outputFileExtension = 'png',

		document = {
			// first page
			startPage = 1,

			// last page
			endPage = Infinity,
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

	const {
		document: documentProcessingOptions,
		video: videoProcessingOptions,
		...generalProcessingOptions
	} = processingOptions
	const processorOptions = {
		...generalProcessingOptions,
		...documentProcessingOptions,
		...videoProcessingOptions
	}

	const processIntoPreview = async ({
		inputFilePath,
		inputMimetype,
		outputDirectoryPath
	}) => {
		const inputGeneralType = getGeneralType(inputMimetype)

		const { process: processStep } = processors
			.find(({ handles }) => handles.includes(inputGeneralType))

		const files = castArray(
			await processStep
				(processorOptions)
				({
					inputFilePath,
					inputMimetype,
					outputDirectoryPath
				})
		)

		const outputFileExtension = path.extname(files[0]).slice(1)

		return outputFileExtension === processorOptions.outputFileExtension
			? files
			: (await Promise.all(files.map(file => processIntoPreview ({
				inputFilePath: file,
				// we created this file, so the extension is reliable
				inputMimetype: getMimetype(file),
				outputDirectoryPath
			})))).flat()
	}

	return ({
		inputFilePath = null,

		// will determine mimetype by extension
		inputMimetype = null,

		outputDirectoryPath = null
	} = {}) => useTmpDir(async tmpDir => {
		const files = await processIntoPreview ({
			inputFilePath,
			// prefer a given mimetype in case the extension isn't reliable
			inputMimetype: inputMimetype || getMimetype(inputFilePath),
			outputDirectoryPath: tmpDir
		})
		return Promise.all(files.flatMap(async src => {
			const dest = path.join(outputDirectoryPath, path.basename(src))
			await fs.copy(src, dest)
			return dest
		}))
	})
}
