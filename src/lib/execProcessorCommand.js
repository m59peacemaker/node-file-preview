const execAsync = require('util').promisify(require('child_process').execFile)
const withKnowledgeOfOutputFiles = require('../util/withKnowledgeOfOutputFiles')

module.exports = async (makeCommand, options) => {
	const { files } = await withKnowledgeOfOutputFiles(
		options.outputDirectoryPath,
		outputDirectoryPath => {
			const [ command, ...args ] = makeCommand({ ...options, outputDirectoryPath })
			return execAsync(command, args, { timeout: options.processTimeout })
		}
	)
	return files
}
