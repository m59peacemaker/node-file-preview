const execAsync = require('./execAsync')
const make_unoconv_convert_document_command = require('./make_unoconv_convert_document_command')
const pRetry = require('p-retry')

const retryListenerConnectionFailures = fn => pRetry(
	async () => {
		try {
			return await fn()
		} catch (error) {
			throw (
				error.message.includes('Error: Existing listener not found.')
					? error
					: new pRetry.AbortError(error)
			)
		}
	},
	{
		retries: 3,
		minTimeout: 1000,
		factor: 3
	}
)

module.exports = async options => {
	const { outputFilePath } = options
	const [ command, ...args ] = make_unoconv_convert_document_command(options)
	await retryListenerConnectionFailures(() => execAsync(command, args))
	return outputFilePath
}
