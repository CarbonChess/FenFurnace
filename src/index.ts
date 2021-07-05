import gameData from './src/variables';
import setupBoard from './src/board/setup-board';
import createBoard from './src/board/create-board';
import * as validation from './src/validation/validation';
import makeMove from './src/validation/make-move';
import findAllMoves from './src/validation/all-moves';
import isCheck from './src/validation/is-check';
import gameEndingStatus from './src/validation/ending';
import undoMove from './src/board/undo';

export default {
	gameData,
	setupBoard,
	createBoard,
	makeMove,
	validation,
	findAllMoves,
	isCheck,
	gameEndingStatus,
	undoMove,
}
