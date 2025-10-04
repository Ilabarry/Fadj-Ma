import api from './api';

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/api/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/api/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/api/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUser: async () => {
    try {
      const response = await api.get('/api/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/dashboard-stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};