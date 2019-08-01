const { test } = require('zora')
const getSupportedInputTypes = require('./getSupportedInputTypes')

test('unoconv getSupportedInputTypes()', async t => {
	const supportedTypes = await getSupportedInputTypes()
	t.ok(supportedTypes, JSON.stringify({ supportedTypes }, null, 2))

	const someExpectedTypes = [
		{ extension: 'png', mimetype: 'image/png' },
		{ extension: 'jpg', mimetype: 'image/jpeg' },
		{ extension: 'jpeg', mimetype: 'image/jpeg' },
		{ extension: 'gif', mimetype: 'image/gif' },
		{ extension: 'bmp', mimetype: 'image/bmp' },
		{ extension: 'svg', mimetype: 'image/svg+xml' }
	]

	someExpectedTypes.forEach(expectedType =>
		t.deepEqual(
			supportedTypes.find(({ extension }) => extension === expectedType.extension),
			expectedType,
			`includes ${JSON.stringify(expectedType)}`)
	)
})
