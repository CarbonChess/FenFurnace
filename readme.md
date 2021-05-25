# FenFurnace

A tool for validating chess piece movement generated from a FEN position.

For implementation in [CarbonChess](https://github.com/CarbonChess).

## Functions

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
- `validation.makeMove(startCell, endCell)`
  - Attempt to move a piece; returns `false` if invalid.
- `undoMove()`
  - Undoes and returns the last move.
- `findAllMoves(cell)`
  - Return an array of all valid moves from a given cell.
- `isCheck(colourId)`
  - Checks whether a given colour (`'w'` or `'b'`) is currently in check.
- `gameEndingStatus(colourId)`
  - Check the game has concluded and the result of the game (`'checkmate'`, `'stalemate'`, or `false`) for a given colour (`'w'` or `'b'`).
