import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Custom render function that includes providers
export function renderWithRouter(ui, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);
  
  return render(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    ),
  });
}

// Mock API responses for testing
export const mockFlights = [
  {
    id: 1,
    idVuelo: 'IB6800',
    aerolinea: 'Iberia',
    origen: 'MAD',
    destino: 'EZE',
    precio: 320000.00,
    moneda: 'ARS',
    despegue: '2025-10-29T23:00:00Z',
    aterrizajeLocal: '2025-10-29T12:00:00-03:00',
    estadoVuelo: 'EN_HORA',
    capacidadAvion: 180,
    tipoAvion: 'B737'
  },
  {
    id: 2,
    idVuelo: 'AA1234',
    aerolinea: 'American Airlines',
    origen: 'EZE',
    destino: 'MIA',
    precio: 250000.00,
    moneda: 'ARS',
    despegue: '2025-11-15T10:00:00Z',
    aterrizajeLocal: '2025-11-15T14:00:00-05:00',
    estadoVuelo: 'CONFIRMADO',
    capacidadAvion: 250,
    tipoAvion: 'B737'
  },
  {
    id: 3,
    idVuelo: 'DL5678',
    aerolinea: 'Delta Air Lines',
    origen: 'MIA',
    destino: 'ATL',
    precio: 180000.00,
    moneda: 'ARS',
    despegue: '2025-11-16T08:00:00Z',
    aterrizajeLocal: '2025-11-16T10:30:00-05:00',
    estadoVuelo: 'DEMORADO',
    capacidadAvion: 180,
    tipoAvion: 'A320'
  }
];

// Mock API functions
export const mockApi = {
  getFlights: vi.fn(() => Promise.resolve(mockFlights)),
  changeFlightStatus: vi.fn(() => Promise.resolve({ success: true })),
  createFlight: vi.fn(() => Promise.resolve({ id: 4, success: true }))
};
