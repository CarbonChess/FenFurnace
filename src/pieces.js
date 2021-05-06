export function getPieceColour(cell) {
	if (!pieceInCell(cell)) {
		console.log('NO PIECE FOUND IN', cell);
		return;
	}
	return isWhitePiece(getPieceInCell(cell)) ? 'w' : 'b';
}

export function getPieceInCell(cell) {
	const col = parseInt(cell[0], 36) - 9;
	const row = 8 - (cell[1]);
	return global.boardArray[row][col - 1];
	//letter is column, number is row
}

export function pieceInCell(cell) {
	return getPieceInCell(cell) !== '-';
}

export function movePiece(startCell, endCell) {
	let originalPiece = getPieceInCell(startCell);
	addPiece(originalPiece, endCell);
	deletePiece(startCell);
}

export function addPiece(piece, cell) {
	const col = (parseInt(cell[0], 36) - 9);
	const row = 8 - (cell[1]);
	let str = global.boardArray[row];
	global.boardArray[row] = str.substr(0, col - 1) + piece + str.substr(col);
}

export function deletePiece(cell) {
	const col = (parseInt(cell[0], 36) - 9);
	const row = 8 - (cell[1]);
	let str = global.boardArray[row];
	global.boardArray[row] = str.substr(0, col - 1) + '-' + str.substr(col);
}

export function isBlackPiece(pieceId) {
	return pieceId === pieceId.toLowerCase();
}

export function isWhitePiece(pieceId) {
	return pieceId === pieceId.toUpperCase();
}
