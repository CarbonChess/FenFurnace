import gameData from '../variables.js';

export default function createFenFromBoardArray() {
	let fenString = '';
	let blankSquares = 0;

	//go through array until end
	for (let i in gameData.boardArray) {
		const row = gameData.boardArray[i];

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

		if (i !== '7') fenString += '\/';
	}

	//current turn
	fenString += ' ' + gameData.currentTurn;

	//castling
	let castleString = '';
	if (gameData.castling.w.k) castleString += 'K';
	if (gameData.castling.w.q) castleString += 'Q';
	if (gameData.castling.b.k) castleString += 'k';
	if (gameData.castling.b.q) castleString += 'q';
	fenString += ' ' + castleString;

	//enpassant
	fenString += ' ' + gameData.enpassantSquare;
	//halfmove clock
	fenString += ' ' + gameData.halfMoveCount;
	//move number
	fenString += ' ' + gameData.moveNumber;
	return fenString;
}
