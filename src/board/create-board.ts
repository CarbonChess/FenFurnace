import gameData from '../variables';
import { toLowerCase, toUpperCase } from '../helpers';
import { Cell, Colour, PieceID, FenParts, CastleString, Fen } from '../types';
import { isWhite } from '../pieces';

/** Creates a board from a given Fen. Does not update moves list; use `setupBoard()` instead. */
export default function createBoardArray(fenString: string): void {
	const { fen, currentTurn, castling, enpassantSquare, halfMoveCount, moveNumber } = getFenParts(fenString);

	gameData.castling = { w: { k: false, q: false }, b: { k: false, q: false } };
	const castleString = castling;
	for (let i = 0; i < castleString.length; i++) {
		const colour = isWhite(castleString[i] as PieceID) ? 'w' : 'b';
		const side = toLowerCase(<'k' | 'q'>castleString[i]);
		gameData.castling[colour][side] = true;
	}

	gameData.currentTurn = currentTurn;
	gameData.enpassantSquare = enpassantSquare;
	gameData.halfMoveCount = halfMoveCount;
	gameData.moveNumber = moveNumber;

	gameData.boardArray = fen.split('/').map(val => val.replace(/[0-9]/g, n => '-'.repeat(+n)));
}

function getFenParts(fenString: string): FenParts {
	const fenParts = fenString.split(' ');
	const fen = <Fen>fenParts[0];
	const currentTurn = <Colour>fenParts[1];
	const castling = <CastleString>fenParts[2];
	const enpassantSquare = toUpperCase(<Cell>fenParts[3]);
	const halfMoveCount = +fenParts[4];
	const moveNumber = +fenParts[5];
	return { fen, currentTurn, castling, enpassantSquare, halfMoveCount, moveNumber };
}
