const showAvailableFormats = require('./showAvailableFormats')
const mime = require('mime')
const flat = require('array.prototype.flat')

module.exports = async () =>
	flat(
		Object.values(
			(await showAvailableFormats()).map(({ formats }) => formats)
		)
	)
		.map(({ extension }) => ({ extension, mimetype: mime.getType(extension) }))
