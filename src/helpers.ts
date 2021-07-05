export function indexToLetter(n: number): string {
	// 1-indexed; 0x40=uppercase, 0x60=lowercase
	return String.fromCharCode(n + 0x40);
}

export function invertColour(colour: 'w' | 'b'): 'w' | 'b' {
	return colour === 'b' ? 'w' : 'b';
}
