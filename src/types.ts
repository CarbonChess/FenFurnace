export type Colour = 'w' | 'b';

export type Board = string[];

export type Column = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
export type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Cell = `${Column}${Row}`;

export type Piece = 'pawn' | 'rook' | 'bishop' | 'knight' | 'queen' | 'king';
export type PieceID = 'R' | 'r' | 'B' | 'b' | 'N' | 'n' | 'Q' | 'q' | 'K' | 'k' | '-';

export type EndingStatus = false | 'stalemate' | 'checkmate';

export type CastleString = `${'K' | ''}${'Q' | ''}${'k' | ''}${'q' | ''}`;

export interface FenParts {
    fen: string;
    currentTurn: Colour;
    castling: CastleString;
    enpassantSquare: Cell;
    halfMoveCount: number;
    moveNumber: number;
};
