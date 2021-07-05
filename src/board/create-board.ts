import gameData from '../variables.js';

export default function createBoardArray(fenString) {
	const fenParts = fenString.split(' ');

	gameData.currentFen = fenString;

	const currentBoard = fenParts[0].split('/');
	gameData.currentTurn = fenParts[1];

	gameData.castling = { w: { k: false, q: false }, b: { k: false, q: false } };
	const castleString = fenParts[2];
	for (const i in castleString) {
		const colour = castleString[i] === castleString[i].toUpperCase() ? 'w' : 'b';
		const side = castleString[i].toLowerCase();
		gameData.castling[colour][side] = true;
	}

	gameData.enpassantSquare = fenParts[3].toUpperCase();
	gameData.halfMoveCount = fenParts[4];
	gameData.moveNumber = fenParts[5];

	gameData.boardArray = currentBoard.map(val => val.replace(/[0-9]/g, n => '-'.repeat(n)));
}
