import gameData from '../variables';
import createFenFromBoardArray from '../board/create-fen';
import isCheck from './is-check';
import * as pieces from '../pieces';
import * as validation from './validation';
import { Column, Row, Cell, PieceID } from '../types';

export default function makeMove(startCell: Cell, endCell: Cell, { isTest }: { isTest?: boolean } = {}) {
	// isTest=true: test the move instead of making it

	const piece = pieces.getPieceInCell(startCell);
	const colour = pieces.getColour(startCell);
	if (!colour) return;
	const beforeState = [...gameData.boardArray];
	const events = { pieceCaptured: pieces.inCell(endCell), promoted: false, castled: false };

	//must be same colour as move
	if (colour !== gameData.currentTurn && !isTest) return false;

	//validate castling
	if (piece.toLowerCase() === 'k' && Math.abs(endCell.charCodeAt(0) - startCell.charCodeAt(0)) === 2 && (endCell[1] === startCell[1]) && !isCheck(colour)) {
		const isKingside = endCell.charCodeAt(0) - startCell.charCodeAt(0) > 0;
		const side = isKingside ? 'k' : 'q';
		if (gameData.castling[colour][side]) {
			const file: Column = isKingside ? 'H' : 'A';
			const row: Row = colour === 'w' ? 1 : 8;

			//check if clear squares in between
			const squares: Column[] = isKingside ? ['F', 'G'] : ['B', 'C', 'D'];
			for (let i in squares) {
				if (pieces.inCell(squares[i] + row as Cell)) return false;
			}

			pieces.move(startCell, endCell); //move king
			pieces.move(file + row as Cell, (isKingside ? 'F' : 'D') + row as Cell); //move rook

			//make castling impossible for colour that castled
			gameData.castling[colour] = { k: false, q: false };
			events.castled = true;
		}
		else return false;
	}

	//move if valid
	if (validation.validateMove(startCell, endCell)) pieces.move(startCell, endCell);
	else return false;

	//promotion
	let isBackRank = endCell[1] === (colour === 'w' ? '8' : '1');
	if (piece.toLowerCase() === 'p' && isBackRank) {
		if (!gameData.promotionPiece) {
			gameData.boardArray = beforeState;
			return false;
		} else {
			pieces.del(endCell);
			gameData.promotionPiece = gameData.promotionPiece[colour === 'w' ? 'toUpperCase' : 'toLowerCase']() as PieceID;
			pieces.add(gameData.promotionPiece, endCell);
			gameData.promotionPiece = null;
		}
	}
	//enpassant check (take old enpassant pawn && update enpassant square)
	if (piece.toLowerCase() === 'p' && endCell === gameData.enpassantSquare) {
		const enpassantNumber = colour === 'w' ? +endCell[1] - 1 : +endCell[1] + 1;
		pieces.del(endCell[0] + enpassantNumber as Cell);
		gameData.halfMoveCount = 0;
		events.pieceCaptured = true;
	}
	const deltaLetter = Math.abs(+endCell[1] - +startCell[1]);
	if (piece.toLowerCase() === 'p' && deltaLetter === 2) {
		const enpassantNumber = colour === 'w' ? (+endCell[1] - 1) : (+endCell[1] + 1);
		gameData.enpassantSquare = endCell[0] + enpassantNumber as Cell;
	} else {
		gameData.enpassantSquare = '-';
	}

	//check checker
	if (isCheck(gameData.currentTurn)) {
		gameData.boardArray = beforeState;
		return false;
	}

	//if rook or king make castling invalid
	if (piece.toLowerCase() === 'k') {
		gameData.castling[colour] = { k: false, q: false };
	} else if (piece.toLowerCase() === 'r') {
		const isKingside = startCell[0] === 'H';
		const side = isKingside ? 'k' : 'q';
		gameData.castling[colour][side] = false;
	}

	//update halfMoveCount, currentTurn, moveNumber
	if (colour === 'b') gameData.moveNumber++;

	if (piece.toLowerCase() === 'p' || events.pieceCaptured) gameData.halfMoveCount = 0;
	else gameData.halfMoveCount++;

	//change turn
	gameData.currentTurn = gameData.currentTurn === 'w' ? 'b' : 'w';

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
	if (!isTest) gameData.logList.push(logText);

	//update fen and move list
	let fen = createFenFromBoardArray();
	if (!isTest) gameData.moveList.push(fen);

	return fen;
}
