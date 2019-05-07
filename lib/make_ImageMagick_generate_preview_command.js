const path = require('path')

module.exports = ({
	startPage = 1,
	endPage = -1,
	width = null,
	height = null,
	quality = 92
}) => ({
	inputFilePath,
	outputDirectoryPath,
	outputFileExtension = 'jpg'
}) => {
	const dimensions = (width || height)
		? [ width, height ].map(v => v != null ? v : '').join('x')
		: null

	const makeOutputPath = marker => path.join(
		outputDirectoryPath,
		[
			path.basename(inputFilePath, path.extname(inputFilePath)),
			'_',
			marker,
			`.${outputFileExtension}`
		].join('')
	)

	const pageNumberLength = (endPage > startPage && endPage < Infinity)
		? Math.max(2, String(endPage).length)
		: 4
	const outputArg = makeOutputPath(`%0${pageNumberLength}d_%[filename:size]`)
	const outputGlob = makeOutputPath('*')

	const pageRange = [
		startPage,
		(endPage === Infinity) ? null : endPage
	]
		.filter(v => v !== null)
		// imagemagick page range starts from 0, but our option starts from 1
		.map(v => v - (v > 0 ? 1 : 0))

	const args = [
		`${inputFilePath}[${pageRange.join('-')}]`,
		'-scene', pageRange[0],
		...(dimensions ? [ '-resize', dimensions ] : []),
		...(quality != null ? [ '-quality', quality ] : []),
		'-set', 'filename:size', `%[w]x%[h]`,
		outputArg
	]
	return { command: 'convert', args }
}
