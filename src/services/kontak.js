import api from './api';

// *** GET ***

export const getKontakList = (params = {}) =>
  api.get(`/kabar-tani/kontak/list/`, { params });

export const getKontakDetail = (id) =>
  api.get(`/kabar-tani/kontak/detail/${id}/`);

export const deleteKontak = (id) =>
  api.delete(`/kabar-tani/kontak/delete/${id}/`);

export const getPetaniWaList = (params = {}) =>
  api.get(`/petani/list/wa-kontak/`, { params });

// *** POST ***

export const createKontak = (payload) =>
  api.post(`/kabar-tani/kontak/create/`, null, payload);

export const updateKontak = (id, payload) =>
  api.post(`/kabar-tani/kontak/update/${id}/`, null, payload);

export const createKontakFromApi = (payload) =>
  api.post(`/kabar-tani/kontak/create-from-api/`, null, payload);

export const createKontakFromCsv = (payload) =>
  api.postData(`/kabar-tani/kontak/create-upload-csv/`, payload);
