import gameData from './variables';
import setupBoard from './board/setup-board';
import createBoard from './board/create-board';
import points from './points';
import * as validation from './validation/validation';
import makeMove from './validation/make-move';
import findAllMoves from './validation/all-moves';
import isCheck from './validation/is-check';
import gameEndingStatus from './validation/ending';
import undoMove from './board/undo';

export = {
	gameData,
	setupBoard,
	createBoard,
	points,
	makeMove,
	validation,
	findAllMoves,
	isCheck,
	gameEndingStatus,
	undoMove,
}
