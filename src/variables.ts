import { Colour, Board } from './types';

export default class GameData {
	static castling = { w: { k: true, q: true }, b: { k: true, q: true } };
	static boardArray: Board = [];
	static enpassantSquare: string | null = null;
	static moveList: string[] = [];
	static currentTurn: Colour = 'w';
	static halfMoveCount: number = 0;
	static moveNumber: number = 0;
	static promotionPiece: string | null = null;
	static logList: string[] = [];
}
