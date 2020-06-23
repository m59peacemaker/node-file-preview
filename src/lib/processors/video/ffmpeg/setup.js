const getDemuxers = require('./getDemuxers')
const fs = require('fs')
const path = require('path')

module.exports = async () =>
	fs.promises.writeFile(path.join(__dirname, '/demuxers.json'), JSON.stringify(await getDemuxers()))
