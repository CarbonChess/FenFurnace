const globals = {
	castling: { w: { k: true, q: true }, b: { k: true, q: true } },
	currentFen: null,
	boardArray: [],
	enpassantsquare: null,
}

function createBoardArray(fenString) {
	globals.currentFen = fenString;
	globals.enpassantsquare = fenString.split(' ')[3].toUpperCase();
	let currentBoard = fenString.split(' ')[0].split('/');
	globals.boardArray = currentBoard.map(val => {
		return val.replace(/[0-9]/g, n => '-'.repeat(n))
	});
}

function invertColour(colour) {
	return colour === 'b' ? 'w' : 'b';
}

module.exports = {
	createBoardArray,
	invertColour,
	globals,
}
