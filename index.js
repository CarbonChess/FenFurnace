if (typeof global === 'undefined') global = {};
Object.assign(global, {
	castling: { w: { k: true, q: true }, b: { k: true, q: true } },
	boardArray: [],
	enpassantSquare: null,
	moveslist: [],
	currentTurn: null,
	halfMoveCount: 0,
	moveNumber: 0,
	promotionPiece: null,
});

import { setupBoard } from './src/helpers.js';
import createBoard from './src/board/create-board.js';
import * as validation from './src/validation.js';
import findAllMoves from './src/validation/all-moves.js';

export default {
	setupBoard,
	createBoard,
	validation,
	findAllMoves,
}
