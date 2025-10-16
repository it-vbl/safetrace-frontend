import api from './api';

export const login = (payload) =>
  api.post(`/accounts/login/`, null, payload, null, null, false);

export const refreshToken = (payload) =>
  api.post(`/accounts/token/refresh/`, null, payload);

export const forgotPassword = (payload) =>
  api.post(`/accounts/forgot-password/`, null, payload);

export const forgotPasswordVerifyOTP = (payload) =>
  api.post(`/accounts/verify-otp/`, null, payload);

export const forgotPasswordReset = (payload) =>
  api.post(`/accounts/reset-password-confirm/`, null, payload);

export const logout = (payload) => api.post(`/accounts/logout/`, null, payload);

export const changePassword = (passwordData) =>
  api.post('/accounts/change-password/', null, passwordData);
