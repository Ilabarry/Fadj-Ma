// services/authService.js
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
      
      // Sauvegarder le token si présent
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Nettoyer le localStorage
      localStorage.removeItem('token');
      
      return response.data;
    } catch (error) {
      // Nettoyer même en cas d'erreur
      localStorage.removeItem('token');
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