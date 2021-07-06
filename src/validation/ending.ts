import gameData from '../variables';
import * as pieces from '../pieces';
import createFen from '../board/create-fen';
import isCheck from './is-check';
import findAllMoves from './all-moves';
import { coordsToCell } from '../helpers';
import { Colour, EndingStatus } from '../types';

export default function gameEndingStatus(colour: Colour): EndingStatus {

	const fiftyMoveRule = gameData.halfMoveCount >= 100;
	const onlyKings = createFen().split(' ')[0].replace(/\/|\d+/g, '').toLowerCase() === 'kk';
	if (fiftyMoveRule || onlyKings) return 'stalemate';

	const currentlyCheck = isCheck(colour);
	let noValidMoves = true;

	outer:
	for (let i = 1; i <= 8; i++) {
		for (let j = 1; j <= 8; j++) {
			const startCell = coordsToCell(j, i);
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
