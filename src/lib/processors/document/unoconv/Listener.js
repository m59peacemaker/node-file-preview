const { spawn } = require('child_process')
const terminate = require('util').promisify(require('terminate'))

const defaults = {
	port: 2002,
	silent: false
}

const Listener = async (options = defaults) => {
	const { port, silent } = { ...defaults, ...options }
	const proc = spawn(
		'unoconv',
		[
			'--listener',
			'--port', port,
			...(silent ? [] : [ '-vvv' ])
		],
		{
			...(silent ? {} : { stdio: 'inherit' } )
		}
	)
	return {
		process: proc,
		terminate: async () => terminate(proc.pid).catch(() => {})
	}
}

module.exports = options => {
	let listener
	const startListener = async () => {
		listener = await Listener(options)
		listener.process.once('exit', startListener)
	}
	startListener()

	return {
		terminate: () => {
			listener.process.removeListener('exit', startListener)
			return listener.terminate()
		}
	}
}
