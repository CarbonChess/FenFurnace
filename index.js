const { createBoardArray, invertColour, globals } = require('./board');
const { evaluation, materialDifference } = require('./evaluation');
const { isValid, validateMove, getPieceInCell, getPieceColour, pieceInCell, pieceInWay } = require('./validation');
const test = require('./test');
