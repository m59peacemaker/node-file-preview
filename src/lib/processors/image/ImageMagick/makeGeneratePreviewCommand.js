const path = require('path')
const flat = require('array.prototype.flat')

const makeOutputArgument = ({
	inputFilePath,
	outputDirectoryPath,
	outputFileExtension
}) => {
	const originalName = path.basename(inputFilePath, path.extname(inputFilePath))
	const identifier = [ originalName, `%[filename:size]` ].join('_')
	const baseName = `${identifier}.${outputFileExtension}`
	return path.join(outputDirectoryPath, baseName)
}

module.exports = ({
	inputFilePath,
	outputDirectoryPath,

	maxWidth = null,
	maxHeight = null,
	outputFileExtension = 'png'
}) => {
	const dimensions = (Number.isFinite(maxWidth) || Number.isFinite(maxHeight))
		? [ maxWidth, maxHeight ].map(v => v != null ? v : '').join('x')
		: null

	return flat([
		`convert`,
		inputFilePath,
		'-strip',
		(dimensions ? [ '-resize', dimensions ] : []),
		'-alpha', 'background',
		'-colorspace', 'sRGB',
		'-set', 'filename:size', `%[w]x%[h]`,
		makeOutputArgument({
			inputFilePath,
			outputDirectoryPath,
			outputFileExtension
		})
	])
}
