module.exports = {
	inputFilePath: null,

	// will determine mimetype by extension
	inputMimetype: null,

	outputDirectoryPath: null,

	outputFileExtension: 'png',

	image: {
		// use file dimensions
		maxWidth: Infinity,
		maxHeight: Infinity
	},

	document: {
		// first page
		startPage: 1,

		// last page
		endPage: Infinity
	},

	video: {
		// take first frame, and then a frame after a minute for 4 more minutes (5 total images)
		startTimeOffsetSeconds: 0,
		intervalSeconds: 60,
		maxThumbnails: 5,
		// chooses the best image for a thumbnail among N frames
		// lower: better performance, higher: better results
		framesConsideredPerThumbnail: 60
	},

	processTimeout: 10000
}
