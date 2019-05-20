const execAsync = require('./execAsync')

const macroFunctionName = `Previewify.Previewify.preparePreviewForFile`

module.exports = async ({ inputFilePath, outputFilePath, width, height }) => {
	const macroFunctionArgs  = [ inputFilePath, outputFilePath, width, height ]
		.filter(v => v != null)
		.map(v => `"${v}"`)
		.join(', ')
	const { stderr } = await execAsync(`libreoffice`, [
		`--headless`,
		`macro:///${macroFunctionName}(${macroFunctionArgs})`
	])
	return outputFilePath
}
