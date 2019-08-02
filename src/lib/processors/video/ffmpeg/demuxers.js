const mime = require('mime')
const { execFileSync } = require('child_process')
const flatMap = require('array.prototype.flatmap')

const getDemuxerTypes = name => {
	const details = execFileSync('ffmpeg', [ '-v', '0', '-h', `demuxer=${name}` ]).toString()

	const commonExtensionsMatches = details.match(/Common extensions: (.+).$/m)

	return [
		// The demuxer name might be a comma separated list of extensions, some other gibberish, or both.
		...name.split(','),
		...(commonExtensionsMatches ? commonExtensionsMatches[1].split(',') : [])
	]
		.map(extension => ({ extension, mimetype: mime.getType(extension) }))
		.filter(({ mimetype }) => mimetype !== null)
}

module.exports = flatMap(
	execFileSync('ffmpeg', [ '-v', '0', '-demuxers' ])
		.toString()
		.replace(/^[.\s\S]+--/m, '')
		.trim()
		.split('\n'),
	line => {
		const [ _, name, description ] = line.trim().split(/\s+/)
		const demuxer = { name, description }
		const types = getDemuxerTypes(name)
		return (types.length ? types : [ { extension: null, mimetype: null } ])
			.map(type => ({ ...demuxer, ...type }))
	}
)
