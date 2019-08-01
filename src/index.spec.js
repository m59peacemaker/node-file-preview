const { test } = require('zora')
const path = require('path')
const fs = require('fs')
const useTmpDir = require('@m59/use-tmp-dir')
const filePreview = require('./')

const readdirFullPathsSync = directoryPath => fs.readdirSync(directoryPath)
	.filter(file => file[0] !== '.')
	.map(file => path.join(directoryPath, file))

const sampleFilePaths = readdirFullPathsSync(path.join(__dirname, '../samples'))

test('successfully generates previews for sample files with default settings', async t => {
	const unoconvListener = await filePreview.UnoconvListener({ silent: false })
	try {
		return await Promise.all(sampleFilePaths.map(sampleFilePath => useTmpDir(async tmpDir => {
			try {
				const generatePreview = filePreview({ })
				const previewFilePaths = await generatePreview
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
	} finally {
		await unoconvListener.terminate()
	}
})
