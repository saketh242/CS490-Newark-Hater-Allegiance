import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { vi } from "vitest"
import '@testing-library/jest-dom/vitest'
import '@testing-library/jest-dom';

// runs a clean after each test case (e.g. clearing jsdom)

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

afterEach(() => {
  cleanup();
})