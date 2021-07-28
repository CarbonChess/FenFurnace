const {
	gameData,
	setupBoard,
	createBoard,
	undoMove,
	isCheck,
	findAllMoves,
	makeMove,
} = require('./src/index.js');

let failedTests = [];
console.assert = (assertion, message) => {
	if (!assertion) failedTests.push(`Assertion '${message}' failed`);
}

function test() {

	// Initialising
	setupBoard();
	console.assert(gameData.boardArray[1] === 'p'.repeat(8), 'Pawns set up');
	console.assert(gameData.castling.w.k && gameData.castling.b.q, 'Castling valid');
	createBoard('rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/R3K2R w KQkq - 4 3');
	console.assert(gameData.boardArray[1] === 'pppp-ppp', 'Pawn moved out of row 2');
	console.assert(gameData.boardArray[2] === '-----n--', 'Knight in row 3');

	// Finding moves
	setupBoard();
	console.assert(findAllMoves('G1').join(',') === 'F3,A3', 'White knight can move');
	console.assert(findAllMoves('A2').join(',') === 'A3,A4', 'Two valid pawn moves');
	console.assert(findAllMoves('A4').length === 0, 'No valid empty moves');

	// Moving
	createBoard('rnb3n1/ppkpppbr/3q1P2/2P1P1pP/7P/2P5/PP6/RNBQKBNR w KQ - 1 15');
	console.assert(makeMove('D8', 'D5') !== false, 'Queen can move arbitrarily forward');
	console.assert(makeMove('C8', 'G5') !== false, 'Bishop can attack');

	// Castling
	createBoard('rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/R3K2R w KQkq - 4 3');
	console.assert(gameData.boardArray[7] === 'R---K--R', 'King has not castled');
	makeMove('E1', 'C1');
	console.assert(gameData.boardArray[7] === '--KR---R', 'King has castled');
	console.assert(!gameData.castling.w.k && gameData.castling.b.q, 'Castling invalid for white');
	console.assert(gameData.logList.pop() === 'O-O-O', 'Correct log for castling');

	// Putting in check
	createBoard('rnbqkbnr/ppp1pppp/3p4/1B6/8/4P3/PPPP1PPP/RNBQK1NR b KQkq - 1 2');
	console.assert(isCheck('b'), 'Black should be in check');

	// Moving while in check
	createBoard('rn1qkbnr/ppp1pppp/3p4/8/2B3b1/4P3/PPPP1PPP/RNBQK1NR w KQkq - 2 3');
	console.assert(!makeMove('E1', 'E2'), 'Invalid king move');
	console.assert(gameData.boardArray[7] === 'RNBQK-NR', 'King should not have moved');
	console.assert(!isCheck('w'), 'White should not be in check');

	// Undoing
	setupBoard();
	makeMove('E2', 'E4');
	undoMove();
	console.assert(gameData.moveNumber === 1, 'Still on first move');
	console.assert(gameData.enpassantSquare !== 'E3', 'Enpassant square reverted');

	// Check king moves
	setupBoard();
	createBoard('rnbqkbnr/ppp1p1pp/3p1p2/7Q/4P3/3P4/PPP2PPP/RNB1KBNR b KQkq - 1 3');
	console.assert(findAllMoves('E8').join('') === 'D7', 'Valid king move found');

	// Promoting
	setupBoard();
	createBoard('rnbqkbnr/pPppppp1/8/8/8/8/1PPPPPpP/RNBQKBNR w KQkq - 0 5');
	gameData.promotionPiece = 'Q';
	makeMove('B7', 'A8');
	console.assert(gameData.boardArray[0] === 'Qnbqkbnr', 'Pawn is promoted to queen');

}

test();

if (failedTests.length > 0) {
	throw new Error(`${failedTests.length} tests failed\n` + failedTests.join('\n'));
}
