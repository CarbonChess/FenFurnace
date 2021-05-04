const globals = {
	castling: { w: { k: true, q: true }, b: { k: true, q: true } },
	currentFen: null,
	boardArray: [],
	enpassantsquare: null,
	moveslist: [],
	currentTurn: null,
	halfmoveCount: 0,
	moveNumber: 0,

}

function createBoardArray(fenString) {
	globals.currentFen = fenString;

	let currentBoard = fenString.split(' ')[0].split('/');
	globals.currentTurn = fenString.split(' ')[1];

	//castling
	globals.castling['w'].q = false;
	globals.castling['w'].k = false;
	globals.castling['b'].q = false;
	globals.castling['b'].k = false;

	let castleString = fenString.split(' ')[2];
	for (let i in castleString) {
		let colour = castleString[i] === castleString[i].toUpperCase() ? 'w' : 'b';
		globals.castling[colour][castleString[i].toLowerCase()] = true;
	}

	globals.enpassantsquare = fenString.split(' ')[3].toUpperCase();
	globals.halfmove = fenString.split(' ')[4];
	globals.moveNumber = fenString.split(' ')[5];

	globals.boardArray = currentBoard.map(val => {
		return val.replace(/[0-9]/g, n => '-'.repeat(n))
	});
}

function createFenFromBoardArray() {
	let fenString = "";
	let blankSquares = 0;
	//go through array until end
	for (let i in globals.boardArray) {
		let row = globals.boardArray[i];

		for (let j = 0; j < row.length; j++) {
			if (row[j] !== '-') {

				if (blankSquares > 0) {
					fenString += blankSquares;
					blankSquares = 0;
				}
				fenString += row[j];
			}
			else {
				blankSquares++; //count total number of empty squares in a row
			}
		}

		if (blankSquares > 0) fenString += blankSquares;
		blankSquares = 0;

		if (i != 7) { fenString += '\/' };
	}

	//current turn
	fenString += ' ' + globals.currentTurn;
	//castling
	let castleString = '';
	if (globals.castling['w'].k == true) castleString += 'K';
	if (globals.castling['w'].q == true) castleString += 'Q';
	if (globals.castling['b'].k == true) castleString += 'k';
	if (globals.castling['b'].q == true) castleString += 'q';
	fenString += ' ' + castleString;

	//enpassant
	fenString += ' ' + globals.enpassantsquare;
	//halfmove clock
	fenString += ' ' + globals.halfmoveCount;
	//move number
	fenString += ' ' + globals.moveNumber;
	return fenString;


}
function invertColour(colour) {
	return colour === 'b' ? 'w' : 'b';
}

function initialise() {
	createBoardArray('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
}
module.exports = {
	createBoardArray,
	invertColour,
	globals,
	initialise,
	createFenFromBoardArray,
}
