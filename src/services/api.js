import axios from 'axios';

const API_BASE_URL = 'https://backendcatalogo-production.up.railway.app';
const API_KEY = 'dapps2-2025';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json'
  },
});

export const api = {
  // Fetch all flights
  async getFlights() {
    try {
      const response = await apiClient.get('/vuelos/search');
      return response.data.content;
    } catch (error) {
      console.error('Error fetching flights:', error);
      throw error;
    }
  },

  // Search flights with filters
  async searchFlights(filters) {
    try {
      // Filter out empty values
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await apiClient.get('/vuelos/search', {
        params: cleanFilters
      });
      return response.data;
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  },

  // Get a specific flight by ID
  async getFlightById(id) {
    try {
      const response = await apiClient.get(`/vuelos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching flight:', error);
      throw error;
    }
  }
};
