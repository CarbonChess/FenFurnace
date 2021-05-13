export default function createFenFromBoardArray() {
	let fenString = "";
	let blankSquares = 0;
	//go through array until end
	for (let i in global.boardArray) {
		let row = global.boardArray[i];

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
	fenString += ' ' + global.currentTurn;
	//castling
	let castleString = '';
	if (global.castling['w'].k) castleString += 'K';
	if (global.castling['w'].q) castleString += 'Q';
	if (global.castling['b'].k) castleString += 'k';
	if (global.castling['b'].q) castleString += 'q';
	fenString += ' ' + castleString;

	//enpassant
	fenString += ' ' + global.enpassantsquare;
	//halfmove clock
	fenString += ' ' + global.halfMoveCount;
	//move number
	fenString += ' ' + global.moveNumber;
	return fenString;
}
