const execAsync = require('../../util/execAsync')

const nativeBlobSupportRegex = /\*$/
const isExtraDescriptionLine = line => /^ {11}/.test(line)

module.exports = async () =>
	(await execAsync('convert', [ '-list', 'format' ]))
		.stdout
		.split('\n')
		.slice(2, -6)
		.filter(line => !isExtraDescriptionLine(line))
		.map(line => {
			const [
				format,
				module,
				mode
			] = line.trim().split(/\s+/, 3)
			const description = line.match(/^(\s*([^\s]+)){3}\s+(.*)/).slice(-1)
			return {
				format: format.replace(nativeBlobSupportRegex, ''),
				module,
				mode,
				description,
				nativeBlobSupport: nativeBlobSupportRegex.test(format),
				read: mode[0] === 'r',
				write: mode[1] === 'w',
				supportForMultipleImages: mode[2] === '+'
			}
		})
