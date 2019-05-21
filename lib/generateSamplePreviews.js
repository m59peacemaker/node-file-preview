#!/usr/bin/env node

const generatePreview = require('./')
const fs = require('fs-extra')
const path = require('path')
const generatePreviewForVideo = require('./generatePreviewForVideo')
const generatePreviewForImageOrPdf = require('./generatePreviewForImageOrPdf')
const convertDocument = require('./convertDocument')

const readdirFullPaths = async (dirPath, { dotFiles = false } = {}) => {
	const files = (await fs.readdir(dirPath))
	return (dotFiles
		? files
		: files.filter(file => file[0] !== '.')
	)
		.map(file => path.join(dirPath, file))
}

const outputDirectoryPath = '/tmp/file-preview-samples'

;(async () => {
	await fs.emptyDir(outputDirectoryPath)
	const sampleFiles = (await readdirFullPaths(path.join(__dirname, '../samples')))
	const qualities = [ null, 100, 92, 25 ]
	const outputFileExtensions = [ 'jpg', 'png', 'svg', 'gif' ]
	const dimensions = [
		{ maxWidth: 250, maxHeight: 250 },
		{ maxWidth: 640, maxHeight: 480 },
		{ maxWidth: 640 },
		{ maxWidth: 800, maxHeight: 600 },
		{ maxWidth: 750, maxHeight: 750 },
		{ maxWidth: 750 },
		{ maxHeight: 750 },
		{ maxWidth: 1280, maxHeight: 720 },
		{ maxWidth: 1920, maxHeight: 1080 },
		{ maxHeight: 1080 }
	]
	const settings = sampleFiles.flatMap(inputFilePath =>
		qualities.flatMap(quality =>
			outputFileExtensions.flatMap(outputFileExtension =>
				dimensions.flatMap(({ maxHeight, maxWidth }) => ({
					inputFilePath,
					outputFileExtension,
					quality,
					maxWidth,
					maxHeight
				}))
			)
		)
	)
	await settings.reduce(async (promise, settings, index) => {
		await promise
		const {
			inputFilePath,
			outputFileExtension,
			quality,
			maxWidth,
			maxHeight
		} = settings
		console.log(`STARTING`, settings)
		const previewFilePath = await generatePreview
			({
				maxWidth,
				maxHeight,
				quality,
				background: '#FFFFFF',
				outputFileExtension: outputFileExtension,
				document: {
					startPage: 1,
					endPage: 2,
				},
				video: {
					startTimeOffsetSeconds: 0,
					intervalSeconds: 8,
					maxThumbnails: 10,
					framesConsideredPerThumbnail: 60
				}
			})
			({
				inputFilePath,
				outputDirectoryPath
			})
		console.log(`COMPLETED (${index + 1})`)
	}, Promise.resolve())
	/*const file = path.join(__dirname, 'samples/2AJ9T-LH7000_Internal_Photos.pdf')
	const stream = fs.createReadStream(file)
	const result = await generate({ stream, filename: path.basename(file), mimetype: 'pdf' })
	writeStreamToFile(result.stream, path.join(__dirname, result.outputFileName))
	delete result.stream
	console.log(result)*/

	/*
	console.log(await generatePreviewForVideo({
		maxThumbnails: 10,
		intervalSeconds: 8,
	}) ({
		inputFilePath: `${__dirname}/samples/big_buck_bunny.mp4`,
		outputDirectoryPath: '/tmp',
	}))
	*/

	//inputFilePath: `${__dirname}/../samples/BOM.xlsx`,

	/*await Promise.all(
		[ 92, 100 ]
			.map(quality => Promise.all(
				[ 'jpg', 'png', 'svg' ]
					.map(async ext => {
						const outdir = '/tmp/sample'
						const { files } = await generatePreviewForImageOrPdf({
							quality,
							startPage: 1,
							endPage: -1
						}) ({
							inputFilePath: `${__dirname}/../samples/2AJ9T-LH7000_Internal_Photos.pdf`,
							outputDirectoryPath: outdir,
							outputFileExtension: ext
						})
						await Promise.all(files.map(filePath => {
							const fileName = path.basename(filePath, `.${ext}`)
							const dirName = path.dirname(filePath)
							return fs.move(filePath, path.join(dirName, `${fileName}_${quality}.${ext}`))
						}))
					})
				)
			)
		)*/

	/*
	console.log(await generatePreviewForImageOrPdf({
		startPage: 1,
		endPage: -1,
		height: 300
	}) ({
		inputFilePath: `${__dirname}/samples/raccoon.jpg`,
		outputDirectoryPath: `/tmp`,
		outputFileExtension: 'jpg',
	}))
	*/

	/*
	console.log(await convertDocument({
		inputFilePath: `${__dirname}/samples/UOML_Sample.odt`,
		outputFilePath: `/tmp/UOML_Sample.pdf`,
		startPage: 3,
		endPage: 4
	}))
	*/
})()
