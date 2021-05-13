import createFenFromBoardArray from './board/create-fen.js';
import {invertColour} from './helpers.js';
import isCheck from './validation/is-check.js';
import * as pieces from './pieces.js';

export function validateMove(startCell, endCell) {
	if(startCell === endCell) return false;
	return isValid(startCell, endCell) && !pieceInWay(startCell, endCell);
}

export function isValid(startCell, endCell) {
	let piece = pieces.getPieceInCell(startCell);
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
			const enpassantTaken = endCell === global.enpassantSquare && deltaLetter === 1 && deltaNumber === 1;
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

export function makeMove(startCell, endCell, { isTest } = {}) {
	const piece = pieces.getPieceInCell(startCell);
	let pieceCaptured = pieces.inCell(endCell);
	let colour = pieces.getColour(startCell);
	let beforeState = global.boardArray;

	//must be same colour as move
	if (colour != global.currentTurn && !isTest) {
		console.log('Failed to move', startCell, '->', endCell);
		return false;
	}

	//validate castling
	if (piece.toLowerCase() === 'k' && Math.abs(endCell.charCodeAt(0) - startCell.charCodeAt(0)) === 2) {
		const isKingside = endCell.charCodeAt(0) - startCell.charCodeAt(0) > 0;
		const side = isKingside ? 'k' : 'q';
		if (global.castling[colour][side]) {
			const file = isKingside ? 'H' : 'A';
			const row = colour === 'w' ? '1' : '8';

			//check if clear squares in between
			const squares = isKingside ? ['F', 'G'] : ['B', 'C', 'D'];
			for (let i in squares) {
				if (pieces.inCell(squares[i] + row))
					return false;
			}

			console.debug('v.134',pieces.inCell(startCell), pieces.inCell(endCell), pieces.getPieceInCell(startCell), pieces.getPieceInCell(endCell))
			pieces.move(startCell, endCell); //move king
			pieces.move(file + row, (isKingside ? 'F' : 'D') + row); //move rook

			//make castling impossible for colour that castled
			castling[colour] = { k: false, q: false };
		}
		else return false;
	}

	//move if valid
	if (validateMove(startCell, endCell)) {
		pieces.move(startCell, endCell);
	} else {
		return false;
	}

	//enpassant check (take old enpassant pawn && update enpassant square)
	if (piece === 'p' && endCell === global.enpassantSquare) {
		pieces.del(global.enpassantSquare);
		global.halfMoveCount = 0;
	}
	const deltaLetter = Math.abs(+endCell[1] - +startCell[1]);
	if (piece.toLowerCase() === 'p' && deltaLetter === 2) {
		const enpassantNumber = colour === 'w' ? (+endCell[1] - 1) : (+endCell[1] + 1);
		global.enpassantSquare = endCell[0] + enpassantNumber;
	} else {
		global.enpassantSquare === '-';
	}

	if (isCheck(global.currentTurn)) {
		global.boardArray = beforeState;
		return false;
	}

	//if rook or king make castling invalid
	if (piece === 'k') {
		castling[colour] = { k: false, q: false };
	} else if (piece === 'r') {
		const isKingside = startCell === 'H';
		const side = isKingside ? 'k' : 'q';
		castling[colour][side] = false;
	}

	//update halfMoveCount, currentTurn, moveNumber
	if (colour === 'b') global.moveNumber++;
	
	if(piece.toLowerCase() === 'p' || pieceCaptured)
		global.halfMoveCount = 0;
	else 
		global.halfMoveCount++;

	//change turn
	global.currentTurn = global.currentTurn === 'w' ? 'b' : 'w';
	//update fen && movelist
	global.movelist.push(createFenFromBoardArray())

	return global.movelist.slice(-1)[0];
}
