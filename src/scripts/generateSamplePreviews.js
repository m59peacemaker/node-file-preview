#!/usr/bin/env node

const filePreview = require('../')
const fs = require('fs-extra')
const path = require('path')
const pngquant = require('pngquant-bin')
const flatMap = require('array.prototype.flatmap')
const execAsync = require('../util/execAsync')
const compressPng = ({ inputFilePath, outputFilePath }) => execAsync(
	pngquant, [ '-o', outputFilePath, '--force', '--strip', inputFilePath ]
)

const readdirFullPaths = async (dirPath, { dotFiles = false } = {}) => {
	const files = (await fs.readdir(dirPath))
	return (dotFiles
		? files
		: files.filter(file => file[0] !== '.')
	)
		.map(file => path.join(dirPath, file))
}

const outputDirectoryPath = '/tmp/samples'

;(async () => {
	await fs.emptyDir(outputDirectoryPath)
	const sampleFiles = (await readdirFullPaths(path.join(__dirname, '../samples')))
	//const outputFileExtensions = [ 'jpg', 'png', 'svg', 'gif' ]
	const outputFileExtensions = [ 'png' ]
	const dimensions = [
		{ maxWidth: 1500, maxHeight: 1500 },
		/* { maxWidth: 640, maxHeight: 480 }, */
		/* { maxWidth: 640 }, */
		/* { maxWidth: 800, maxHeight: 600 }, */
		/* { maxWidth: 750 }, */
		/* { maxHeight: 750 }, */
		/* { maxWidth: 1280, maxHeight: 720 }, */
		/* { maxWidth: 1920, maxHeight: 1080 }, */
		/* { maxHeight: 1080 } */
	]
	const settings = flatMap(sampleFiles, inputFilePath =>
		flatMap(outputFileExtensions, outputFileExtension =>
			flatMap(dimensions, ({ maxHeight, maxWidth }) => ({
				inputFilePath,
				outputFileExtension,
				maxWidth,
				maxHeight
			}))
		)
	)
	const totalTimes = []
	await settings.reduce(async (promise, settings, index) => {
		await promise
		const {
			inputFilePath,
			outputFileExtension,
			maxWidth,
			maxHeight
		} = settings
		let startTime = Date.now()
		console.log(`STARTING`, settings)
		const previewFilePaths = await filePreview
			({
				maxWidth,
				maxHeight,
				outputFileExtension,
				document: {
					startPage: 1,
					endPage: 1,
					cropSpreadsheets: false,
					optimizeCellDimensions: false
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
		await Promise.all(previewFilePaths.map(inputFilePath => compressPng ({
			inputFilePath,
			outputFilePath: `${path.join(
				path.dirname(inputFilePath),
				path.basename(inputFilePath, '.png')
			)}.tiny.png`
		})))
		let totalTime = Date.now() - startTime
		totalTimes.push(totalTime)
		console.log(`COMPLETED (${index + 1}) in ${totalTime / 1000} seconds.`)
		console.log(`Average processing time: ${totalTimes.reduce((a, b) => a + b, 0) / totalTimes.length / 1000} seconds`)
	}, Promise.resolve())
})()
