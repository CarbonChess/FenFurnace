export default function evaluation() {
	let whiteEval = 0;
	let blackEval = 0;

	//add material difference to colour
	let material = materialDifference(global.boardArray);
	if (material > 0)
		whiteEval += material;
	else
		blackEval += Maths.abs(material);

	return whiteEval - blackEval;
}
