#!/usr/bin/env node

const filePreview = require('../')

const extensionColumnLength = Math.max(
	...filePreview.supportedTypes.map(({ extension }) => extension.length)
)

console.log(
	filePreview
		.supportedTypes
		.map(({ extension, mimetype }) =>
			[
				`.${extension.padEnd(extensionColumnLength, ' ')}`,
				mimetype || ''
			]
				.join(' ')
				.trim()
		)
		.join('\n')
)
