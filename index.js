Object.assign(global, {
	castling: { w: { k: true, q: true }, b: { k: true, q: true } },
	currentFen: null,
	boardArray: [],
	enpassantSquare: null,
	moveslist: [],
	currentTurn: null,
	halfMoveCount: 0,
	moveNumber: 0,
});

import test from './test.js';

test();
