const { execFile } = require('promisify-child-process')

module.exports = async () => (await execFile('unoconv', [ '--show', '--stdout' ]))
	// yes, unoconv logs this data to stderr
	.stderr
	.toString()
	.trim()
	.split(/^The following list of /mg)
	.slice(1)
	.map(group => {
		const [ titleLine, ...formatLines ] = group.split(/\n+/)
		const [ type ] = titleLine.split(' ')
		const formats = formatLines
			.filter(v => v.length)
			.map(line => {
				const [ format, description ] = line.split(/-(.*)/).map(v => v.trim())
				const extension = description.match(/\[.([^\]]+)]$/)[1]
				return { format, description, extension }
			})
		return { type, formats }
	})
