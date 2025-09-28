import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.confirm for tests
global.confirm = vi.fn(() => true);

// Mock window.alert for tests
global.alert = vi.fn();

// Mock window.location.reload for tests
delete window.location;
window.location = { reload: vi.fn() };
