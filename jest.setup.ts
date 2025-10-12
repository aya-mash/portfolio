import '@testing-library/jest-dom';

if (typeof window !== 'undefined' && !window.matchMedia) {
	// Basic matchMedia mock for tests
	window.matchMedia = (query: string) => ({
		matches: query.includes('prefers-color-scheme: light') ? false : true,
		media: query,
		onchange: null,
		addListener: () => {}, // deprecated
		removeListener: () => {}, // deprecated
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false
	}) as any;
}
