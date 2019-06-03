const { execFile } = require('child_process')
const terminatePid = require('terminate')

// TODO: make this good
module.exports = () => {
	const proc = execFile('unoconv', [ '--listener', '--verbose' ])
	const terminate = () => terminatePid(proc.pid)
	return Object.assign(proc, { terminate })
}
