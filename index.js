Object.assign(global, {
	castling: { w: { k: true, q: true }, b: { k: true, q: true } },
	boardArray: [],
	enpassantSquare: null,
	moveList: [],
	currentTurn: null,
	halfMoveCount: 0,
	moveNumber: 0,
	promotionPiece: null,
});

import setupBoard from './src/board/setup-board.js';
import createBoard from './src/board/create-board.js';
import * as validation from './src/validation.js';
import findAllMoves from './src/validation/all-moves.js';
import isCheck from './src/validation/is-check.js';
import gameEndingStatus from './src/validation/ending.js';
import undoMove from './src/board/undo.js';

export default {
	setupBoard,
	createBoard,
	validation,
	findAllMoves,
	isCheck,
	gameEndingStatus,
	undoMove,
}
