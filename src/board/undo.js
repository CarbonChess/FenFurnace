import gameData from '../variables.js';
import createBoardArray from './create-board.js';

export default function undoMove() {
	if (!gameData.moveList.length) return;
	gameData.moveList.pop();
	gameData.logList.pop();
	const lastMove = gameData.moveList.slice(-1)[0];
	createBoardArray(lastMove);
	return lastMove;
}
