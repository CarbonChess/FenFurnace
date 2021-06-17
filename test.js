import './index.js'; // setup globals
import * as validation from './src/validation.js';
import setupBoard from './src/board/setup-board.js';
import createBoard from './src/board/create-board.js';
import undoMove from './src/board/undo.js';
import isCheck from './src/validation/is-check.js';
import findAllMoves from './src/validation/all-moves.js';

function test() {

	// Initialising
	setupBoard();
	console.assert(global.boardArray[1] === 'p'.repeat(8), 'Pawns set up');
	console.assert(global.castling.w.k && global.castling.b.q, 'Castling valid');

	// Finding moves
	setupBoard();
	console.assert(findAllMoves('A2').join(',') === 'A3,A4', 'Two valid pawn moves');
	console.assert(findAllMoves('A4').length === 0, 'No valid empty moves');

	// Moving
	createBoard('rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/R3K2R w KQkq - 4 3');
	console.assert(global.boardArray[1] === 'pppp-ppp', 'Pawn moved out of row 2');
	console.assert(global.boardArray[2] === '-----n--', 'Knight in row 3');

	// Castling & log output
	createBoard('rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/R3K2R w KQkq - 4 3');
	console.assert(global.boardArray[7] === 'R---K--R', 'King has not casled');
	validation.makeMove('E1', 'C1');
	console.assert(global.boardArray[7] === '--KR---R', 'King has castled');
	console.assert(!global.castling.w.k && global.castling.b.q, 'Castling invalid for white');
	console.assert(global.logList.pop() === 'O-O-O', 'Correct log for castling');

	// Putting in check
	createBoard('rnbqkbnr/ppp1pppp/3p4/1B6/8/4P3/PPPP1PPP/RNBQK1NR b KQkq - 1 2');
	console.assert(isCheck('b'), 'Black should be in check');

	// Moving while in check
	createBoard('rn1qkbnr/ppp1pppp/3p4/8/2B3b1/4P3/PPPP1PPP/RNBQK1NR w KQkq - 2 3');
	console.assert(!validation.makeMove('E1', 'E2'), 'Invalid king move');
	console.assert(global.boardArray[7] === 'RNBQK-NR', 'King should not have moved');
	console.assert(!isCheck('w'), 'White should not be in check');

	// Undoing
	setupBoard();
	validation.makeMove('E2', 'E4');
	undoMove();
	console.assert(global.moveNumber == '1', 'Still on first move');
	console.assert(global.enpassantSquare !== 'E3', 'Enpassant square reverted');

	// Check king moves
	setupBoard();
	createBoard('rnbqkbnr/ppp1p1pp/3p1p2/7Q/4P3/3P4/PPP2PPP/RNB1KBNR b KQkq - 1 3');
	console.assert(findAllMoves('E8').join('') === 'D7', 'Valid king move found');

	// Promoting
	setupBoard();
	createBoard('rnbqkbnr/pPppppp1/8/8/8/8/1PPPPPpP/RNBQKBNR w KQkq - 0 5');
	global.promotionPiece = 'Q';
	validation.makeMove('B7', 'A8');
	console.assert(global.boardArray[0] === 'Qnbqkbnr', 'Pawn is promoted to queen');

}

test();
