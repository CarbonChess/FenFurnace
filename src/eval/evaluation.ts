import materialDifference from './material-diff';

export default function evaluation(): number {
	let whiteEval = 0;
	let blackEval = 0;

	//add material difference to colour
	const material = materialDifference();
	if (material > 0)
		whiteEval += material;
	else
		blackEval += Math.abs(material);

	return whiteEval - blackEval;
}
