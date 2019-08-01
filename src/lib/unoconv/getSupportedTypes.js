const showAvailableFormats = require('./showAvailableFormats')
const mime = require('mime')
const flat = require('array.prototype.flat')

// has a lot of { mimetype: null }, but the extensions are acceptable for our purposes
module.exports = async () =>
	flat(
		Object.values(
			(await showAvailableFormats()).map(({ formats }) => formats)
		)
	)
		.map(({ extension }) => ({ extension, mimetype: mime.getType(extension) }))
