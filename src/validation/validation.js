import gameData from '../variables.js';
import { invertColour } from '../helpers.js';
import * as pieces from '../pieces.js';

export function validateMove(startCell, endCell) {
	if (startCell === endCell) return false;
	return isValid(startCell, endCell) && !pieceInWay(startCell, endCell);
}

export function isValid(startCell, endCell) {
	let piece = pieces.getPieceInCell(startCell);
	let colour = piece === piece.toUpperCase() ? 'w' : 'b';
	let startNumber = parseInt(startCell[1]);
	let endNumber = parseInt(endCell[1]);
	let deltaNumber = Math.abs(endNumber - startNumber);
	let deltaLetter = Math.abs(endCell.charCodeAt(0) - startCell.charCodeAt(0));
	switch (piece.toLowerCase()) {
		case 'r':
			return deltaLetter === 0 || deltaNumber === 0;
		case 'n':
			return deltaNumber + deltaLetter === 3 && deltaLetter !== 0 && deltaNumber !== 0;
		case 'k':
			const singleMove = deltaLetter <= 1 && deltaNumber <= 1;
			return (singleMove);
		case 'b':
			return deltaLetter === deltaNumber;
		case 'q':
			return deltaLetter === 0 || deltaNumber === 0 || deltaLetter === deltaNumber;
		case 'p':
			const takingPiece = deltaLetter === 1 && deltaNumber === 1 && pieces.inCell(endCell) && pieces.getColour(endCell) === invertColour(colour);
			const pawnMove = deltaNumber === 1 || (deltaNumber === 2 && [2, 7].includes(startNumber));
			const forward = colour === 'w' ? endNumber > startNumber : endNumber < startNumber;
			const enpassantTaken = endCell === gameData.enpassantSquare && deltaLetter === 1 && deltaNumber === 1;
			return (takingPiece || deltaLetter === 0 || enpassantTaken) && pawnMove && forward;
		default:
			return true;
	}
}

export function pieceInWay(startCell, endCell) {
	let invalidMove = false;
	const direction = {};
	let piece = pieces.getPieceInCell(startCell);
	let colour = pieces.getColour(startCell);

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
		case 'p': {
			if (deltaLetter === 0) {
				if (colour === 'w') {
					invalidMove = pieces.inCell(startCell[0] + (startNumber + 1));
					if (deltaNumber === 2 && !invalidMove) {
						invalidMove = pieces.inCell(startCell[0] + (startNumber + 2));
					}
				}
				else {
					invalidMove = pieces.inCell(startCell[0] + (startNumber - 1));
					if (deltaNumber === 2 && !invalidMove) {
						invalidMove = pieces.inCell(startCell[0] + (startNumber - 2));
					}
				}
			}
			return invalidMove;
		}
		case 'r':
		case 'b':
		case 'q': {
			let hasCollided = false;
			for (let i = 1; i <= Math.max(deltaLetter, deltaNumber); i++) {
				const letter = String.fromCharCode(parseInt(startLetter.charCodeAt(0)) + direction.l * i);
				const number = startNumber + direction.n * i;
				const pieceColour = pieces.getColour(letter + number);

				if (pieceColour === colour || hasCollided)
					invalidMove = true;
				if (pieceColour === invertColour(colour) && !hasCollided)
					hasCollided = true;
			}
			return invalidMove;
		}
		default: {
			return pieces.getColour(endCell) === colour;
		}
	}
}
