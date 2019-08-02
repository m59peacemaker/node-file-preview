const { test } = require('zora')
const { supportedTypes } = require('./')

test('videoProcessor.supportedTypes', async t => {
	t.ok(supportedTypes, JSON.stringify({ supportedTypes}, null, 2))

	const someExpectedTypes = [
		{ extension: 'mkv', mimetype: 'video/x-matroska' },
		{ extension: 'mov', mimetype: 'video/quicktime' },
		{ extension: 'mp4', mimetype: 'video/mp4' },
		{ extension: 'mpeg', mimetype: 'video/mpeg' },
		{ extension: 'webm', mimetype: 'video/webm' }
	]

	someExpectedTypes.forEach(expectedType =>
		t.deepEqual(
			supportedTypes.find(({ extension }) => extension === expectedType.extension),
			expectedType,
			`includes ${JSON.stringify(expectedType)}`)
	)
})
