const { test } = require('zora')
const getSupportedTypes = require('./getSupportedTypes')

test('unoconv getSupportedTypes()', async t => {
	const supportedTypes = await getSupportedTypes()
	t.ok(supportedTypes, JSON.stringify({ supportedTypes }, null, 2))

	const someExpectedTypes = [
		{ extension: 'txt', mimetype: 'text/plain' },
		{ extension: 'html', mimetype: 'text/html' },
		{ extension: 'odt', mimetype: 'application/vnd.oasis.opendocument.text' },
		{
			extension: 'xlsx',
			mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		}
	]

	someExpectedTypes.forEach(expectedType =>
		t.deepEqual(
			supportedTypes.find(({ extension }) => extension === expectedType.extension),
			expectedType,
			`includes ${JSON.stringify(expectedType)}`)
	)
})
