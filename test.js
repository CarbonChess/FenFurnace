import './index.js';
import {initialise} from './src/helpers.js';
import getAllMoves from './src/validation/all-moves.js';
import * as validation from './src/validation.js';
import createBoard from './src/board/create-board.js';
import gameEndingStatus from './src/validation/ending.js';

export default function test() {
	console.log('A8 H8\nA1 H1');
	initialise();
	createBoard("rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/R3K2R w KQkq - 4 3");
	validation.makeMove('E1','C1');
	console.log(global.boardArray);
	console.log(global.movelist);
	console.log(gameEndingStatus('b'));
}
// test();
