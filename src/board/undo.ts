import gameData from '../variables';
import createBoardArray from './create-board';

export default function undoMove(): string | undefined {
	if (gameData.moveList.length === 0) return;
	gameData.moveList.pop();
	gameData.logList.pop();
	const lastMove = gameData.moveList[gameData.moveList.length - 1];
	createBoardArray(lastMove);
	return lastMove;
}
