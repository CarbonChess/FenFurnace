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

export { setupBoard } from './src/helpers.js';
export { default as createBoard } from './src/board/create-board.js';
export { * as validation } from './src/validation.js';
export { default as findAllMoves } from './src/validation/all-moves.js';
