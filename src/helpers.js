export function indexToLetter(n) {
	// 1-indexed; 0x40=uppercase, 0x60=lowercase
	return String.fromCharCode(n + 0x40);
}

export function invertColour(colour) {
	return colour === 'b' ? 'w' : 'b';
}
