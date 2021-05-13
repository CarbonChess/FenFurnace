export function getColour(cell) {
	if (!inCell(cell)) {
		console.warn('Cell', cell, 'is empty');
		return;
	}
	return isWhite(getPieceInCell(cell)) ? 'w' : 'b';
}

export function getPieceInCell(cell) {
	const col = parseInt(cell[0], 36) - 9;
	const row = 8 - (cell[1]);
	return global.boardArray[row][col - 1];
	//letter is column, number is row
}

export function inCell(cell) {
	return getPieceInCell(cell) !== '-';
}

export function move(startCell, endCell) {
	if(!inCell(startCell)){
		console.log('No Piece Found');
		return false;
	}
	console.log('Moving', startCell, '->', endCell);
	let originalPiece = getPieceInCell(startCell);
	add(originalPiece, endCell);
	del(startCell);
}

export function add(piece, cell) {
	console.log('Adding piece', piece, 'to', cell);
	const col = (parseInt(cell[0], 36) - 9);
	const row = 8 - (cell[1]);
	let str = global.boardArray[row];
	global.boardArray[row] = str.substr(0, col - 1) + piece + str.substr(col);
}

export function del(cell) {
	console.log('Deleting piece from', cell);
	const col = (parseInt(cell[0], 36) - 9);
	const row = 8 - (cell[1]);
	let str = global.boardArray[row];
	global.boardArray[row] = str.substr(0, col - 1) + '-' + str.substr(col);
}

export function isBlack(pieceId) {
	return pieceId === pieceId.toLowerCase();
}

export function isWhite(pieceId) {
	return pieceId === pieceId.toUpperCase();
}