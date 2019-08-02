const path = require('path')
const fs = require('fs-extra')
const { getType: getMimetype } = require('mime')
const useTmpDir = require('@m59/use-tmp-dir')
const flat = require('array.prototype.flat')
const mergeDeep = require('merge-deep')
const ProcessorGroup = require('./ProcessorGroup')
const optionsDefaults = require('./filePreviewOptionsDefaults')
const castArray = require('../util/castArray')

const TYPE_NOT_SUPPORTED = 'TYPE_NOT_SUPPORTED'
const makeTypeNotSupportedError = type => Object.assign(
	new Error(`${JSON.stringify(type)} is not supported. There is no processor for this file type.`),
	{ code: TYPE_NOT_SUPPORTED }
)

/*
	Do not expect that a processor will output the desired file type.
	A processor just needs to make a file that is as close to the desired result as it is capable.
	Some files require intermediate conversions.
	i.e. docx -> pdf -> png -> jpg
*/

module.exports = ({ processors }) => {
	const processorGroup = ProcessorGroup(processors)

	const generatePreview = options => {
		options = mergeDeep(optionsDefaults, options)

		const processIntoPreview = async ({
			inputFilePath,
			inputMimetype,
			outputDirectoryPath
		}) => {
			const inputType =  {
				extension: path.extname(inputFilePath),
				mimetype: inputMimetype
			}

			const processor = processorGroup.findProcessorForType(inputType)

			if (!processor) {
				throw makeTypeNotSupportedError(inputType)
			}

			const files = castArray(
				await processor.process({
					...options,
					inputFilePath,
					inputMimetype,
					outputDirectoryPath
				})
			)

			const outputFileExtension = path.extname(files[0]).slice(1)

			return outputFileExtension === options.outputFileExtension
				? files
				: flat(await Promise.all(files.map(file => processIntoPreview ({
					inputFilePath: file,
					// we created this file, so the extension is reliable
					inputMimetype: getMimetype(file),
					outputDirectoryPath
				}))))
		}

		return useTmpDir(async tmpDir => {
			const { inputFilePath, inputMimetype, outputDirectoryPath } = options
			const files = await processIntoPreview ({
				inputFilePath,
				// prefer a given mimetype in case the extension isn't reliable
				inputMimetype: inputMimetype || getMimetype(inputFilePath),
				outputDirectoryPath: tmpDir
			})
			return Promise.all(files.map(async src => {
				const dest = path.join(outputDirectoryPath, path.basename(src))
				await fs.copy(src, dest)
				return dest
			}))
		})
	}

	return Object.assign(generatePreview, {
		...processorGroup,
		TYPE_NOT_SUPPORTED
	})
}
