import gameData from './variables';

export default function points(): { w: number, b: number } {
	let points = { w: 0, b: 0 };

	for (let row in gameData.boardArray) {
		for (let cell in row.split('')) {
			const colour = cell === cell.toUpperCase() ? 'w' : 'b';
			const piece = cell.toLowerCase();
			const pointsIncrease = { p: 1, m: 3, b: 3, r: 5, q: 9 }[piece] ?? 0;
			points[colour] += pointsIncrease;
		}
	}

	return points;
}
