import api from './api';

export const getUsers = (params) => api.get('/accounts/user/list/?' + params);
export const createUser = (userData) =>
  api.post('/accounts/user/create/', null, userData);
export const updateUser = (userData) =>
  api.post('/accounts/user/update/', null, userData);
export const changePassword = (passwordData) =>
  api.post('/accounts/change-password/', null, passwordData);

export const getUserDetail = (userId) =>
  api.get(`/accounts/user/detail/${userId}/`);

export const updateUserProfile = (payload) =>
  api.post('/accounts/user/profile/update/', null, payload);
export const getUserProfile = () => api.get('/accounts/user/profile/');
export const deleteUser = (userId) =>
  api.delete(`/accounts/user/delete/${userId}/`);
