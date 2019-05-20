const execAsync = require('./execAsync')
const make_unoconv_convert_document_command = require('./make_unoconv_convert_document_command')

module.exports = async options => {
	const { outputFilePath } = options
	const [ command, ...args ] = make_unoconv_convert_document_command(options)
	await execAsync(command, args)
	return outputFilePath
}
