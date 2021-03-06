const { test } = require('zora')
const makeCommand = require('./makeGeneratePreviewCommand')

test('mupdf makeGeneratePreviewCommand', t => {
	t.equal(
		makeCommand
			({
				inputFilePath: '/foo/bar.pdf',
				outputDirectoryPath: '/tmp/'
			}),
		[
			`mutool`, `draw`,
			`-L`,
			'-o', '/tmp/bar___rgb.png',
			'-c', 'rgb',
			'/foo/bar.pdf',
			`1-N`
		],
		'uses expected defaults'
	)

	t.equal(
		makeCommand
			({
				maxWidth: 1920,
				maxHeight: 1080,
				startPage: 2,
				endPage: 100,
				alpha: true,
				inputFilePath: '/foo/bar.pdf',
				outputDirectoryPath: '/tmp/'
			}),
		[
			`mutool`, `draw`,
			`-L`,
			'-o', '/tmp/bar_1920_1080_rgba_%03d.png',
			'-w', 1920,
			'-h', 1080,
			'-c', 'rgba',
			'/foo/bar.pdf',
			`2-100`
		],
		'uses options'
	)

	t.equal(
		makeCommand
			({
				maxHeight: 1080,
				inputFilePath: '/foo/bar.pdf',
				outputDirectoryPath: '/tmp/'
			}),
		[
			`mutool`, `draw`,
			`-L`,
			'-o', '/tmp/bar__1080_rgb.png',
			'-h', 1080,
			'-c', 'rgb',
			'/foo/bar.pdf',
			`1-N`
		],
		'height works without width'
	)
})
