import gameData from '../variables';
import { invertColour } from '../helpers';
import * as pieces from '../pieces';
import { Column, Row, Cell, Colour } from '../types';

type Validator = (deltaLetter: number, deltaNumber: number) => boolean;

class Piece {
    template: string;
    validWhen: Validator | undefined;
    constructor({ template = 'none', validWhen }: { template?: string, validWhen?: Validator } = {}) {
        this.template = template.toLowerCase();
        this.validWhen = validWhen;
    }

    validate(colour: Colour, startCell: Cell, endCell: Cell): boolean {
        const startLetter = startCell[0] as Column;
        const endLetter = endCell[0] as Column;
        const deltaLetter = Math.abs(endCell.charCodeAt(0) - startCell.charCodeAt(0));
        const startNumber = +startCell[1] as Row;
        const endNumber = +endCell[1] as Row;
        const deltaNumber = Math.abs(endNumber - startNumber);

        if (this.validWhen?.(deltaLetter, deltaNumber)) return true;

        let invalidMove = false;
        switch (this.template) {
            case 'pawn': {
                if (deltaLetter === 0) {
                    const direction = colour === 'w' ? +1 : -1;
                    invalidMove = pieces.inCell(startLetter + ((startNumber + deltaNumber) * direction) as Cell);
                }
                if (!invalidMove) {
                    const takingPiece = deltaLetter === 1 && deltaNumber === 1 && pieces.inCell(endCell) && pieces.getColour(endCell) === invertColour(colour);
                    const pawnMove = deltaNumber === 1 || (deltaNumber === 2 && [2, 7].includes(startNumber));
                    const forward = colour === 'w' ? endNumber > startNumber : endNumber < startNumber;
                    const enpassantTaken = endCell === gameData.enpassantSquare && deltaLetter === 1 && deltaNumber === 1;
                    return (takingPiece || deltaLetter === 0 || enpassantTaken) && pawnMove && forward;
                }
                return !invalidMove;
            }
        }
        return false;
    }

}

let pawn = new Piece({ template: 'pawn' });
pawn.validate('w', 'E2', 'E4');
let god = new Piece({ validWhen: () => true });
god.validate('w', 'A1', 'H4');
