import apiClient from './client';

export const coursesApi = {
  list: async (params?: { page?: number; subjectId?: string; status?: string }) => {
    const res = await apiClient.get('/courses', { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get(`/courses/${id}`);
    return res.data;
  },

  create: async (data: { title: string; subjectId?: string; description?: string }) => {
    const res = await apiClient.post('/courses', data);
    return res.data;
  },

  submit: async (id: string) => {
    const res = await apiClient.post(`/courses/${id}/submit`);
    return res.data;
  },

  approve: async (id: string) => {
    const res = await apiClient.post(`/courses/${id}/approve`);
    return res.data;
  },

  reject: async (id: string, reason: string) => {
    const res = await apiClient.post(`/courses/${id}/reject`, { reason });
    return res.data;
  },
};
