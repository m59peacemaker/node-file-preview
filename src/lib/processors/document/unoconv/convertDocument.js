const pRetry = require('p-retry')
const execAsync = require('util').promisify(require('child_process').execFile)
const makeConvertDocumentCommand = require('./makeConvertDocumentCommand')

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
		retries: 2,
		minTimeout: 1000,
		factor: 3
	}
)

module.exports = async options => {
	const { outputFilePath } = options
	const [ command, ...args ] = makeConvertDocumentCommand(options)
	await retryListenerConnectionFailures(() => execAsync(command, args, { timeout: options.processTimeout, killSignal: 'SIGKILL' }))
	return outputFilePath
}
