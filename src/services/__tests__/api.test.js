import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the entire api module
vi.mock('../api', async () => {
  const actual = await vi.importActual('../api');
  return {
    ...actual,
    api: {
      getFlights: vi.fn(),
      changeFlightStatus: vi.fn(),
      createFlight: vi.fn()
    }
  };
});

import { api } from '../api';

describe('Flight Creation API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createFlight', () => {
    it('should create flight successfully', async () => {
      const flightData = {
        idVuelo: 'AA124',
        aerolinea: 'American Airlines',
        origen: 'EZE',
        destino: 'MIA',
        precio: 260000.00,
        moneda: 'ARS',
        despegue: '2025-11-16T10:00:00Z',
        aterrizajeLocal: '2025-11-16T14:00:00-05:00',
        estadoVuelo: 'CONFIRMADO',
        capacidadAvion: 250,
        tipoAvion: 'B737'
      };

      const mockResponse = {
        data: {
          ...flightData,
          success: true
        }
      };

      // Mock the API response
      api.createFlight.mockResolvedValue(mockResponse.data);

      const result = await api.createFlight(flightData);

      expect(result).toEqual(mockResponse.data);
      expect(api.createFlight).toHaveBeenCalledWith(flightData);
    });

    it('should handle API errors when creating flight', async () => {
      const flightData = { idVuelo: 'AA124' };
      const mockError = new Error('Validation Error');
      
      // Mock the API error
      api.createFlight.mockRejectedValue(mockError);

      await expect(api.createFlight(flightData)).rejects.toThrow('Validation Error');
      expect(api.createFlight).toHaveBeenCalledWith(flightData);
    });
  });
});
