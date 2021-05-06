import createBoardArray from './board/create-board.js';
import createFenFromBoardArray from './board/create-fen.js';
import invertColour from './helpers/invert-colour.js';
import indexToLetter from './helpers/index-letter.js';
import * as pieces from './pieces.js';

export function validateMove(startCell, endCell) {
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
			const castleMove = deltaLetter <= 2 && deltaNumber === 0 && (castling[colour[0]].k || castling[colour[0]].q);
			return (singleMove || castleMove);
		case 'b':
			return deltaLetter === deltaNumber;
		case 'q':
			return deltaLetter === 0 || deltaNumber === 0 || deltaLetter === deltaNumber;
		case 'p':
			const takingPiece = deltaLetter === 1 && deltaNumber === 1 && pieces.pieceInCell(endCell) && pieces.getPieceColour(endCell) === invertColour(colour);
			const pawnMove = deltaNumber === 1 || (deltaNumber === 2 && [2, 7].includes(startNumber));
			const forward = colour === 'w' ? endNumber > startNumber : endNumber < startNumber;
			const enpassantTaken = endCell === global.enpassantSquare && deltaLetter;
			1 && deltaNumber;
			return (takingPiece || deltaLetter === 0 || enpassantTaken) && pawnMove && forward;
		default:
			return true;
	}
}

export function pieceInWay(startCell, endCell) {
	let invalidMove = false;
	const direction = {};
	let piece = pieces.getPieceInCell(startCell);
	let colour = pieces.getPieceColour(startCell);

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
					invalidMove = pieces.pieceInCell(startCell[0] + (startNumber + 1));
					if (deltaNumber === 2 && !invalidMove) {
						invalidMove = pieces.pieceInCell(startCell[0] + (startNumber + 2));
					}
				}
				else {
					invalidMove = pieces.pieceInCell(startCell[0] + (startNumber - 1));
					if (deltaNumber === 2 && !invalidMove) {
						invalidMove = pieces.pieceInCell(startCell[0] + (startNumber - 2));
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
				const pieceColour = pieces.getPieceColour(letter + number);

				if (pieceColour === colour || hasCollided)
					invalidMove = true;
				if (pieceColour === invertColour(colour) && !hasCollided)
					hasCollided = true;
			}
			return invalidMove;
		}
		default: {
			return pieces.getPieceColour(endCell) === colour;
		}
	}
}

export function makeMove(startCell, endCell, { isTest } = {}) {
	const piece = pieces.getPieceInCell(startCell);
	let pieceCaptured = pieces.pieceInCell(endCell);
	let colour = pieces.getPieceColour(startCell);
	console.debug('v.147', startCell, endCell, colour);
	let beforeState = global.boardArray;

	//must be same colour as move
	if (colour != global.currentTurn && !isTest) {
		console.log('Failed to move', startCell, '->', endCell, 'v.120');
		return false;
	}

	//validate castling
	if (piece === 'k' && Math.abs(endCell.charCodeAt(0) - startCell.charCodeAt(0)) === 2) {
		const isKingside = endCell.charCodeAt(0) - startCell.charCodeAt(0) > 0;
		const side = isKingside ? 'k' : 'q';
		if (global.castling[colour].side) {
			const file = isKingside ? 'A' : 'H';
			const row = colour === 'w' ? '1' : '8';

			//check if clear squares in between
			let squares = [];
			if (isKingside)
				squares = ['F', 'G'];
			else
				squares = ['B', 'C', 'D'];

			for (let i in squares) {
				if (piece.pieceInCell(squares[i] + row))
					return false;
			}

			pieces.movePiece(startCell, endCell); //move king
			pieces.movePiece(file + row, (isKingside ? 'F' : 'D') + row); //move rook

			//make castling impossible for colour that castled
			castling[colour] = { k: false, q: false };
		}
		else return false;
	}

	//move if valid
	if (validateMove(startCell, endCell)) {
		console.debug('Moving', startCell, '->', endCell);
		pieces.movePiece(startCell, endCell);
		console.debug('v.158 piece moved')
	} else {
		return false;
	}

	//enpassant check (take old enpassant pawn && update enpassant square)
	if (piece === 'p' && endCell === global.enpassantSquare) {
		pieces.deletePiece(global.enpassantSquare);
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
		console.debug('v.185', 'is check', global.boardArray, beforeState)
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
	global.halfMoveCount += (piece.toLowerCase() === 'p' || pieceCaptured) ? 0 : 1;

	//change turn
	global.currentTurn = global.currentTurn === 'w' ? 'b' : 'w';

	return createFenFromBoardArray();
}

export function isCheck(colour) {
	// get the king cells
	let kingCells = { w: '', b: '' };
	for (let i = 1; i <= 8; i++) {
		for (let j = 1; j <= 8; j++) {
			const testCell = indexToLetter(j) + i;
			const testPiece = pieces.getPieceInCell(testCell);
			if (testPiece.toLowerCase() === 'k') {
				let kingColour = pieces.getPieceColour(testCell);
				kingCells[kingColour] = testCell;
			}
		}
	}
	
	for (let i = 1; i <= 8; i++) {
		for (let j = 1; j <= 8; j++) {
			// if opposite colour, check its moves
			const cell = indexToLetter(j) + i;
			if (!pieces.pieceInCell(cell)) continue;

			const pieceColour = pieces.getPieceColour(cell);
			if (	
				(
					(pieces.isWhitePiece(pieceColour) && colour === 'b')
					||
					(pieces.isBlackPiece(pieceColour) && colour === 'w')
				) &&
				validateMove(cell, kingCells[colour])
			) {
				console.debug('v.225 Check found', cell)
				return true;
			}
		}
	}
	return false;
}

//todo fix
export function getAllMoves(cell) {
	let possibleSquares = []
	let colour = pieces.getPieceColour(cell);
	let beforestate = createFenFromBoardArray();
	for (let i = 1; i <= 8; i++) {
		for (let j = 1; j <= 8; j++) {
			const targetCell = indexToLetter(j) + i;

			if (makeMove(cell, targetCell, { isTest: true })) {
				possibleSquares.push(targetCell)
			}
			createBoardArray(beforestate)
		}
	}
	return possibleSquares;
}

//todo
export function gameEndingStatus(colour) {

	if (global.halfMoveCount >= 100)
		return 'stalemate'; // 50 move rule
	if (createFen().split(' ')[0].replace(/\/|\d+/g, '').toLowerCase() === 'kk')
		return 'stalemate'; // only 2 kings left

	let currentlyCheck = isCheck(colour);
	let noValidMoves = true;

	outer:
	for (let i = 1; i <= 8; i++) {
		for (let j = 1; j <= 8; j++) {
			const startCell = indexToLetter(j) + i;
			if (getPieceClasses(startCell).includes(colour)) {
				const possibleSquares = findAllMoves(startCell);
				for (let k in possibleSquares) {
					let pieceStore;
					if (pieceInCell(possibleSquares[k])) {
						pieceStore = getPieceClasses(possibleSquares[k]);
					}
					movePiece(startCell, possibleSquares[k]);
					if (!isCheck(colour)) noValidMoves = false;
					movePiece(possibleSquares[k], startCell);
					if (pieceStore) addPiece(pieceStore[1], pieceStore[0], possibleSquares[k]);

					if (!noValidMoves) break outer;
				}
			}
		}
	}

	if (noValidMoves) return currentlyCheck ? 'checkmate' : 'stalemate';
	else return false;
}
