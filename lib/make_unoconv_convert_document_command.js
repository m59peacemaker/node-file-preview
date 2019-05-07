module.exports = async ({ inputFilePath, outputFilePath, startPage = 1, endPage }) => {
	// endPage -1 (back from end) does not seem to work with unoconv / LibreOffice
	const pageRange = [
		startPage,
		(endPage >= startPage && endPage < Infinity) ? endPage : null
	].filter(v => v !== null).join('-')
	const args = [
		'-e', `PageRange=${pageRange}`,
		'-o', outputFilePath,
		inputFilePath
	]
	return { command: 'unoconv', args }
}
