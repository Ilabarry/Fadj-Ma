// services/medicamentService.js
import api from './api';

export const medicamentService = {
  // Récupérer tous les médicaments
  getAll: async () => {
    try {
      const response = await api.get('/api/medicaments');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Créer un nouveau médicament
  create: async (formData) => {
    try {
      const response = await api.post('/api/medicaments', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer un médicament par ID
  getById: async (id) => {
    try {
      const response = await api.get(`/api/medicaments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mettre à jour un médicament
  update: async (id, formData) => {
    try {
      const response = await api.post(`/api/medicaments/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Supprimer un médicament
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/medicaments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};