[![Latest version](https://img.shields.io/github/v/release/CarbonChess/FenFurnace?label=latest%20version&style=flat-square)](https://github.com/CarbonChess/FenFurnace/releases)
[![Last updated](https://img.shields.io/github/release-date/CarbonChess/FenFurnace?label=updated&style=flat-square)](https://github.com/CarbonChess/FenFurnace/releases)
[![npm downloads](https://img.shields.io/npm/dt/fenfurnace?logo=npm)](https://www.npmjs.com/package/fenfurnace)

# FenFurnace

A tool for validating chess piece movement generated from a FEN position.

## Install

FenFurnace is available [on npm](https://www.npmjs.org/package/fenfurnace):

`npm install fenfurnace`

## API

### Functions

- `setupBoard()`
  - Initialises a new chess game with the default FEN and move data.
- `createBoard(fen)`
  - Creates a board from a given fen string.
- `validation.validateMove(startCell, endCell)`
  - Check that a given move is valid; calls `isValid()` and `pieceInWay()`.
- `validation.isValid(startCell, endCell)`
  - Check that a given move obeys the rules of chess.
- `validation.pieceInWay(startCell, endCell)`
  - Check if there are any pieces between two cells.
- `makeMove(startCell, endCell, completeMove)`
  - Attempt to move a piece; returns `false` if invalid.
    If `completeMove` is `false`, no move will actually be made; instead the move will just be tested for validity.
- `undoMove()`
  - Undoes and returns the last move.
- `findAllMoves(cell)`
  - Return an array of all valid moves from a given cell.
- `isCheck(colourId)`
  - Checks whether a given colour (`'w'` or `'b'`) is currently in check.
- `gameEndingStatus(colourId)`
  - Check the game has concluded and the result of the game (`'checkmate'`, `'stalemate'`, or `false`) for a given colour (`'w'` or `'b'`).
- `points()`
  - Return an object containing points scores for white (`w`) and black (`b`).

### Variables

The following values are given in import `gameData`:
- `castling`: `{ w: { k, q }, b: { k, q } }` (each boolean)
- `boardArray` (array)
- `enpassantSquare` (string or `-`)
- `moveList` (array)
- `logList` (array)
- `currentTurn` (`null` or `w` or `b`)
- `halfMoveCount` (int)
- `moveNumber` (int)
- `promotionPiece` (char)

## Build

Bundle local code for browser use with `npm run compile`.

Functions are available under `window.fenFuncs`.
