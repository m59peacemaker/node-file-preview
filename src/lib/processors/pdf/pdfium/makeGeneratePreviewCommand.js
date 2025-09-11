// const makeOutputArg = ({
// 	inputFilePath,
// 	maxWidth,
// 	maxHeight,
// 	colorspace,
// 	startPage,
// 	endPage,
// 	outputDirectoryPath,
// 	outputFileExtension
// }) => {
// 	const pageNumberLength = endPage < Infinity ? Math.max(2, String(endPage).length) : null
// 	const originalName = path.basename(inputFilePath, path.extname(inputFilePath))
// 	const identifier = [
// 		originalName,
// 		maxWidth,
// 		maxHeight,
// 		colorspace,
// 		...(pageNumberLength == null ? [] : [ `%0${pageNumberLength}d` ])
// 	]
// 		.map(v => v == null ? '' : v)
// 		.join('_')
// 	const baseName = `${identifier}.${outputFileExtension}`
// 	return path.join(outputDirectoryPath, baseName)
// }

module.exports = ({
	inputFilePath,
	scale,
	startPage = 1,
	endPage = Infinity
}) => {
	endPage === Infinity ? '' : endPage - 1
	return [
		`pdfium_test`, `--png`,
		'--render-oneshot',
		`--pages=${startPage - 1}-${endPage}`,
		`--scale=${scale}`,
		inputFilePath
	]
}
