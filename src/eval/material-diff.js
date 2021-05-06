export default function materialDifference() {
	let points = { w: 0, b: 0 };

	for (let i in global.boardArray) {
		for (let j = 0; j < i.length; i++) {
			const colour = i[j] === i[j].toUpperCase() ? 'w' : 'b';
			const piece = i[j].toLowerCase();
			let pointsIncrease = { p: 1, m: 3, b: 3, r: 5, q: 9 }[piece];
			points[colour] += pointsIncrease;
		}
	}

	return points.w - points.b;
}
