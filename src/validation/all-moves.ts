import { coordsToCell } from '../helpers';
import createFenFromBoardArray from '../board/create-fen';
import createBoardArray from '../board/create-board';
import makeMove from './make-move';
import * as pieces from '../pieces';
import { Cell, Board } from '../types';

export default function getAllMoves(cell: Cell): Board {
	if (!pieces.inCell(cell)) {
		//empty square
		return [];
	}
	let possibleSquares = [];
	let beforeState = createFenFromBoardArray();
	for (let i = 1; i <= 8; i++) {
		for (let j = 1; j <= 8; j++) {
			const targetCell = coordsToCell(j, i);

			if (makeMove(cell, targetCell, false)) {
				possibleSquares.push(targetCell);
			}
			createBoardArray(beforeState);
		}
	}
	return possibleSquares;
}
