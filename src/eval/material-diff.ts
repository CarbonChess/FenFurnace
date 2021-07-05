import gameData from '../variables';

export default function materialDifference(): number {
	let points = { w: 0, b: 0 };

	for (let i in gameData.boardArray) {
		for (let j = 0; j < i.length; j++) {
			const colour = i[j] === i[j].toUpperCase() ? 'w' : 'b';
			const piece = i[j].toLowerCase();
			const pointsIncrease = { p: 1, m: 3, b: 3, r: 5, q: 9 }[piece] ?? 0;
			points[colour] += pointsIncrease;
		}
	}

	return points.w - points.b;
}