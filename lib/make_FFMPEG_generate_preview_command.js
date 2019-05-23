const path = require('path')

// afaik, if specifying only one of width or height, the other one must be -2 if the given dimension is an odd number, otherwise -1 should be good
const keepAspectRatioScaleArg = dimension => 0 - ((dimension % 2) + 1)
const noUpscaleArg = (type, value) => `'min(${value},i${type})'`
const scaleParameter = ({ width, height }) => {
	if (!(width || height)) {
		return ''
	}
	// example: scale=w='min(320,iw)':h='min(240,ih)'
	const widthArg = noUpscaleArg('w', width || keepAspectRatioScaleArg(height))
	const heightArg = noUpscaleArg('h', height || keepAspectRatioScaleArg(width))
	return `scale=w=${widthArg}:h=${heightArg}:force_original_aspect_ratio=decrease`
}

// lol
const xFramesEveryYSeconds = ({ x, y }) => `select='if(not(floor(mod(t,${y})))*lt(ld(1),1),st(1,1)+st(2,n)+st(3,t));if(eq(ld(1),1)*lt(n,ld(2)+${x}),1,if(trunc(t-ld(3)),st(1,0)))'`

const makeOutputArgument = ({
	inputFilePath,
	maxWidth,
	maxHeight,
	maxThumbnails,
	outputDirectoryPath,
	outputFileExtension
}) => {
	const originalName = path.basename(inputFilePath, path.extname(inputFilePath))
	const identifier = [
		originalName,
		maxWidth,
		maxHeight,
		`%0${Math.max(2, String(maxThumbnails).length)}d`
	]
		.map(v => v == null ? '' : v)
		.join('_')
	const baseName = `${identifier}.${outputFileExtension}`
	return path.join(outputDirectoryPath, baseName)
}

module.exports = ({
	maxWidth = null,
	maxHeight = null,
	outputFileExtension = 'png',
	maxThumbnails = 5,
	intervalSeconds = 60,
	startTimeOffsetSeconds = 0,
	framesConsideredPerThumbnail = 60
}) => ({
	inputFilePath,
	outputDirectoryPath
}) => [
	'ffmpeg',
	'-ss', startTimeOffsetSeconds,
	'-i', inputFilePath,

	'-map_metadata', '-1',

	// filters
	'-vf', [
		xFramesEveryYSeconds({ x: framesConsideredPerThumbnail, y: intervalSeconds }),
		`thumbnail=${framesConsideredPerThumbnail}`,
		scaleParameter({ width: maxWidth, height: maxHeight })
	].filter(v => v).join(','),

	// avoid duplicate frames
	'-vsync', 'vfr',

	// take N frames
	'-frames:v', maxThumbnails,

	makeOutputArgument({
		inputFilePath,
		maxWidth,
		maxHeight,
		maxThumbnails,
		outputDirectoryPath,
		outputFileExtension
	})
]

// for testing
Object.assign(module.exports, { xFramesEveryYSeconds })
