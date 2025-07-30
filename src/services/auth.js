import api from './api';

export const login = (payload) => api.post(`/accounts/login/`, null, payload, null, null, false);

export const refreshToken = (payload) => api.post(`/accounts/token/refresh/`, null, payload);

export const forgotPassword = (payload) => api.post(`/accounts/forgot-password/`, null, payload);

export const forgotPasswordVerifyOTP = (payload) => api.post(`/accounts/verify-otp/`, null, payload);

export const forgotPasswordReset = (payload) => api.post(`/accounts/reset-password-confirm/`, null, payload);
