const execAsync = require('./execAsync')

const macroFunctionName = `Previewify.Previewify.preparePreviewForFile`

module.exports = async ({ inputFilePath, outputFilePath, maxWidth, maxHeight }) => {
	const macroFunctionArgs  = [ inputFilePath, outputFilePath, maxWidth, maxHeight ]
		.filter(v => v != null)
		.map(v => `"${v}"`)
		.join(', ')
	const { stderr } = await execAsync(`libreoffice`, [
		`--headless`,
		`macro:///${macroFunctionName}(${macroFunctionArgs})`
	])
	return outputFilePath
}
