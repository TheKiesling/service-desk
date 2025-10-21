import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ticketService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/tickets?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  create: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  update: async (id, updates) => {
    const response = await api.put(`/tickets/${id}`, updates);
    return response.data;
  },

  addComment: async (ticketId, comment) => {
    const response = await api.post(`/tickets/${ticketId}/comments`, comment);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },
};

export const serviceService = {
  getAll: async () => {
    const response = await api.get('/services');
    return response.data;
  },

  initialize: async () => {
    const response = await api.post('/services/initialize');
    return response.data;
  },
};

export default api;

