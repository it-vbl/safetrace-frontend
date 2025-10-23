import api from './api';

// *** GET ***

export const getPesanList = (params = {}) =>
  api.get(`/kabar-tani/kirim-pesan/list/`, { params });

export const getPesanDetail = (id) =>
  api.get(`/kabar-tani/kirim-pesan/detail/${id}/`);

export const deletePesan = (id) =>
  api.delete(`/kabar-tani/kirim-pesan/delete/${id}/`);

// *** POST ***

export const createPesan = (payload) =>
  api.post(`/kabar-tani/kirim-pesan/create/`, null, payload);

export const updatePesan = (id, payload) =>
  api.post(`/kabar-tani/kirim-pesan/update/${id}/`, null, payload);
