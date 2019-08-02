const mime = require('mime')
const flat = require('array.prototype.flat')
const formats = require('./unoconv/formats')

// has a lot of { mimetype: null }, but the extensions are acceptable for our purposes
module.exports = flat(Object.values(formats.map(({ formats }) => formats)))
	.map(({ extension }) => ({ extension, mimetype: mime.getType(extension) }))
