import gameData from '../variables.js';

export default function createBoardArray(fenString) {
	gameData.currentFen = fenString;

	const currentBoard = fenString.split(' ')[0].split('/');
	gameData.currentTurn = fenString.split(' ')[1];

	//castling
	gameData.castling['w'].q = false;
	gameData.castling['w'].k = false;
	gameData.castling['b'].q = false;
	gameData.castling['b'].k = false;

	const castleString = fenString.split(' ')[2];
	for (let i in castleString) {
		const colour = castleString[i] === castleString[i].toUpperCase() ? 'w' : 'b';
		gameData.castling[colour][castleString[i].toLowerCase()] = true;
	}

	gameData.enpassantSquare = fenString.split(' ')[3].toUpperCase();
	gameData.halfMoveCount = fenString.split(' ')[4];
	gameData.moveNumber = fenString.split(' ')[5];

	gameData.boardArray = currentBoard.map(val => {
		return val.replace(/[0-9]/g, n => '-'.repeat(n))
	});
}
