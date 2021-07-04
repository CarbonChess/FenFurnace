export default class GameData {
	static #castling = { w: { k: true, q: true }, b: { k: true, q: true } };
	static #boardArray = [];
	static #enpassantSquare = null;
	static #moveList = [];
	static #currentTurn = null;
	static #halfMoveCount = 0;
	static #moveNumber = 0;
	static #promotionPiece = null;
	static #logList = [];

	static get castling() { return this.#castling; }
	static set castling(obj) { this.#castling = obj; }

	static get boardArray() { return this.#boardArray; }
	static set boardArray(arr) { this.#boardArray = arr; }

	static get empassantSquare() { return this.#enpassantSquare; }
	static set empassantSquare(val) { this.#enpassantSquare = val; }

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
