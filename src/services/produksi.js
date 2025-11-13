import api from './api';

// *** GET ***

export const getListProduksi = (params = undefined) => {
  const config = params ? { params } : {};
  return api.get('/gap/produksi/list/', config);
};

export const getDetailProduksi = (id) => api.get(`/gap/produksi/detail/${id}/`);

export const deleteProduksi = (id) => api.delete(`/gap/produksi/delete/${id}/`);

// *** POST ***

export const createProduksi = (payload) =>
  api.post(`/gap/produksi/create/`, null, payload);

export const updateProduksi = (id, payload) =>
  api.post(`/gap/produksi/update/${id}/`, null, payload);
