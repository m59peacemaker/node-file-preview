const { spawn } = require('child_process')
const tryConnect = require('try-net-connect')
const disposer_module = import('@m59/disposer')

const defaults = {
	port: 2002,
	silent: false
}

const listen = (options = defaults) => {
	const { port, silent } = { ...defaults, ...options }
	const proc = spawn('unoconv', [ '-vvv', '--listener', '--port', port ])

	if (!silent) {
		proc.stdout.pipe(process.stdout)
		proc.stderr.pipe(process.stderr)
	}

	return {
		init: new Promise((resolve, reject) => {
			proc.on('error', reject)
			tryConnect({
				retry: 500,
				retries: 20,
				host: '127.0.0.1',
				port: port
			}).on('connected', resolve)
				.on('timeout', reject)
		}),
		process: proc,
		// SIGTERM seems not to kill unoconv
		terminate: () => proc.kill('SIGINT'),
		terminate_sync: () => proc.kill('SIGINT')
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
		},
		terminate_sync: () => {
			listener.process.removeListener('exit', restartListener)
			return listener.terminate_sync()
		}
	}
}

const use = options => async useFn => {
	const listener = listenForever(options)
	const { create_disposer } = await disposer_module
	const use_listener = create_disposer({
		dispose: listener => listener.terminate(),
		dispose_on_exit: listener => listener.terminate_sync()
	})
	await use_listener(listener, async () => {
		await listener.init
		await useFn()
	})
}

module.exports = {
	listen,
	listenForever,
	use
}
