import api from './api';

export const login = (payload) => api.post(`/accounts/login/`, null, payload, null, null, false);

export const refreshToken = (payload) => api.post(`/accounts/token/refresh/`, null, payload);
