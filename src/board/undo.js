import createBoardArray from './create-board.js';

export default function undoMove() {
	global.moveList.pop();
	let lastMove = global.moveList.slice(-1)[0];
	createBoardArray(lastMove);
	return lastMove;
}
