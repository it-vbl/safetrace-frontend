import api from './api';

// *** GET ***

export const getListProduksi = (params = undefined) => {
  const config = params ? { params } : {};
  return api.get('/gap/produksi/list/', config);
};

export const getDetailProduksiKebun = (id) =>
  api.get(`/gap/produksi/detail/kebun/${id}/`);

export const getListProduksiKebun = (id) => {
  return api.get(`/gap/produksi/list/kebun/${id}/`);
};

export const deleteProduksi = (id) => api.delete(`/gap/produksi/delete/${id}/`);

// *** POST ***

export const createProduksi = (payload) =>
  api.post(`/gap/produksi/create/`, null, payload);

export const updateProduksi = (id, payload) =>
  api.post(`/gap/produksi/update/${id}/`, null, payload);

export const downloadListProduksi = (params = {}) => {
  const formattedParams = {
    ...params,
    ...(params.search && {
      search: params.search,
    }),
    ...(params.kelompok && {
      kelompok: params.kelompok,
    }),
    ...(params.tahun && {
      tahun: params.tahun,
    }),
  };

  return api.get(`/gap/produksi/download/`, {
    params: formattedParams,
    responseType: 'blob',
  });
};
