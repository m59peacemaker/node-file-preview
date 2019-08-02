module.exports = ({
	inputFilePath,
	outputFilePath,
	startPage = 1,
	endPage,

	listenerHost = '127.0.0.1',
	listenerPort = 2002
}) => {
	// endPage -1 (back from end) does not seem to work with unoconv / LibreOffice
	const pageRange = [
		startPage,
		(endPage >= startPage && endPage < Infinity) ? endPage : null
	].filter(v => v !== null).join('-')
	return [
		'unoconv',

		'--connection',
		`socket,host=${listenerHost},port=${listenerPort};urp;StarOffice.ComponentContext`,

		/*
			VERY IMPORTANT!
			Require that a listener already be started.
			Having a listener possibly started, but possibly crashed,
			and this trying to start its own and maybe crashing and maybe becoming a zombie is way too shady.
		*/
		'--no-launch',

		'--export', `PageRange=${pageRange}`,
		'--output', outputFilePath,
		inputFilePath
	]
}
