import createBoardArray from './board/create-board.js';

export function initialise() {
	createBoardArray('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
	global.movelist = [];
	global.movelist.push('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
}

export function indexToLetter(n) {
	// 1-indexed; 0x40=uppercase, 0x60=lowercase
	return String.fromCharCode(n + 0x40);
}

export function invertColour(colour) {
	return colour === 'b' ? 'w' : 'b';
}
