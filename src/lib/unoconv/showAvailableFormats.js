const execAsync = require('../../util/execAsync')

module.exports = async () =>
	(await execAsync('unoconv', [ '--show' ]))
		// yes, unoconv logs this data to stderr
		.stderr
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
