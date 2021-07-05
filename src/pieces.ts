import gameData from './variables';
import { Colour, Cell, PieceID } from './types';

export function getColour(cell: Cell): Colour {
	if (!inCell(cell)) {
		throw new Error('Cell ' + cell + ' is empty');
	}
	return isWhite(getPieceInCell(cell)) ? 'w' : 'b';
}

export function getPieceInCell(cell: Cell): PieceID {
	const col = parseInt(cell[0], 36) - 9;
	const row = 8 - (+cell[1]);
	return gameData.boardArray[row][col - 1] as PieceID;
	//letter is column, number is row
}

export function inCell(cell: Cell): boolean {
	return getPieceInCell(cell) !== '-';
}

export function move(startCell: Cell, endCell: Cell): boolean {
	if (!inCell(startCell)) {
		// console.log('No Piece Found');
		return false;
	}
	// console.log('Moving', startCell, '->', endCell);
	let originalPiece = getPieceInCell(startCell);
	add(originalPiece, endCell);
	del(startCell);
	return true;
}

export function add(piece: PieceID, cell: Cell): void {
	// console.log('Adding piece', piece, 'to', cell);
	const col = (parseInt(cell[0], 36) - 9);
	const row = 8 - (+cell[1]);
	let str = gameData.boardArray[row];
	gameData.boardArray[row] = str.substr(0, col - 1) + piece + str.substr(col);
}

export function del(cell: Cell): void {
	// console.log('Deleting piece from', cell);
	const col = (parseInt(cell[0], 36) - 9);
	const row = 8 - (+cell[1]);
	let str = gameData.boardArray[row];
	gameData.boardArray[row] = str.substr(0, col - 1) + '-' + str.substr(col);
}

export function isBlack(pieceId: PieceID): boolean {
	return pieceId === pieceId.toLowerCase();
}

export function isWhite(pieceId: PieceID): boolean {
	return pieceId === pieceId.toUpperCase();
}
