const getSupportedTypes = require('./getSupportedTypes')

module.exports = async () =>
	(await getSupportedTypes())
		.filter(({ read }) => read)
		.map(({ extension, mimetype }) => ({ extension, mimetype }))
