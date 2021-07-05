import gameData from '../variables.js';
import createBoardArray from './create-board.js';

export default function setupBoard() {
	createBoardArray('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
	gameData.moveList = [];
	gameData.logList = [];
	gameData.moveList.push('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
}
