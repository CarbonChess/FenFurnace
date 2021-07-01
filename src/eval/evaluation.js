export default function evaluation() {
	let whiteEval = 0;
	let blackEval = 0;

	//add material difference to colour
	const material = materialDifference(global.boardArray);
	if (material > 0)
		whiteEval += material;
	else
		blackEval += Maths.abs(material);

	return whiteEval - blackEval;
}
