const { test } = require('zora')
const makeCommand = require('./makeGeneratePreviewCommand')

test('ImageMagick makeGeneratePreviewCommand', t => {
	t.equal(
		makeCommand
			({
				inputFilePath: '/foo/bar.png',
				outputDirectoryPath: '/tmp/'
			}),
		[
			`convert`,
			'/foo/bar.png',
			'-strip',
			'-alpha', 'background',
			'-colorspace', 'sRGB',
			'-set', 'filename:size', `%[w]x%[h]`,
			'/tmp/bar_%[filename:size].png'
		],
		'uses expected defaults'
	)

	t.equal(
		makeCommand
			({
				maxWidth: 1920,
				maxHeight: 1080,
				outputFileExtension: 'jpg',
				inputFilePath: '/foo/bar.svg',
				outputDirectoryPath: '/tmp/'
			}),
		[
			`convert`,
			'/foo/bar.svg',
			'-strip',
			'-resize', '1920x1080',
			'-alpha', 'background',
			'-colorspace', 'sRGB',
			'-set', 'filename:size', `%[w]x%[h]`,
			'/tmp/bar_%[filename:size].jpg'
		],
		'uses maxHeight and maxWidth'
	)

	t.equal(
		makeCommand
			({
				maxHeight: 480,
				outputFileExtension: 'jpg',
				inputFilePath: '/foo/bar.svg',
				outputDirectoryPath: '/tmp/'
			}),
		[
			`convert`,
			'/foo/bar.svg',
			'-strip',
			'-resize', 'x480',
			'-alpha', 'background',
			'-colorspace', 'sRGB',
			'-set', 'filename:size', `%[w]x%[h]`,
			'/tmp/bar_%[filename:size].jpg'
		],
		'maxHeight only'
	)

	t.equal(
		makeCommand
			({
				maxWidth: 600,
				outputFileExtension: 'jpg',
				inputFilePath: '/foo/bar.svg',
				outputDirectoryPath: '/tmp/'
			}),
		[
			`convert`,
			'/foo/bar.svg',
			'-strip',
			'-resize', '600x',
			'-alpha', 'background',
			'-colorspace', 'sRGB',
			'-set', 'filename:size', `%[w]x%[h]`,
			'/tmp/bar_%[filename:size].jpg'
		],
		'maxWidth only'
	)
})
