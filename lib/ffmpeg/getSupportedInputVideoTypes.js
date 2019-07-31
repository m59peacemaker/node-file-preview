const getSupportedInputTypes = require('./getSupportedInputTypes')

module.exports = async () => (await getSupportedInputTypes())
	.filter(({ mimetype }) => mimetype.split('/')[0] === 'video')
