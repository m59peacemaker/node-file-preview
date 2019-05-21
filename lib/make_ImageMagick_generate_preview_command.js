const path = require('path')

const makeOutputArg = ({
	quality,
	background,
	outputFileExtension,
	startPage,
	endPage,
	inputFilePath,
	outputDirectoryPath
}) => {
	const pageNumberLength = (endPage > startPage && endPage < Infinity)
		? Math.max(2, String(endPage).length)
		: 4
	const originalName = path.basename(inputFilePath, path.extname(inputFilePath))
	const identifier = [
		originalName,
		`%[filename:size]`,
		background.replace(/[^\w]/g, ''),
		quality,
		`%0${pageNumberLength}d`
	]
		.map(v => v == null ? '' : v)
		.join('_')
	const baseName = `${identifier}.${outputFileExtension}`
	return path.join(outputDirectoryPath, baseName)
}

module.exports = ({
	maxWidth = null,
	maxHeight = null,
	quality = null,
	background = '#FFFFFF',
	outputFileExtension = 'jpg',
	startPage = 1,
	endPage = -1
}) => ({
	inputFilePath,
	outputDirectoryPath
}) => {
	const dimensions = (maxWidth || maxHeight)
		? [ maxWidth, maxHeight ].map(v => v != null ? v : '').join('x')
		: null

	const greaterDimension = Math.max(maxWidth || 0, maxHeight || 0)
	const maxDensity = greaterDimension > 0 ? Math.ceil(greaterDimension / 6) : 300
	const densityModifier = (quality === null ? 100 : quality) / 100
	const density = Math.ceil(maxDensity * densityModifier)

	const pageRange = [
		startPage,
		(endPage === Infinity) ? null : endPage
	]
		.filter(v => v !== null)
		// imagemagick page range starts from 0, but our option starts from 1
		.map(v => v - (v > 0 ? 1 : 0))

	return [
		`convert`,
		`-density`, density,
		`${inputFilePath}[${pageRange.join('-')}]`,
		'-scene', pageRange[0],
		(dimensions ? [ '-resize', dimensions ] : []),
		(quality != null ? [ '-quality', quality ] : []),
		(background != null
			? [ `-background`, background, `-alpha`, `remove`, `-alpha`, `off` ]
			: []
		),
		'-set', 'filename:size', `%[w]x%[h]`,
		makeOutputArg({
			quality,
			background,
			outputFileExtension,
			startPage,
			endPage,
			inputFilePath,
			outputDirectoryPath
		})
	].flat()
}
