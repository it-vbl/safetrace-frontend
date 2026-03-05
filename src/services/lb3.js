import api from './api';

// *** GET ***

export const getListLB3 = (params = {}) => {
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

  return api.get(`/gap/lb3/list/`, { params: formattedParams });
};

export const getDetailLB3Kebun = (kebunId) => {
  return api.get(`/gap/lb3/detail/kebun/${kebunId}/`);
};

export const getListLB3Kebun = (kebunId) => {
  return api.get(`/gap/lb3/list/kebun/${kebunId}/`);
};

// *** POST ***

export const createLB3 = (payload) => {
  return api.post(`/gap/lb3/create/`, null, payload);
};

export const updateLB3 = (lb3Id, payload) => {
  return api.post(`/gap/lb3/update/${lb3Id}/`, null, payload);
};

// *** DELETE ***

export const deleteLB3 = (lb3Id) => {
  return api.get(`/gap/lb3/delete/${lb3Id}/`);
};

export const downloadListLB3 = (params = {}) => {
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

  return api.get(`/gap/lb3/download/`, {
    params: formattedParams,
    responseType: 'blob',
  });
};

export const getLB3Detail = async (id) => {
  try {
    const response = await api.get(`/lb3/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching LB3 detail:', error);
    throw error;
  }
};

export const exportLB3ToExcel = async (params = '') => {
  try {
    const response = await api.get(`/lb3/export?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting LB3 data:', error);
    throw error;
  }
};
