const { test } = require('zora')
const path = require('path')
const fs = require('fs')
const useTmpDir = require('@m59/use-tmp-dir')
const filePreview = require('./')
const { use: useUnoconvListener } = require('../unoconvListener')

const readdirFullPathsSync = directoryPath => fs.readdirSync(directoryPath)
	.filter(file => file[0] !== '.')
	.map(file => path.join(directoryPath, file))

const sampleFilePaths = readdirFullPathsSync(path.join(__dirname, '../samples'))

test('successfully generates previews for sample files with default settings', async t =>
	useUnoconvListener
		(null)
		(async () => {
			return await Promise.all(sampleFilePaths.map(sampleFilePath => useTmpDir(async tmpDir => {
				try {
					const previewFilePaths = await filePreview
						({
							inputFilePath: sampleFilePath,
							outputDirectoryPath: tmpDir
						})

					t.equal(
						path.extname(previewFilePaths[0]),
						'.png',
						`returned file path has correct extension for file preview for file ${path.basename(sampleFilePath)}`
					)

					return previewFilePaths
				} catch (error) {
					t.fail(error.stack)
				}
			})))
		})
)
