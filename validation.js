const { globals } = require('./board');
const board = require('./board');

function validateMove(startCell, endCell) {
	return isValid(startCell, endCell) && !pieceInWay(startCell, endCell);
}

function isValid(startCell, endCell) {
	let piece = getPieceInCell(startCell);
	let colour = piece === piece.toUpperCase() ? 'w' : 'b';
	let startNumber = parseInt(startCell[1]);
	let endNumber = parseInt(endCell[1]);
	let deltaNumber = Math.abs(endNumber - startNumber);
	let startLetter = startCell[0];
	let endLetter = endCell[0];
	let deltaLetter = Math.abs(endCell.charCodeAt(0) - startCell.charCodeAt(0));
	switch (piece.toLowerCase()) {
		case 'r':
			return deltaLetter === 0 || deltaNumber === 0;
		case 'n':
			return deltaNumber + deltaLetter == 3 && deltaLetter !== 0 && deltaNumber !== 0;
		case 'k':
			const singleMove = deltaLetter <= 1 && deltaNumber <= 1;
			const castleMove = deltaLetter <= 2 && deltaNumber === 0 && (castling[colour[0]].k || castling[colour[0]].q);
			return (singleMove || castleMove);
		case 'b':
			return deltaLetter === deltaNumber;
		case 'q':
			return deltaLetter === 0 || deltaNumber === 0 || deltaLetter === deltaNumber;
		case 'p':
			const takingPiece = deltaLetter === 1 && deltaNumber === 1 && pieceInCell(endCell) && getPieceColour(endCell) === invertColour(colour);
			const pawnMove = deltaNumber === 1 || (deltaNumber === 2 && [2, 7].includes(startNumber));
			const forward = colour === 'w' ? endNumber > startNumber : endNumber < startNumber;
			const enpassantTaken = endCell === globals.enpassantsquare && deltaLetter;
			1 && deltaNumber;
			1;

			return (takingPiece || deltaLetter === 0 || enpassantTaken) && pawnMove && forward;
		default:
			return true;
	}
}

function pieceInWay(startCell, endCell) {
	let invalidMove = false;
	const direction = {};
	let piece = getPieceInCell(startCell);
	let colour = getPieceColour(startCell);

	let startNumber = parseInt(startCell[1]);
	let endNumber = parseInt(endCell[1]);
	let deltaNumber = Math.abs(endNumber - startNumber);
	let startLetter = startCell[0];
	let endLetter = endCell[0];
	let deltaLetter = Math.abs(endCell.charCodeAt(0) - startCell.charCodeAt(0));

	// determine direction
	if (endLetter > startLetter) direction.l = 1;
	else if (endLetter < startLetter) direction.l = -1;
	else direction.l = 0;
	if (endNumber > startNumber) direction.n = 1;
	else if (endNumber < startNumber) direction.n = -1;
	else direction.n = 0;

	// check cells
	switch (piece.toLowerCase()) {
		case 'p':
			if (deltaLetter === 0) {
				if (colour === 'w') {
					invalidMove = pieceInCell(startCell[0] + (startNumber + 1));
					if (deltaNumber === 2 && !invalidMove) {
						invalidMove = pieceInCell(startCell[0] + (startNumber + 2));
					}
				}
				else {
					invalidMove = pieceInCell(startCell[0] + (startNumber - 1));
					if (deltaNumber === 2 && !invalidMove) {
						invalidMove = pieceInCell(startCell[0] + (startNumber - 2));
					}
				}
			}
			return invalidMove;
		case 'r':
		case 'b':
		case 'q':
			let hasCollided = false;
			for (let i = 1; i <= Math.max(deltaLetter, deltaNumber); i++) {
				let letter = String.fromCharCode(parseInt(startLetter.charCodeAt(0)) + direction.l * i);
				let number = startNumber + direction.n * i;

				if (getPieceColour(letter + number) === colour || hasCollided)
					invalidMove = true;
				if ((getPieceColour(letter + number) == board.invertColour(colour) && !hasCollided))
					hasCollided = true;
			}
			return invalidMove;
		default:
			if (getPieceColour(endCell) === colour)
				return true;
			else
				return false;
	}
}

function getPieceColour(cell) {
	if (!pieceInCell(cell)) {
		console.log('NO PIECE FOUND IN ' + cell);
		return 0;
	}
	return getPieceInCell(cell) === getPieceInCell(cell).toUpperCase() ? 'w' : 'b';
}

function getPieceInCell(cell) {
	const col = (parseInt(cell[0], 36) - 9);
	const row = 8 - (cell[1]);
	return globals.boardArray[row][col - 1];
	//letter is column, number is row
}

function pieceInCell(cell) {
	return getPieceInCell(cell) !== '-';
}

function addPiece(piece, cell) {
	const col = (parseInt(cell[0], 36) - 9);
	const row = 8 - (cell[1]);
	let str = globals.boardArray[row];
	globals.boardArray[row] = str.substr(0, col - 1) + piece + str.substr(col);
}

function deletePiece(cell) {
	const col = (parseInt(cell[0], 36) - 9);
	const row = 8 - (cell[1]);
	let str = globals.boardArray[row];
	globals.boardArray[row] = str.substr(0, col - 1) + '-' + str.substr(col);
}

function movePiece(startCell, endCell) {
	let originalPiece = getPieceInCell(startCell);
	addPiece(originalPiece, endCell);
	deletePiece(startCell);
}

function makeMove(startCell, endCell) {
	let piece = getPieceInCell(startCell);
	let pieceCaptured = pieceInCell(endCell);
	let colour = getPieceColour(startCell);
	let beforestate = globals.boardArray;
	//must be same colour as move
	if (colour != globals.currentTurn) return false;

	if (validateMove(startCell, endCell)) {
		movePiece(startCell, endCell);
	} else {
		return false;
	}

	//enpassant check (take old enpassant pawn && update enpassantsquare)
	if (piece == 'p' && endCell === globals.enpassantsquare) {
		deletePiece(globals.enpassantsquare);
		globals.halfmoveCount = 0;
	}

	let deltaLetter = Math.abs(+endCell[1] - +startCell[1]);
	if (piece.toLowerCase() === 'p' && deltaLetter == 2) {

		let enpassantNumber = colour == 'w' ? (+endCell[1] - 1) : (+endCell[1] + 1);
		globals.enpassantsquare = endCell[0] + enpassantNumber;


	} else {
		globals.enpassantsquare == '-';
	}

	if (isCheck(globals.currentTurn)) {
		globals.boardArray = beforestate;
		return false;
	}

	// todo castling
	if (colour == 'b') globals.moveNumber++;
	if (piece.toLowerCase() == 'p' || pieceCaptured) globals.halfmoveCount = 0;
	else globals.halfmoveCount++;
	globals.currentTurn = globals.currentTurn === 'w' ? 'b' : 'w';
}

function isCheck(colour) {
	// get the king cells
	let kingCells = { w: '', b: '' };
	for (let i = 1; i <= 8; i++) {
		for (let j = 1; j <= 8; j++) {
			const testCell = String.fromCharCode(0x60 + j) + i;
			if (getPieceInCell(testCell).toLowerCase() == 'k') {
				let kingColour = getPieceInCell(testCell) === getPieceInCell(testCell).toUpperCase() ? 'w' : 'b';
				kingCells[kingColour] = testCell;
			}
		}
	}

	for (let i = 1; i <= 8; i++) {
		for (let j = 1; j <= 8; j++) {
			const cell = String.fromCharCode(0x60 + j) + i;

			// if opposite colour, check its moves
			if (
				(getPieceInCell(cell) === getPieceInCell(cell).toUpperCase() && colour === 'b')
				||
				(getPieceInCell(cell) !== getPieceInCell(cell).toUpperCase() && colour === 'w')
			) {
				if (validateMove(cell, kingCells[colour]))
					return true;
			}
		}
	}
	return false;
}

module.exports = {
	isValid,
	validateMove,
	// todo move to piece.js v
	getPieceInCell,
	getPieceColour,
	pieceInCell,
	pieceInWay,
	movePiece,
	addPiece,
	deletePiece,
	// todo move to piece.js ^
	makeMove,
	isCheck,
};
