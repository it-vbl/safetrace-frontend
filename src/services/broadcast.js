import api from './api';

// *** GET ***

export const getBroadcastList = (params = {}) =>
  api.get(`/kabar-tani/boardcast/list/`, { params });

export const getBroadcastKontakList = (id) =>
  api.get(`/kabar-tani/boardcast/kontak/list/${id}/`);

export const getBroadcastDetail = (id) =>
  api.get(`/kabar-tani/boardcast/detail/${id}/`);

export const deleteBroadcast = (id) =>
  api.delete(`/kabar-tani/boardcast/delete/${id}/`);

// *** POST ***

export const createBroadcast = (payload) =>
  api.post(`/kabar-tani/boardcast/create/`, null, payload);

export const updateBroadcast = (id, payload) =>
  api.post(`/kabar-tani/boardcast/update/${id}/`, null, payload);
