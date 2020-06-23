const mime = require('mime')
const { execFile } = require('promisify-child-process')
const flat = require('array.prototype.flat')

const getDemuxerTypes = async name => {
	const { stdout: details } = await execFile('ffmpeg', [ '-v', '0', '-h', `demuxer=${name}` ])

	const commonExtensionsMatches = details.match(/Common extensions: (.+).$/m)

	return [
		// The demuxer name might be a comma separated list of extensions, some other gibberish, or both.
		...name.split(','),
		...(commonExtensionsMatches ? commonExtensionsMatches[1].split(',') : [])
	]
		.map(extension => ({ extension, mimetype: mime.getType(extension) }))
		.filter(({ mimetype }) => mimetype !== null)
}

module.exports = async () => Promise
	.all(
		(await execFile('ffmpeg', [ '-v', '0', '-demuxers' ]))
			.stdout
			.replace(/^[.\s\S]+--/m, '')
			.trim()
			.split('\n')
			.map(async line => {
				const [ _, name, description ] = line.trim().split(/\s+/)
				const demuxer = { name, description }
				const types = await getDemuxerTypes(name)
				return (types.length ? types : [ { extension: null, mimetype: null } ])
					.map(type => ({ ...demuxer, ...type }))
			})
	)
	.then(flat)
