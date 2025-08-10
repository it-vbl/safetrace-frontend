import api from './api';

export const getUsers = (params) => api.get('/accounts/user/list/?' + params);
export const createUser = (userData) => api.post('/accounts/user/create/',null, userData);
export const updateUser = (userData) => api.post('/accounts/user/update/',null, userData);

