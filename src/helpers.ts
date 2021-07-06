import { Cell, Colour } from './types';

export function indexToLetter(n: number): string {
	// 1-indexed; 0x40=uppercase, 0x60=lowercase
	return String.fromCharCode(n + 0x40);
}

export function invertColour(colour: Colour): Colour {
	return colour === 'b' ? 'w' : 'b';
}

export function coordsToCell(x: number, y: number): Cell {
	return indexToLetter(x) + y as Cell;
}
