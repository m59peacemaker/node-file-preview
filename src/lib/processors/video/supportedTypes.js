const demuxers = require('./ffmpeg/demuxers.json')

module.exports = demuxers
	.filter(({ mimetype }) => mimetype && mimetype.split('/')[0] === 'video')
	.map(({ extension, mimetype }) => ({ extension, mimetype }))
