# @m59/file-preview

```js
const filePreview = require('@m59/file-preview')
const path = require('path')

;(async () => {
	if (filePreview.supports({ extension: path.extname(inputFilePath) })) {
		const previewFilePaths = await generatePreview ({
			inputFilePath,
			outputDirectoryPath,

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
	}
})()
```
