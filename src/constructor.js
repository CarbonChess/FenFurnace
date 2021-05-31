import pieces from './pieces.js';

class Piece {

    constructor({ template = 'none', validWhen } = {}) {
        this.template = template.toLowerCase();
        this.validWhen = validWhen;
    }

    validate(colour, startCell, endCell) {
        const startLetter = startCell[0];
        const endLetter = endCell[0];
        const deltaLetter = Math.abs(endCell.charCodeAt(0) - startCell.charCodeAt(0));
        const startNumber = parseInt(startCell[1]);
        const endNumber = parseInt(endCell[1]);
        const deltaNumber = deltaNumber = Math.abs(endNumber - startNumber);

        switch (this.template) {
            case 'pawn': {
                let invalidMove = false;
                if (deltaLetter !== 0) return !invalidMove;
                if (colour === 'w') {
                    invalidMove = pieces.inCell(startLetter + (startNumber + 1));
                    if (deltaNumber === 2 && !invalidMove) {
                        invalidMove = pieces.inCell(startLetter + (startNumber + 2));
                    }
                }
                else {
                    invalidMove = pieces.inCell(startLetter + (startNumber - 1));
                    if (deltaNumber === 2 && !invalidMove) {
                        invalidMove = pieces.inCell(startLetter + (startNumber - 2));
                    }
                }
                return !invalidMove;
            }
            default: {
                return this.validWhen(deltaLetter, deltaNumber);
            }
        }
    }

}

let pawn = new Piece({ template: 'pawn' });
pawn.validate('white', 'E2', 'E4');
let god = new Piece({ validWhen: () => true });
god.validate('white', 'A1', 'H4');
