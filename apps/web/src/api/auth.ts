import apiClient from './client';

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },

  register: async (data: { username: string; email: string; fullName: string; password: string }) => {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  logout: async () => {
    const res = await apiClient.post('/auth/logout');
    localStorage.removeItem('token');
    return res.data;
  },

  healthCheck: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },
};
