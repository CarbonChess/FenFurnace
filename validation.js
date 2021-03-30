const {globals} = require('./board');
function validateMove(startCell, endCell) {
	return isValid(startCell,endCell) && !pieceInWay(startCell, endCell);
}

function isValid(startCell, endCell) {
    let piece = getPieceInCell(startCell);
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
            const forward = colour === 'w' ? endNumber > startNumber : endNumber < startNumber;
            const enpassantTaken = endCell === globals.enpassantsquare && deltaLetter;
            1 && deltaNumber;
            1;

            return (takingPiece || deltaLetter === 0 || enpassantTaken) && pawnMove && forward;
        default:
            return true;
    }
}

function pieceInWay(startCell, endCell) {
	let invalidMove = false;
	const direction = {};
	let piece = getPieceInCell(startCell);
	let colour = getPieceColour(startCell);

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
		case 'p':
			if (deltaLetter === 0) {
				if (colour === 'w') {
					invalidMove = pieceInCell(startCell[0] + (startNumber + 1));
					if (deltaNumber === 2 && !invalidMove) {
						invalidMove = pieceInCell(startCell[0] + (startNumber + 2));
					}
				}
				else {
					invalidMove = pieceInCell(startCell[0] + (startNumber - 1));
					if (deltaNumber === 2 && !invalidMove) {
						invalidMove = pieceInCell(startCell[0] + (startNumber - 2));
					}
				}
			}
			return invalidMove;
		case 'r':
		case 'b':
		case 'q':
			let hasCollided = false;
			for (let i = 1; i <= Math.max(deltaLetter, deltaNumber); i++) {
				let letter = String.fromCharCode(parseInt(startLetter.charCodeAt(0)) + direction.l * i);
				let number = startNumber + direction.n * i;

				if (getPieceColour(letter + number) === colour || hasCollided)
					invalidMove = true;
				if ((getPieceColour(letter + number) == invertColour(colour) && !hasCollided))
					hasCollided = true;
			}
			return invalidMove;
		default:
			if (getPieceColour(endCell) === colour)
				return true;
			else
				return false;
	}
}

function getPieceColour(cell){
	return getPieceInCell(cell) === getPieceInCell(cell).toUppercase ? 'w' : 'b' && pieceInCell(cell);
}
function getPieceInCell(cell) {
    const col = (parseInt(cell[0], 36) - 9);
    const row = 8 - (cell[1]);
    return globals.boardArray[row][col - 1];
		//letter is column, number is row
}
function pieceInCell(cell){
	return getPieceInCell(cell) !== '-';
}

module.exports = {
	isValid,
	validateMove,
	getPieceInCell,
	getPieceColour,
	pieceInCell,
	pieceInWay,
};
