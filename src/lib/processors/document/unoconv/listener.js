const { spawn } = require('child_process')
const tryConnect = require('try-net-connect')
const terminate = require('util').promisify(require('terminate'))

const defaults = {
	port: 2002,
	silent: false,
	initTimeoutMs: 3000
}

const listen = (options = defaults) => {
	const { port, silent, initTimeoutMs } = { ...defaults, ...options }
	// It is very difficult to get the logs from the unoconv process. Using `script --command` is the best way I could figure out.
	const proc = spawn('script', [ '--quiet', '--command', `unoconv -vvv --listener --port ${port}`, '/dev/null' ])
	const terminateProc = async () => terminate(proc.pid).catch(() => {})

	if (!silent) {
		proc.stdout.pipe(process.stdout)
		proc.stderr.pipe(process.stderr)
	}

	return {
		init: new Promise((resolve, reject) => {
			proc.on('error', reject)
			tryConnect({
				retry: 500,
				retries: 10,
				host: '127.0.0.1',
				port: port
			}).on('connected', resolve)
				.on('timeout', reject)
		}),
		process: proc,
		terminate: terminateProc
	}
}

const listenForever = options => {
	let listener

	const restartListener = () => {
		listener = listen(options)
		listener.process.once('exit', restartListener)
	}

	restartListener()

	return {
		init: listener.init,
		terminate: () => {
			listener.process.removeListener('exit', restartListener)
			return listener.terminate()
		}
	}
}

const use = options => async useFn => {
	const listener = listenForever(options)
	await listener.init
	try {
		return await useFn()
	} finally {
		await listener.terminate()
	}
}

module.exports = {
	listen,
	listenForever,
	use
}
