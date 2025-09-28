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
      const response = await apiClient.get('/vuelos/search', {
        params: {
          page: 0,
          size: 100
        }
      });
      console.log(response.data.content);
      return response.data.content;
    } catch (error) {
      console.error('Error fetching flights:', error);
      throw error;
    }
  },

  // Change flight status
  async changeFlightStatus(id, status) {
    try {
      const response = await apiClient.put(`/vuelos/${id}`, {
        estadoVuelo: status
      });
      return response.data;
    } catch (error) {
      console.error('Error changing flight status:', error);
      throw error;
    }
  },

  // Cear nuevo vuelo
  async createFlight(data) {
    try {
      const response = await apiClient.post(`/vuelos`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating flight:', error);
      throw error;
    }
  }

};
