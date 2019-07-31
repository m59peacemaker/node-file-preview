const execAsync = require('../execAsync')
const mime = require('mime')
const flat = require('array.prototype.flat')

const getDemuxerExtensions = async name => {
	const extensions = (await execAsync('ffmpeg', [ '-v', '0', '-h', `demuxer=${name}` ]))
		.stdout
		.match(/Common extensions: (.+).$/m)
	/*
		NOTE: The demuxer name might be a comma separated list of extensions, some other gibberish, or both.
		The results here are awkward, but we are erring on the side of not losing any supported extensions.
	*/
	return [
		...name.split(','),
		...(extensions ? extensions[1].split(',') : [])
	]
}

module.exports = async () => {
	const demuxerNames = (await execAsync('ffmpeg', [ '-v', '0', '-demuxers' ]))
		.stdout
		.replace(/^[.\s\S]+--/m, '').trim()
		.split('\n')
		.map(demuxer => demuxer.trim().split(/\s+/)[1])
	return [ ...new Set(
		flat(await Promise.all(demuxerNames.map(getDemuxerExtensions)))
	) ]
		.sort()
		.map(extension => ({ extension, mimetype: mime.getType(extension) }))
		.filter(({ mimetype }) => mimetype != null)
}
