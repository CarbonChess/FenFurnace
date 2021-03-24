function isValid(boardArray,startCell,endCell) {

	let piece = getPieceInCell(boardArray,startCell);
	let pieceColour = piece === piece.toUppercase ? 'w' : 'b';
	let startNumber = parseInt(startCell[1]);
	let endNumber = parseInt(endCell[1]);
	let deltaNumber = Math.abs(endNumber - startNumber);

	let startLetter = startCell[0];
	let endLetter = endCell[0];
	let deltaLetter = Math.abs(endCell.charCodeAt(0) - startCell.charCodeAt(0));

	switch (piece.toLowercase()) {
		case 'r':
			return deltaLetter === 0 || deltaNumber === 0;
		case 'n':
			return deltaNumber + deltaLetter == 3 && deltaLetter !== 0 && deltaNumber !== 0;
		case 'k':
			const singleMove = deltaLetter <= 1 && deltaNumber <= 1;
			const castleMove = deltaLetter <= 2 && deltaNumber === 0 && (castling[colour[0]].k || castling[colour[0]].q);
			return (singleMove || castleMove);
		case 'b':
			return deltaLetter === deltaNumber;
		case 'q':
			return deltaLetter === 0 || deltaNumber === 0 || deltaLetter === deltaNumber;
		case 'p':
			const takingPiece = deltaLetter === 1 && deltaNumber === 1 && pieceInCell(endCell) && getPieceColour(endCell) === invertColour(colour);
			const pawnMove = deltaNumber === 1 || (deltaNumber === 2 && [2, 7].includes(startNumber));
			const forward = colour === 'white' ? endNumber > startNumber : endNumber < startNumber;
			const validSideways = n => {
				let sidewaysCell = String.fromCharCode(startCell.charCodeAt(0) + n) + startNumber;
				let aboveEnpassantCell = endLetter + (endNumber + (colour === 'black' ? +1 : -1)) === enpassantCell;
				return pieceInCell(sidewaysCell) && aboveEnpassantCell;
			};
			enpassantTaken = enpassantCell && endLetter === enpassantCell[0] ? (validSideways(+1) || validSideways(-1)) : null;
			return (sameLetter || takingPiece || enpassantTaken) && pawnMove && forward;
		default:
			return true;
	}
}
function getPieceInCell(boardArray,cell){
	return boardArray[8 - +cell[0]][cell[1]];
	//first bracket is row, second bracket column
}
