const path = require('path')
const flat = require('array.prototype.flat')

const makeOutputArg = ({
	inputFilePath,
	maxWidth,
	maxHeight,
	colorspace,
	startPage,
	endPage,
	outputDirectoryPath,
	outputFileExtension
}) => {
	const pageNumberLength = endPage < Infinity ? Math.max(2, String(endPage).length) : null
	const originalName = path.basename(inputFilePath, path.extname(inputFilePath))
	const identifier = [
		originalName,
		maxWidth,
		maxHeight,
		colorspace,
		...(pageNumberLength == null ? [] : [ `%0${pageNumberLength}d` ])
	]
		.map(v => v == null ? '' : v)
		.join('_')
	const baseName = `${identifier}.${outputFileExtension}`
	return path.join(outputDirectoryPath, baseName)
}

module.exports = ({
	maxWidth = null,
	maxHeight = null,

	startPage = 1,
	endPage = Infinity,

	// false = white background, true = transparent background
	alpha = false,

	outputFileExtension = 'png'
}) => ({
	inputFilePath,
	outputDirectoryPath
}) => {
	endPage = endPage === Infinity ? 'N' : endPage
	const pageRange = [ startPage, endPage ]

	// rgb and rgba should produce sRGB
	const colorspace = alpha ? 'rgba' : 'rgb'

	return flat([
		`mutool`, `draw`,
		`-L`, // low memory mode
		'-o', makeOutputArg({
			inputFilePath,
			maxWidth,
			maxHeight,
			colorspace,
			startPage,
			endPage,
			outputDirectoryPath,
			outputFileExtension
		}),
		(maxWidth != null ? [ '-w', maxWidth ] : []),
		(maxHeight != null ? [ '-h', maxHeight ] : []),
		'-r', 72, // resolution
		'-c', colorspace,
		inputFilePath, pageRange.join('-'),
	])
}
