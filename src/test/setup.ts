// import '@testing-library/jest-dom/vitest';
import '@testing-library/jest-dom'

// import matchers from '@testing-library/jest-dom/matchers';
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// Run cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup()
})

// jsdom doesn't implement PointerEvent capture APIs that Radix Select / Dialog rely on.
if (typeof Element !== 'undefined') {
	if (!Element.prototype.hasPointerCapture) {
		Element.prototype.hasPointerCapture = () => false
	}
	if (!Element.prototype.setPointerCapture) {
		Element.prototype.setPointerCapture = () => {}
	}
	if (!Element.prototype.releasePointerCapture) {
		Element.prototype.releasePointerCapture = () => {}
	}
	if (!Element.prototype.scrollIntoView) {
		Element.prototype.scrollIntoView = () => {}
	}
}

// jsdom doesn't implement ResizeObserver, which Radix Tooltip / cmdk rely on.
if (typeof globalThis.ResizeObserver === 'undefined') {
	globalThis.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	} as unknown as typeof ResizeObserver
}
