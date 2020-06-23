# @m59/file-preview

```node
const filePreview = require('@m59/file-preview')
const { use: useUnoconvListener } = require('@m59/file-preview/unoconvListener')
```

<!--js
const filePreview = require('./')
const { use: useUnoconvListener } = require('./unoconvListener')
-->

```js
const useTmpDir = require('@m59/use-tmp-dir')
const path = require('path')

// without this, document conversion will be slow and will likely crash
useUnoconvListener
	({ port: 2002, silent: false })
	(async () => {
		const inputFilePath = './samples/big_buck_bunny.mp4'
		filePreview.supports({ extension: path.extname(inputFilePath) })
			?	await useTmpDir(async tmpDir => {
					const previewFilePaths = await filePreview({
						inputFilePath,
						outputDirectoryPath: tmpDir,
						outputFileExtension: 'png',
						image: {
							maxWidth: 1280,
							maxHeight: 720,
						},
						document: {
							startPage: 1,
							endPage: 1
						},
						video: {
							startTimeOffsetSeconds: 3,
							intervalSeconds: 20,
							maxThumbnails: 5,
							framesConsideredPerThumbnail: 50
						}
					})
					return previewFilePaths.map(filePath => path.relative(tmpDir, filePath))
				})
			:	[]
		/* =>
			[
				'big_buck_bunny_1280_720_01.png',
				'big_buck_bunny_1280_720_02.png',
				'big_buck_bunny_1280_720_03.png'
			]
		*/
	})
```
