const fs = require('fs');
const path = require('path');

const compiledEntry = path.join(__dirname, 'src', 'index.js');

if (!fs.existsSync(compiledEntry)) {
	throw new Error(
		'Missing compiled runtime at ./src/index.js. Run `npx tsc` (or `npm test` after installing dependencies) before running test.js.'
	);
}

const {
	gameData,
	setupBoard,
	createBoard,
	undoMove,
	isCheck,
	findAllMoves,
	makeMove,
} = require(compiledEntry);

function test() {
	const errors = [];

	let got;

	// Initialising
	setupBoard();
	got = gameData.boardArray[1];
	if (got !== 'p'.repeat(8)) errors.push(`Pawns not set up correctly (expected: "${'p'.repeat(8)}", got: "${got}")`);
	got = { wk: gameData.castling.w.k, bq: gameData.castling.b.q };
	if (!got.wk || !got.bq) errors.push(`Castling not valid after setup (expected: w.k=true, b.q=true, got: w.k=${got.wk}, b.q=${got.bq})`);
	createBoard('rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/R3K2R w KQkq - 4 3');
	got = gameData.boardArray[1];
	if (got !== 'pppp-ppp') errors.push(`Pawn did not move out of row 2 (expected: "pppp-ppp", got: "${got}")`);
	got = gameData.boardArray[2];
	if (got !== '-----n--') errors.push(`Knight not in row 3 (expected: "-----n--", got: "${got}")`);

	// Finding moves
	setupBoard();
	got = findAllMoves('G1').join(',');
	if (got !== 'F3,A3') errors.push(`White knight cannot move (expected: "F3,A3", got: "${got}")`);
	got = findAllMoves('A2').join(',');
	if (got !== 'A3,A4') errors.push(`Pawn moves not found (expected: "A3,A4", got: "${got}")`);
	got = findAllMoves('A4').length;
	if (got !== 0) errors.push(`Empty square returned moves (expected: 0, got: ${got})`);

	// Moving
	createBoard('rnb3n1/ppkpppbr/3q1P2/2P1P1pP/7P/2P5/PP6/RNBQKBNR w KQ - 1 15');
	got = makeMove('D8', 'D5');
	if (got === false) errors.push(`Queen could not move forward (expected: not false, got: ${got})`);
	got = makeMove('C8', 'G5');
	if (got === false) errors.push(`Bishop could not attack (expected: not false, got: ${got})`);

	// Castling
	createBoard('rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/R3K2R w KQkq - 4 3');
	got = gameData.boardArray[7];
	if (got !== 'R---K--R') errors.push(`King already castled before move (expected: "R---K--R", got: "${got}")`);
	makeMove('E1', 'C1');
	got = gameData.boardArray[7];
	if (got !== '--KR---R') errors.push(`King did not castle (expected: "--KR---R", got: "${got}")`);
	got = { wk: gameData.castling.w.k, bq: gameData.castling.b.q };
	if (got.wk || !got.bq) errors.push(`Castling flags not updated for white (expected: w.k=false, b.q=true, got: w.k=${got.wk}, b.q=${got.bq})`);
	got = gameData.logList.pop();
	if (got !== 'O-O-O') errors.push(`Incorrect log for castling (expected: "O-O-O", got: "${got}")`);

	// Putting in check
	createBoard('rnbqkbnr/ppp1pppp/3p4/1B6/8/4P3/PPPP1PPP/RNBQK1NR b KQkq - 1 2');
	got = isCheck('b');
	if (!got) errors.push(`Black not in check (expected: true, got: ${got})`);

	// Moving while in check
	createBoard('rn1qkbnr/ppp1pppp/3p4/8/2B3b1/4P3/PPPP1PPP/RNBQK1NR w KQkq - 2 3');
	got = makeMove('E1', 'E2');
	if (got) errors.push(`Invalid king move was allowed (expected: falsy, got: ${got})`);
	got = gameData.boardArray[7];
	if (got !== 'RNBQK-NR') errors.push(`King moved when it should not have (expected: "RNBQK-NR", got: "${got}")`);
	got = isCheck('w');
	if (got) errors.push(`White unexpectedly in check (expected: false, got: ${got})`);

	// Undoing
	setupBoard();
	makeMove('E2', 'E4');
	undoMove();
	got = gameData.moveNumber;
	if (got !== 1) errors.push(`Move number not reverted (expected: 1, got: ${got})`);
	got = gameData.enpassantSquare;
	if (got === 'E3') errors.push(`Enpassant square not reverted (expected: not "E3", got: "${got}")`);

	// Check king moves
	setupBoard();
	createBoard('rnbqkbnr/ppp1p1pp/3p1p2/7Q/4P3/3P4/PPP2PPP/RNB1KBNR b KQkq - 1 3');
	got = findAllMoves('E8').join('');
	if (got !== 'D7') errors.push(`Valid king move not found (expected: "D7", got: "${got}")`);

	// Promoting
	setupBoard();
	createBoard('rnbqkbnr/pPppppp1/8/8/8/8/1PPPPPpP/RNBQKBNR w KQkq - 0 5');
	gameData.promotionPiece = 'Q';
	makeMove('B7', 'A8');
	got = gameData.boardArray[0];
	if (got !== 'Qnbqkbnr') errors.push(`Pawn not promoted to queen (expected: "Qnbqkbnr", got: "${got}")`);

	if (errors.length > 0) {
		console.error(`${errors.length} test(s) failed:`);
		errors.forEach(e => console.error(`  - ${e}`));
		process.exit(1);
	} else {
		console.log('All tests finished successfully');
	}
}

test();
