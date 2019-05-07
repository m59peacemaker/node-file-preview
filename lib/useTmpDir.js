const { tmpdir } = require('os')
const path = require('path')
const fs = require('fs-extra')
const { ulid } = require('ulid')
const tryCatch = require('./tryCatchAsync')

module.exports = async useFn => {
	const tmpDir = path.join(tmpdir(), ulid())
	await fs.mkdir(tmpDir)
	return tryCatch({
		try: () => useFn(tmpDir),
		finally: () => fs.remove(tmpDir)
	})
}
