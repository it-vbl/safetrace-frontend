import api from './api';

// *** GET ***

export const getListPenjualan = (params = {}) => {
  const formattedParams = {
    ...params,
    ...(params.kelompok && {
      kelompok: params.kelompok,
    }),
    ...(params.pabrik && {
      pabrik: params.pabrik,
    }),
    ...(params.start_date && {
      start_date: params.start_date,
    }),
    ...(params.end_date && {
      end_date: params.end_date,
    }),
    ...(params.search && {
      search: params.search,
    }),
  };

  return api.get(`/penjualan/list/`, { params: formattedParams });
};

export const getDetailPenjualan = (id) => api.get(`/penjualan/detail/${id}/`);

export const deletePenjualan = (id) => api.delete(`/penjualan/delete/${id}/`);

// *** POST ***

export const createPenjualan = (payload) =>
  api.post(`/penjualan/create/`, null, payload);

export const updatePenjualan = (id, payload) =>
  api.post(`/penjualan/update/${id}/`, null, payload);

// *** EXPORT ***

export const exportPenjualanToExcel = (params = {}) => {
  const formattedParams = {
    ...params,
    ...(params.kelompok && {
      kelompok: params.kelompok,
    }),
    ...(params.pabrik && {
      pabrik: params.pabrik,
    }),
    ...(params.start_date && {
      start_date: params.start_date,
    }),
    ...(params.end_date && {
      end_date: params.end_date,
    }),
    ...(params.search && {
      search: params.search,
    }),
  };

  return api.get(`/penjualan/export/`, {
    params: formattedParams,
    responseType: 'blob',
  });
};
