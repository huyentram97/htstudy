import apiClient from './client';

export const gamificationApi = {
  getPoints: async () => {
    const res = await apiClient.get('/gamification/points');
    return res.data;
  },

  getTransactions: async (params?: { page?: number; type?: string }) => {
    const res = await apiClient.get('/gamification/transactions', { params });
    return res.data;
  },

  unlock: async (entityType: string, entityId: string, pointCost: number) => {
    const res = await apiClient.post('/gamification/unlock', { entityType, entityId, pointCost });
    return res.data;
  },

  getLeaderboard: async (period?: string) => {
    const res = await apiClient.get('/gamification/leaderboard', { params: { period } });
    return res.data;
  },

  getBadges: async () => {
    const res = await apiClient.get('/gamification/badges');
    return res.data;
  },

  getMissions: async () => {
    const res = await apiClient.get('/gamification/missions');
    return res.data;
  },
};
