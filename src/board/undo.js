import createBoardArray from "./create-board.js";

export default function undoMove() {
	global.moveList.pop();
	createBoardArray(global.moveList.slice(-1)[0]);
	return global.moveList.slice(-1)[0];
}
