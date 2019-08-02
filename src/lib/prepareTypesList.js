// dedupe by extension and sort by extension
module.exports = types => Object
	.values(
		types.reduce((acc, type) => Object.assign(acc, { [type.extension]: type }), {})
	)
	.sort(({ extension: a }, { extension: b }) => a < b ? -1 : 1)
