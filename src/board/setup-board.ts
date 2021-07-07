import gameData from '../variables';
import createBoardArray from './create-board';

export default function setupBoard(): void {
	createBoardArray('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
	gameData.moveList = [];
	gameData.logList = [];
	gameData.moveList.push('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
}
