export type Colour = 'w' | 'b';

export type Board = string[];

export type Cell = string | `${'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'}${'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'}`;

export type Piece = 'pawn' | 'rook' | 'bishop' | 'knight' | 'queen' | 'king';
export type PieceID = string | '' | 'R' | 'B' | 'N' | 'Q' | 'K' | '-';

export type EndingStatus = false | 'stalemate' | 'checkmate';
