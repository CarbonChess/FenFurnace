const board = require('./board');
const globals = board.globals;
const evaluation = require('./evaluation');
const validation = require('./validation');

function test() {
	board.initialise();
	console.log(globals.boardArray);
	validation.makeMove('A2', 'A4');
	console.log(board.createFenFromBoardArray());
	console.log(globals.boardArray);
}

module.exports = test;
