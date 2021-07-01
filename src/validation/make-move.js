import createFenFromBoardArray from './board/create-fen.js';
import isCheck from './validation/is-check.js';
import * as pieces from './pieces.js';

export default function makeMove(startCell, endCell, { isTest } = {}) {
	// isTest=true: test the move instead of making it

	const piece = pieces.getPieceInCell(startCell);
	const colour = pieces.getColour(startCell);
	const beforeState = [...global.boardArray];
	const events = { pieceCaptured: pieces.inCell(endCell), promoted: false, castled: false };

	//must be same colour as move
	if (colour !== global.currentTurn && !isTest) {
		console.log('Failed to move', startCell, '->', endCell);
		return false;
	}

	//validate castling
	if (piece.toLowerCase() === 'k' && Math.abs(endCell.charCodeAt(0) - startCell.charCodeAt(0)) === 2 && (endCell[1] === startCell[1]) && !isCheck(colour)) {
		const isKingside = endCell.charCodeAt(0) - startCell.charCodeAt(0) > 0;
		const side = isKingside ? 'k' : 'q';
		if (global.castling[colour][side]) {
			const file = isKingside ? 'H' : 'A';
			const row = colour === 'w' ? '1' : '8';

			//check if clear squares in between
			const squares = isKingside ? ['F', 'G'] : ['B', 'C', 'D'];
			for (let i in squares) {
				if (pieces.inCell(squares[i] + row)) return false;
			}

			pieces.move(startCell, endCell); //move king
			pieces.move(file + row, (isKingside ? 'F' : 'D') + row); //move rook

			//make castling impossible for colour that castled
			global.castling[colour] = { k: false, q: false };
			events.castled = true;
		}
		else return false;
	}

	//move if valid
	if (validateMove(startCell, endCell)) pieces.move(startCell, endCell);
	else return false;

	//promotion
	let isBackRank = endCell[1] === (colour === 'w' ? '8' : '1');
	if (piece.toLowerCase() === 'p' && isBackRank) {
		if (!global.promotionPiece) {
			console.error('NO PROMOTION PIECE FOUND');
			global.boardArray = beforeState;
			return false;
		} else {
			pieces.del(endCell);
			global.promotionPiece = global.promotionPiece[colour === 'w' ? 'toUpperCase' : 'toLowerCase']();
			pieces.add(global.promotionPiece, endCell);
			global.promotionPiece = null;
		}
	}
	//enpassant check (take old enpassant pawn && update enpassant square)
	if (piece.toLowerCase() === 'p' && endCell === global.enpassantSquare) {
		const enpassantNumber = colour === 'w' ? (+endCell[1] - 1) : (+endCell[1] + 1)
		pieces.del(endCell[0] + enpassantNumber);
		global.halfMoveCount = 0;
		events.pieceCaptured = true;
	}
	const deltaLetter = Math.abs(+endCell[1] - +startCell[1]);
	if (piece.toLowerCase() === 'p' && deltaLetter === 2) {
		const enpassantNumber = colour === 'w' ? (+endCell[1] - 1) : (+endCell[1] + 1);
		global.enpassantSquare = endCell[0] + enpassantNumber;
	} else {
		global.enpassantSquare = '-';
	}

	//check checker
	if (isCheck(global.currentTurn)) {
		global.boardArray = beforeState;
		return false;
	}

	//if rook or king make castling invalid
	if (piece.toLowerCase() === 'k') {
		global.castling[colour] = { k: false, q: false };
	} else if (piece.toLowerCase() === 'r') {
		const isKingside = startCell[0] === 'H';
		const side = isKingside ? 'k' : 'q';
		global.castling[colour][side] = false;
	}

	//update halfMoveCount, currentTurn, moveNumber
	if (colour === 'b') global.moveNumber++;

	if (piece.toLowerCase() === 'p' || events.pieceCaptured) global.halfMoveCount = 0;
	else global.halfMoveCount++;

	//change turn
	global.currentTurn = global.currentTurn === 'w' ? 'b' : 'w';

	//add to log
	let logText = '';
	if (events.castled === true) {
		logText += endCell.charCodeAt(0) - startCell.charCodeAt(0) > 0 ? 'O-O' : 'O-O-O';
	} else {
		if (piece.toLowerCase() === 'p' && events.pieceCaptured) logText += startCell[0].toLowerCase();
		else if (piece.toLowerCase() !== 'p') logText += piece.toUpperCase();
		if (events.pieceCaptured) logText += 'x';
		logText += endCell;
		if (events.promoted) logText += '=' + pieces.getPieceInCell(endCell).toUpperCase();
	}
	if (!isTest) global.logList.push(logText);

	//update fen and move list
	let fen = createFenFromBoardArray();
	if (!isTest) global.moveList.push(fen);

	return fen;
}
