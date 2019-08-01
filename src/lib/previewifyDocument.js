const execAsync = require('../util/execAsync')
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

const macroFunctionName = `Previewify.Previewify.preparePreviewForFile`

// px -> inches 72ppi -> mm -> * 100
const formatDimension = d => Math.round((d / 72) * 25.4) * 100

/*
	undefined or null should be Null
	booleans should be True or False
	strings must be wrapped in quotes
	numbers must not be wrapped in quotes
*/
const macroArgumentify = v => v == null
	? 'Null'
	: typeof v === 'boolean'
		? capitalize(String(v))
		: typeof v === 'string'
			? `"${v}"`
			: v

module.exports = async ({
	inputFilePath,
	outputFilePath,
	cropSpreadsheets = true,
	optimizeCellDimensions = true,
	maxWidth,
	maxHeight
}) => {
	const macroFunctionArgs  = [
		inputFilePath,
		outputFilePath,
		(cropSpreadsheets && maxWidth) ? formatDimension(maxWidth) : false,
		(cropSpreadsheets && maxHeight) ? formatDimension(maxHeight) : false,
		optimizeCellDimensions
	]
		.map(macroArgumentify)
		.join(', ')
	console.log(macroFunctionArgs)
	const { stderr } = await execAsync(`libreoffice`, [
		`--headless`,
		`macro:///${macroFunctionName}(${macroFunctionArgs})`
	])
	return outputFilePath
}
