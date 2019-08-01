const mime = require('mime')
const listFormats = require('./listFormats')

/*
	Only keep formats where we can determine a mimetype.
	For the rest, it is likely that the format value is not a proper extension.
*/
module.exports = async () =>
	Object.entries(
		(await listFormats())
			.map(({ format, ...formatData }) => {
				const extension = format.toLowerCase()
				return {
					extension,
					mimetype: mime.getType(extension),
					...formatData
				}
			})
			.filter(({ mimetype }) => mimetype)
			.reduce((acc, type) => Object.assign(acc, { [type.extension]: type }), {})
	)
	.sort(([ a ], [ b ]) => a < b ? -1 : 1)
	.map(([ _, type ]) => type)
