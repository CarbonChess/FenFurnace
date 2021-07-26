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

export function toUpperCase<T extends string>(str: T): Uppercase<T> {
	return str.toUpperCase() as Uppercase<T>;
}

export function toLowerCase<T extends string>(str: T): Lowercase<T> {
	return str.toLowerCase() as Lowercase<T>;
}
