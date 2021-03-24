function createBoardArray(fenString) {
	return fenString.split('')[0].split('/');
}

function evaluation(boardArray) {
	let whiteEval = 0;
	let blackEval = 0;

	//add material difference to colour
	let material = materialDifference(boardArray);
	if (material > 0)
		whiteEval += material;
	else
		blackEval += Maths.abs(material);

	return whiteEval - blackEval;
}

function materialDifference(boardArray) {
	let points = { w: 0, b: 0 };

	for (let i in boardArray) {
		for (let j = 0; j < i.length; i++) {
			const colour = i[j] === i[j].toUpperCase() ? w : b;
			let c = i[j];
			switch (c.toLowerCase()) {
				case 'p': points[colour] += 1; break;
				case 'n': points[colour] += 3; break;
				case 'b': points[colour] += 3; break;
				case 'r': points[colour] += 5; break;
				case 'q': points[colour] += 9; break;
			}
		}
	}
	return points.w - points.b;
}
