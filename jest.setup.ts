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

// IntersectionObserver mock for framer-motion inView features
if (typeof window !== 'undefined' && !(window as any).IntersectionObserver) {
  (window as any).IntersectionObserver = class {
    constructor(cb: any) { this._cb = cb; }
    _cb: any;
		observe() { /* Immediately invoke callback with intersecting true */ this._cb([{ isIntersecting: true }]); }
		unobserve() { /* noop */ }
		disconnect() { /* noop */ }
		takeRecords() { return []; }
  } as any;
}
