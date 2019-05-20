const path = require('path')

// if specifying on one of width or height, the other one must be -1 or -2, whichever is a multiple of the given dimension
const keepAspectRatioScaleArg = dimension => 0 - ((dimension % 2) + 1)
const noUpscaleArg = (type, value) => `'min(${value},i${type})'`
const scaleParameter = ({ width, height }) => {
	if (!(width || height)) {
		return ''
	}
	// "scale='min(320,iw)':'min(240,ih)'
	const widthArg = noUpscaleArg('w', width || keepAspectRatioScaleArg(height))
	const heightArg = noUpscaleArg('h', height || keepAspectRatioScaleArg(width))
	return `scale=w=${widthArg}:h=${heightArg}:force_original_aspect_ratio=decrease`
}

// lol
const xFramesEveryYSeconds = ({ x, y }) => `select='if(not(floor(mod(t,${y})))*lt(ld(1),1),st(1,1)+st(2,n)+st(3,t));if(eq(ld(1),1)*lt(n,ld(2)+${x}),1,if(trunc(t-ld(3)),st(1,0)))'`

const getInverseInRange = start => end => n => (-(n - end)) + start

var scale = toRange => subjectRange => subject => {
	const subjectPercent = (subject - subjectRange[0]) / (subjectRange[1] - subjectRange[0])
	return subjectPercent * (toRange[1] - toRange[0]) + toRange[0]
}

module.exports = ({
	maxWidth = null,
	maxHeight = null,
	quality = 100,
	outputFileExtension = 'jpg',
	maxThumbnails = 5,
	intervalSeconds = 60,
	startTimeOffsetSeconds = 0,
	framesConsideredPerThumbnail = 60
}) => ({
	inputFilePath,
	outputDirectoryPath
}) => {
	const makeOutputPath = marker => path.join(
		outputDirectoryPath,
		[
			path.basename(inputFilePath, path.extname(inputFilePath)),
			'_',
			marker,
			`.${outputFileExtension}`
		].join('')
	)

	// TODO: make better (and unique) filename - see ImageMagick command
	const outputArgument = makeOutputPath(`%0${Math.max(2, String(maxThumbnails).length)}d`)

	const qualityScaled = Math.round
		(scale
			([ 1, 31 ])
			([ 1, 100 ])
			(getInverseInRange (1) (100) (quality))
		)

	return [
		'ffmpeg',
		'-ss', startTimeOffsetSeconds,
		'-i', inputFilePath,

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

		// quality, 1 - 31 (1 is best quality)
		// it is more efficient to leave it off unless greater than 1
		...(qualityScaled > 1 ? [ '-qscale:v', qualityScaled ] : []),

		outputArgument
	]
}
