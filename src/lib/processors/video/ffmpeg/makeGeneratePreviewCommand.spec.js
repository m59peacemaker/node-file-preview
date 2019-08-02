const { test } = require('zora')
const makeCommand = require('./makeGeneratePreviewCommand')

test('ffmpeg makeGeneratePreviewCommand', t => {
	t.equal(
		makeCommand
			({
				inputFilePath: '/foo/bar.mp4',
				outputDirectoryPath: '/tmp/'
			}),
		[
			`ffmpeg`,
			'-ss', 0,
			'-i', '/foo/bar.mp4',
			'-map_metadata', '-1',
			'-vf',
			`${makeCommand.xFramesEveryYSeconds({ x: 60, y: 60 })},thumbnail=60`,
			'-vsync', 'vfr',
			'-frames:v', 5,
			'/tmp/bar___%02d.png'
		],
		'uses expected defaults'
	)

	t.equal(
		makeCommand
			({
				maxWidth: 1920,
				maxHeight: 1080,
				outputFileExtension: 'jpg',
				maxThumbnails: 100,
				intervalSeconds: 9,
				startTimeOffsetSeconds: 3,
				framesConsideredPerThumbnail: 40,
				inputFilePath: '/foo/bar.webm',
				outputDirectoryPath: '/tmp/'
			}),
		[
			`ffmpeg`,
			'-ss', 3,
			'-i', '/foo/bar.webm',
			'-map_metadata', '-1',
			'-vf',
			`${makeCommand.xFramesEveryYSeconds({ x: 40, y: 9 })},thumbnail=40,scale=w='min(1920,iw)':h='min(1080,ih)':force_original_aspect_ratio=decrease`,
			'-vsync', 'vfr',
			'-frames:v', 100,
			'/tmp/bar_1920_1080_%03d.jpg'
		],
		'uses options'
	)

	t.equal(
		makeCommand
			({
				maxHeight: 1080,
				outputFileExtension: 'jpg',
				maxThumbnails: 100,
				intervalSeconds: 9,
				startTimeOffsetSeconds: 3,
				framesConsideredPerThumbnail: 40,
				inputFilePath: '/foo/bar.webm',
				outputDirectoryPath: '/tmp/'
			}),
		[
			`ffmpeg`,
			'-ss', 3,
			'-i', '/foo/bar.webm',
			'-map_metadata', '-1',
			'-vf',
			`${makeCommand.xFramesEveryYSeconds({ x: 40, y: 9 })},thumbnail=40,scale=w='min(-1,iw)':h='min(1080,ih)':force_original_aspect_ratio=decrease`,
			'-vsync', 'vfr',
			'-frames:v', 100,
			'/tmp/bar__1080_%03d.jpg'
		],
		'maxHeight only'
	)

	t.equal(
		makeCommand
			({
				maxWidth: 1921,
				outputFileExtension: 'jpg',
				maxThumbnails: 100,
				intervalSeconds: 9,
				startTimeOffsetSeconds: 3,
				framesConsideredPerThumbnail: 40,
				inputFilePath: '/foo/bar.webm',
				outputDirectoryPath: '/tmp/'
			}),
		[
			`ffmpeg`,
			'-ss', 3,
			'-i', '/foo/bar.webm',
			'-map_metadata', '-1',
			'-vf',
			`${makeCommand.xFramesEveryYSeconds({ x: 40, y: 9 })},thumbnail=40,scale=w='min(1921,iw)':h='min(-2,ih)':force_original_aspect_ratio=decrease`,
			'-vsync', 'vfr',
			'-frames:v', 100,
			'/tmp/bar_1921__%03d.jpg'
		],
		'maxWidth only'
	)
})
