import createBoardArray from './create-board.js';

export default function undoMove() {
	if (!global.moveList.length) return;
	global.moveList.pop();
	global.logList.pop();
	const lastMove = global.moveList.slice(-1)[0];
	createBoardArray(lastMove);
	return lastMove;
}
