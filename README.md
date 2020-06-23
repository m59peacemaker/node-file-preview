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

## setup

This module is dependent on information from the binaries it uses, which may be different depending on the environment. This information is cached in this project for convenience, but it is recommended to refresh this information within the environment where this module will run. Simply running the supplied setup command will update the appropriate files to accord with your environment. Be aware that if the binaries report the required information differently in your environment, this module may crash trying to parse the information, or, though unlikely,  may have innacurate results from the `supports` function.

```sh
npx file-preview-setup
```

### requirements:

- ffmpeg
- imagemagick
- libreoffice
- mupdf-tools
- unoconv

See the included Dockerfile for a recommended environment setup.
