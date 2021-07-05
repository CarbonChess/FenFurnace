import { indexToLetter } from '../helpers';
import * as pieces from '../pieces';
import * as validation from './validation';
import { Colour } from '../types';

export default function isCheck(colour: Colour): boolean {
	// get the king cells
	let kingCells = { w: '', b: '' };
	for (let i = 1; i <= 8; i++) {
		for (let j = 1; j <= 8; j++) {
			const testCell = indexToLetter(j) + i;
			const testPiece = pieces.getPieceInCell(testCell);
			if (testPiece.toLowerCase() === 'k') {
				let kingColour = pieces.getColour(testCell);
				kingCells[kingColour] = testCell;
			}
		}
	}

	for (let i = 1; i <= 8; i++) {
		for (let j = 1; j <= 8; j++) {
			// if opposite colour, check its moves
			const cell = indexToLetter(j) + i;
			if (!pieces.inCell(cell)) continue;

			const pieceColour = pieces.getColour(cell);
			const diffColour = (pieceColour === 'w' && colour === 'b') || (pieceColour === 'b' && colour === 'w');
			if (diffColour && validation.validateMove(cell, kingCells[colour]))
				return true;
		}
	}
	return false;
}
