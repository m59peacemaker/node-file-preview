const mime = require('mime')
const formats = require('./ImageMagick/formats')
const prepareTypesList = require('../../prepareTypesList')

/*
	Only keep formats where we can determine a mimetype.
	For the rest, it is likely that the format value is not a proper extension.
*/
module.exports = prepareTypesList(
	formats
		.map(({ format, ...formatData }) => {
			const extension = format.toLowerCase()
			return {
				extension,
				mimetype: mime.getType(extension),
				...formatData
			}
		})
		.filter(({ read, mimetype }) => read && mimetype && mimetype.split('/')[0] === 'image')
		.map(({ extension, mimetype }) => ({ extension, mimetype }))
)
