import gameData from '../variables';
import * as pieces from '../pieces';
import createFen from '../board/create-fen';
import isCheck from './is-check';
import findAllMoves from './all-moves';
import { indexToLetter } from '../helpers';
import { Colour, EndingStatus } from '../types';

export default function gameEndingStatus(colour: Colour): EndingStatus {

	if (gameData.halfMoveCount >= 100)
		return 'stalemate'; // 50 move rule
	if (createFen().split(' ')[0].replace(/\/|\d+/g, '').toLowerCase() === 'kk')
		return 'stalemate'; // only 2 kings left

	let currentlyCheck = isCheck(colour);
	let noValidMoves = true;

	outer:
	for (let i = 1; i <= 8; i++) {
		for (let j = 1; j <= 8; j++) {
			const startCell = indexToLetter(j) + i;
			if (pieces.getColour(startCell) === colour) {
				if (findAllMoves(startCell).length > 0)
					noValidMoves = false;
				if (!noValidMoves) break outer;
			}
		}
	}

	if (noValidMoves) return currentlyCheck ? 'checkmate' : 'stalemate';
	else return false;
}
