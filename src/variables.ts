import { Colour, Board } from './types';

export default class GameData {
	static #castling = { w: { k: true, q: true }, b: { k: true, q: true } };
	static #boardArray: Board = [];
	static #enpassantSquare: string | null = null;
	static #moveList: string[] = [];
	static #currentTurn: Colour = 'w';
	static #halfMoveCount: number = 0;
	static #moveNumber: number = 0;
	static #promotionPiece: string | null = null;
	static #logList: string[] = [];

	static get castling() { return this.#castling; }
	static set castling(obj) { this.#castling = obj; }

	static get boardArray() { return this.#boardArray; }
	static set boardArray(arr) { this.#boardArray = arr; }

	static get enpassantSquare() { return this.#enpassantSquare; }
	static set enpassantSquare(val) { this.#enpassantSquare = val; }

	static get moveList() { return this.#moveList; }
	static set moveList(arr) { this.#moveList = arr; }

	static get currentTurn() { return this.#currentTurn; }
	static set currentTurn(val) { this.#currentTurn = val; }

	static get halfMoveCount() { return this.#halfMoveCount; }
	static set halfMoveCount(val) { this.#halfMoveCount = val; }

	static get moveNumber() { return this.#moveNumber; }
	static set moveNumber(val) { this.#moveNumber = val; }

	static get promotionPiece() { return this.#promotionPiece; }
	static set promotionPiece(val) { this.#promotionPiece = val; }

	static get logList() { return this.#logList; }
	static set logList(arr) { this.#logList = arr; }
}
