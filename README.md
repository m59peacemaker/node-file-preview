# @m59/file-preview

```js
const makeGeneratePreview = require('@m59/file-preview')

const generatePreview = makeGeneratePreview ({
	maxWidth: 1280,
	maxHeight: 720,
	outputFileExtension: 'png',
	document: {
		startPage: 1,
		endPage: 1
	},
	video: {
		startTimeOffsetSeconds: 3,
		intervalSeconds: 60
		maxThumbnails: 5,
		framesConsideredPerThumbnail: 50
	}
})

const previewFilePaths = await generatePreview ({
	inputFilePath,
	outputDirectoryPath
})
```
