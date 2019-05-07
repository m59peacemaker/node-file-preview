module.exports = async ({ try: tryFn, catch: catchFn, finally: finallyFn }) => {
	try {
		return await tryFn()
	} catch (error) {
		if (!catchFn) {
			throw error
		}
		return await catchFn(error)
	} finally {
		finallyFn && (await finallyFn())
	}
}
