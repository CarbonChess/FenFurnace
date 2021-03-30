const { createBoardArray, invertColour, globals } = require('./board');
const { evaluation, materialDifference } = require('./evaluation');
const { isValid, getPieceInCell, validateMove } = require('./validation');

module.exports = function test() {
	createBoardArray('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');

	console.log(globals.boardArray);
	console.log(isValid('D1', 'E2'));
}
