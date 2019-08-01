const { test } = require('zora')
const getSupportedInputVideoTypes = require('./getSupportedInputVideoTypes')

test('ffmpeg getSupportedInputVideoTypes()', async t => {
	const supportedInputVideoTypes = await getSupportedInputVideoTypes()
	t.ok(supportedInputVideoTypes, JSON.stringify({ supportedInputVideoTypes }, null, 2))

	const someExpectedTypes = [
		{ extension: 'mkv', mimetype: 'video/x-matroska' },
		{ extension: 'mov', mimetype: 'video/quicktime' },
		{ extension: 'mp4', mimetype: 'video/mp4' },
		{ extension: 'mpeg', mimetype: 'video/mpeg' },
		{ extension: 'webm', mimetype: 'video/webm' }
	]

	someExpectedTypes.forEach(expectedType =>
		t.deepEqual(
			supportedInputVideoTypes.find(({ extension }) => extension === expectedType.extension),
			expectedType,
			`includes ${JSON.stringify(expectedType)}`)
	)
})
