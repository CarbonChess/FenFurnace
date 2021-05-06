import initialise from './src/helpers/default-fen.js';
import * as validation from './src/validation.js';

export default function test() {
	initialise();
	validation.makeMove('F2', 'F3');
	validation.makeMove('E7', 'E5');
	validation.makeMove('E2', 'E4');
	console.log(global.boardArray);
	console.log(validation.getAllMoves('D8'));
}
