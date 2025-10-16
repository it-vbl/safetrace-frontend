import api from './api';

// *** GET ***

export const getDeviceList = (params = {}) =>
  api.get(`/kabar-tani/device/list/`, { params });

export const getDeviceDetail = (id) => api.get(`/kabar-tani/device/detail/${id}/`);

export const deleteDevice = (id) => api.delete(`/kabar-tani/device/delete/${id}/`);

// *** POST ***

export const createDevice = (payload) =>
  api.post(`/kabar-tani/device/create/`, null, payload);

export const updateDevice = (id, payload) =>
  api.post(`/kabar-tani/device/update/${id}/`, null, payload);