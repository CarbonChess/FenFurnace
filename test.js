import './index.js'; // setup globals
import * as validation from './src/validation.js';
import setupBoard from './src/board/setup-board';
import createBoard from './src/board/create-board.js';
import gameEndingStatus from './src/validation/ending.js';
import isCheck from './src/validation/is-check.js';

function test() {

	setupBoard();
	console.assert(global.boardArray[1] === 'p'.repeat(8), 'Pawns set up');
	console.assert(global.castling.w.k && global.castling.b.q, 'Castling valid');

	createBoard('rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/R3K2R w KQkq - 4 3');
	console.assert(global.boardArray[1] === 'pppp-ppp', 'Pawn moved out of row 2');
	console.assert(global.boardArray[2] === '-----n--', 'Knight in row 3');
	console.assert(global.boardArray[7] === 'R---K--R', 'King has not casled');

	validation.makeMove('E1', 'C1');
	console.assert(global.boardArray[7] === '--KR---R', 'King has castled');
	console.assert(!global.castling.w.k && global.castling.b.q, 'Castling invalid for white');
	console.assert(!gameEndingStatus('b'), 'Black has not won');

	createBoard('rnbqkbnr/ppp1pppp/3p4/1B6/8/4P3/PPPP1PPP/RNBQK1NR b KQkq - 1 2');
	console.assert(isCheck('b'), 'Black should be in check');

	createBoard('rn1qkbnr/ppp1pppp/3p4/8/2B3b1/4P3/PPPP1PPP/RNBQK1NR w KQkq - 2 3');
	console.assert(!validation.makeMove('E1', 'E2'), 'Invalid king move');
	console.assert(global.boardArray[7] === 'RNBQK-NR', 'King should not have moved');
	console.assert(!isCheck('w'), 'White should not be in check');

}

test();
