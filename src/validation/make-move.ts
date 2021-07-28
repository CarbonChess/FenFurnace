import gameData from '../variables';
import createFenFromBoardArray from '../board/create-fen';
import isCheck from './is-check';
import * as pieces from '../pieces';
import * as validation from './validation';
import { Column, Row, Cell, Fen } from '../types';
import { invertColour, toLowerCase, toUpperCase } from '../helpers';

export default function makeMove(startCell: Cell, endCell: Cell, completeMove: boolean = true): Fen | false {

	const piece = pieces.getPieceInCell(startCell);
	const colour = pieces.getColour(startCell);
	const startLetter = startCell[0] as Column;
	const startNumber = +startCell[1] as Row;
	const endLetter = endCell[0] as Column;
	const endNumber = +endCell[1] as Row;
	const beforeState = [...gameData.boardArray];
	const events = { pieceCaptured: pieces.inCell(endCell), promoted: false, castled: false };

	//must be same colour as move
	if (colour !== gameData.currentTurn) {
		if (!completeMove) console.log('Failed to move', startCell, '->', endCell);
		return false;
	}

	//validate castling
	const colDelta = endCell.charCodeAt(0) - startCell.charCodeAt(0);
	if (piece.toLowerCase() === 'k' && Math.abs(colDelta) === 2 && (endLetter === startLetter) && !isCheck(colour)) {
		const isKingside = colDelta > 0;
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
	const isBackRank = endNumber === (colour === 'w' ? 8 : 1);
	if (piece.toLowerCase() === 'p' && isBackRank) {
		if (!gameData.promotionPiece) {
			console.error('No promotion piece found.');
			gameData.boardArray = beforeState;
			return false;
		} else {
			pieces.del(endCell);
			gameData.promotionPiece = colour === 'w' ? toUpperCase(gameData.promotionPiece) : toLowerCase(gameData.promotionPiece);
			pieces.add(gameData.promotionPiece, endCell);
			gameData.promotionPiece = null;
		}
	}
	//enpassant check (take old enpassant pawn && update enpassant square)
	const enpassantNumber = endNumber + (colour === 'w' ? -1 : +1) as Row;
	if (piece.toLowerCase() === 'p' && endCell === gameData.enpassantSquare) {
		pieces.del(endLetter + enpassantNumber as Cell);
		gameData.halfMoveCount = 0;
		events.pieceCaptured = true;
	}
	const deltaLetter = Math.abs(endNumber - startNumber);
	if (piece.toLowerCase() === 'p' && deltaLetter === 2) {
		gameData.enpassantSquare = endLetter + enpassantNumber as Cell;
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
		const isKingside = startLetter === 'H';
		const side = isKingside ? 'k' : 'q';
		gameData.castling[colour][side] = false;
	}

	//update halfMoveCount, currentTurn, moveNumber
	if (colour === 'b') gameData.moveNumber++;

	if (piece.toLowerCase() === 'p' || events.pieceCaptured) gameData.halfMoveCount = 0;
	else gameData.halfMoveCount++;

	//change turn
	gameData.currentTurn = invertColour(gameData.currentTurn);

	//add to log
	let logText = '';
	if (events.castled) {
		logText += colDelta > 0 ? 'O-O' : 'O-O-O';
	} else {
		if (piece.toLowerCase() === 'p' && events.pieceCaptured) logText += startCell[0].toLowerCase();
		else if (piece.toLowerCase() !== 'p') logText += piece.toUpperCase();
		if (events.pieceCaptured) logText += 'x';
		logText += endCell;
		if (events.promoted) logText += '=' + pieces.getPieceInCell(endCell).toUpperCase();
	}
	if (!completeMove) gameData.logList.push(logText);

	//update fen and move list
	const fen = createFenFromBoardArray();
	if (!completeMove) gameData.moveList.push(fen);

	return fen;
}
