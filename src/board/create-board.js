export default function createBoardArray(fenString) {
	global.currentFen = fenString;

	const currentBoard = fenString.split(' ')[0].split('/');
	global.currentTurn = fenString.split(' ')[1];

	//castling
	global.castling['w'].q = false;
	global.castling['w'].k = false;
	global.castling['b'].q = false;
	global.castling['b'].k = false;

	const castleString = fenString.split(' ')[2];
	for (let i in castleString) {
		const colour = castleString[i] === castleString[i].toUpperCase() ? 'w' : 'b';
		global.castling[colour][castleString[i].toLowerCase()] = true;
	}

	global.enpassantSquare = fenString.split(' ')[3].toUpperCase();
	global.halfMoveCount = fenString.split(' ')[4];
	global.moveNumber = fenString.split(' ')[5];

	global.boardArray = currentBoard.map(val => {
		return val.replace(/[0-9]/g, n => '-'.repeat(n))
	});
}
