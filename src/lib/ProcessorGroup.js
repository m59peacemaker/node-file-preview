const flatMap = require('array.prototype.flatmap')
const prepareTypesList = require('./prepareTypesList')

module.exports =  processors => {
	const supportedTypes = prepareTypesList(
		flatMap(processors, ({ supportedTypes }) => supportedTypes)
	)

	const findProcessorForTypeBy = (key, type) => processors
		.find(({ supportedTypes }) =>
			supportedTypes.find(supportedType => supportedType[key] === type[key])
		)

	const findProcessorForType = type =>
		findProcessorForTypeBy('mimetype', type)
		|| findProcessorForTypeBy('extension', type)

	const supports = ({ extension, mimetype }) => !!findProcessorForType({ extension, mimetype })

	return {
		supportedTypes,
		supports,
		findProcessorForType
	}
}
