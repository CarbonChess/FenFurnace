import gameData from '../variables';
import { Colour } from '../types';

export default function createBoardArray(fenString: string): void {
	const fenParts = fenString.split(' ');

	const currentBoard = fenParts[0].split('/');
	gameData.currentTurn = fenParts[1] as Colour;

	gameData.castling = { w: { k: false, q: false }, b: { k: false, q: false } };
	const castleString = fenParts[2];
	for (let i = 0; i < castleString.length; i++) {
		const colour = castleString[i] === castleString[i].toUpperCase() ? 'w' : 'b' as Colour;
		const side = castleString[i].toLowerCase() as ('k' | 'q');
		gameData.castling[colour][side] = true;
	}

	gameData.enpassantSquare = fenParts[3].toUpperCase();
	gameData.halfMoveCount = +fenParts[4];
	gameData.moveNumber = +fenParts[5];

	gameData.boardArray = currentBoard.map(val => val.replace(/[0-9]/g, n => '-'.repeat(+n)));
}
