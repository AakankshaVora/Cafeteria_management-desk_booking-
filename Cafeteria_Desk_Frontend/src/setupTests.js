import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfill window.matchMedia
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
});

// Polyfill ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock axios globally
vi.mock('axios', () => {
    return {
        default: {
            get: vi.fn(() => Promise.resolve({ data: {} })),
            post: vi.fn(() => Promise.resolve({ data: {} })),
            put: vi.fn(() => Promise.resolve({ data: {} })),
            delete: vi.fn(() => Promise.resolve({ data: {} })),
            create: vi.fn().mockReturnThis(),
            interceptors: {
                request: { use: vi.fn(), eject: vi.fn() },
                response: { use: vi.fn(), eject: vi.fn() }
            },
            defaults: { headers: { common: {} } }
        }
    };
});
