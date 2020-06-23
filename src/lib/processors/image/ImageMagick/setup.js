const getFormats = require('./getFormats')
const fs = require('fs')
const path = require('path')

module.exports = async () =>
	fs.promises.writeFile(path.join(__dirname, '/formats.json'), JSON.stringify(await getFormats()))
