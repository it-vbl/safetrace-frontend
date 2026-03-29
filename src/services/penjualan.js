import querystring from 'qs';

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

export const getListPenjualanAngkutan = (params = {}) => {
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

  return api.get(`/penjualan/angkutan/list/`, { params: formattedParams });
};

export const getDetailPenjualan = (id) => api.get(`/penjualan/detail/${id}/`);

export const getDetailPenjualanAngkutan = (id) =>
  api.get(`/penjualan/angkutan/detail/${id}/`);

export const getDetailPenjualanKelompokPenyetor = (id) =>
  api.get(`/penjualan/kelompok-penyetor/list/`, {
    params: { angkutan: id },
  });

export const getDetailPenjualanPabrik = (id) =>
  api.get(`/penjualan/pabrik/detail/${id}/`);

export const getSankeyData = (params = {}) =>
  api.get(`/penjualan/sankey-diagram/`, {
    params,
    paramsSerializer: (params) => {
      return querystring.stringify(params, { arrayFormat: 'repeat' });
    },
  });

export const downloadSankeyData = (params = {}) =>
  api.get(`/penjualan/sankey-diagram/download/`, {
    params,
    responseType: 'blob',
    paramsSerializer: (params) => {
      return querystring.stringify(params, { arrayFormat: 'repeat' });
    },
  });

export const getListPabrik = (params = {}) =>
  api.get(`/penjualan/pabrik/list/`, { params });

export const deletePenjualanAngkutan = (id) =>
  api.delete(`/penjualan/angkutan/delete/${id}/`);

export const getBarChartTotalPenjualan = (params = {}) => {
  const formattedParams = {
    ...(params.start_date && {
      start_date: params.start_date,
    }),
    ...(params.end_date && {
      end_date: params.end_date,
    }),
  };
  return api.get(`/penjualan/bar-chart/total-penjualan/`, {
    params: formattedParams,
  });
};

export const getBarChartBeratTimbangan = (params = {}) => {
  const formattedParams = {
    ...(params.start_date && {
      start_date: params.start_date,
    }),
    ...(params.end_date && {
      end_date: params.end_date,
    }),
  };
  return api.get(`/penjualan/bar-chart/berat-timbangan/`, {
    params: formattedParams,
  });
};

export const getDonutChartBeratTimbanganPabrik = (params = {}) => {
  const formattedParams = {
    ...(params.start_date && {
      start_date: params.start_date,
    }),
    ...(params.end_date && {
      end_date: params.end_date,
    }),
  };
  return api.get(`/penjualan/donut-chart/berat-timbangan-pabrik/`, {
    params: formattedParams,
  });
};

// *** POST ***

export const createPenjualan = (payload) =>
  api.post(`/penjualan/create/`, null, payload);

export const createPenjualanAngkutan = (payload) =>
  api.post(`/penjualan/angkutan/create/`, null, payload);

export const createPenjualanKelompokPenyetorBulk = (payload) =>
  api.post(`/penjualan/kelompok-penyetor/bulk-create/`, null, payload);

export const createPenjualanPabrik = (payload) =>
  api.post(`/penjualan/pabrik/create/`, null, payload);

export const updatePenjualan = (id, payload) =>
  api.post(`/penjualan/update/${id}/`, null, payload);

export const updateAngkutanPabrik = (idAngkutan, payload) =>
  api.patch(`/penjualan/angkutan/update-pabrik/${idAngkutan}/`, {}, payload);

export const updatePenjualanAngkutan = (id, payload) =>
  api.post(`/penjualan/angkutan/update/${id}/`, null, payload);

// *** EXPORT ***

export const exportPenjualanAngkutanToCSV = (params = {}) => {
  const formattedParams = {
    ...params,
    ...(params.kelompok && {
      kelompok_tani: params.kelompok,
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

  return api.get(`/penjualan/angkutan/list/download/`, {
    params: formattedParams,
    responseType: 'blob',
  });
};
