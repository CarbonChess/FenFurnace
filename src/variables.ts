import { Colour, Cell, Board, PieceID, Fen } from './types';

export default class GameData {
	static castling = { w: { k: true, q: true }, b: { k: true, q: true } };
	static boardArray: Board = [];
	static enpassantSquare: Cell | '-' = '-';
	static moveList: Fen[] = [];
	static logList: string[] = [];
	static currentTurn: Colour = 'w';
	static halfMoveCount: number = 0;
	static moveNumber: number = 0;
	static promotionPiece: PieceID | null = null;
}
