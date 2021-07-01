import gameData from './src/variables.js';
import setupBoard from './src/board/setup-board.js';
import createBoard from './src/board/create-board.js';
import * as validation from './src/validation/validation.js';
import makeMove from './src/validation/make-move.js';
import findAllMoves from './src/validation/all-moves.js';
import isCheck from './src/validation/is-check.js';
import gameEndingStatus from './src/validation/ending.js';
import undoMove from './src/board/undo.js';

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
