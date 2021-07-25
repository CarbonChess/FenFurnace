import { coordsToCell } from '../helpers';
import * as pieces from '../pieces';
import * as validation from './validation';
import { Cell, Colour } from '../types';

export default function isCheck(colour: Colour): boolean {
	// get the king cells
	const kingCells: Record<Colour, Cell> = { w: 'E1', b: 'E8' };
	for (let i = 1; i <= 8; i++) {
		for (let j = 1; j <= 8; j++) {
			const testCell = coordsToCell(j, i);
			const testPiece = pieces.getPieceInCell(testCell);
			if (testPiece.toLowerCase() === 'k') {
				const kingColour = pieces.getColour(testCell);
				if (kingColour) kingCells[kingColour] = testCell;
			}
		}
	}

	for (let i = 1; i <= 8; i++) {
		for (let j = 1; j <= 8; j++) {
			// if opposite colour, check its moves
			const cell = coordsToCell(j, i);
			if (!pieces.inCell(cell)) continue;

			const pieceColour = pieces.getColour(cell);
			const diffColour = (pieceColour === 'w' && colour === 'b') || (pieceColour === 'b' && colour === 'w');
			if (diffColour && validation.validateMove(cell, kingCells[colour]))
				return true;
		}
	}
	return false;
}
