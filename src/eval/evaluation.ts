import gameData from '../variables.js';

export default function evaluation() {
	let whiteEval = 0;
	let blackEval = 0;

	//add material difference to colour
	const material = materialDifference(gameData.boardArray);
	if (material > 0)
		whiteEval += material;
	else
		blackEval += Maths.abs(material);

	return whiteEval - blackEval;
}
