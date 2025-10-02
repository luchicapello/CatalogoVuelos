import '@testing-library/jest-dom';
import { vi } from 'vitest';
// prueba
// Mock window.confirm for tests
globalThis.confirm = vi.fn(() => true);

// Mock window.alert for tests
globalThis.alert = vi.fn();

// Mock window.location.reload for tests
delete window.location;
window.location = { reload: vi.fn() };
