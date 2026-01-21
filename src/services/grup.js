import api from './api';

// *** GET ***

export const getGrupKontakList = (params = {}) =>
  api.get(`/kabar-tani/grup-kontak/list/`, { params });

export const getGrupKontakDetail = (id, params = {}) =>
  api.get(`/kabar-tani/grup-kontak/detail/${id}/`, { params });

export const deleteGrupKontak = (id) =>
  api.delete(`/kabar-tani/grup-kontak/delete/${id}/`);

// *** POST ***

export const createGrupKontak = (payload) =>
  api.post(`/kabar-tani/grup-kontak/create/`, null, payload);

export const updateGrupKontak = (id, payload) =>
  api.post(`/kabar-tani/grup-kontak/update/${id}/`, null, payload);
