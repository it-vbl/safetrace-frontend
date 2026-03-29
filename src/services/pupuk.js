import api from './api';

// *** GET ***

export const getListPupuk = (params = {}) => {
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

  return api.get(`/gap/pupuk/list/`, { params: formattedParams });
};

export const getDetailPupukKebun = (kebunId) => {
  return api.get(`/gap/pupuk/detail/kebun/${kebunId}/`);
};

export const getListPupukKebun = (kebunId) => {
  return api.get(`/gap/pupuk/list/kebun/${kebunId}/`);
};

// *** POST ***

export const createPupuk = (payload) => {
  return api.post(`/gap/pupuk/create/`, null, payload);
};

export const updatePupuk = (pupukId, payload) => {
  return api.post(`/gap/pupuk/update/${pupukId}/`, null, payload);
};

// *** DELETE ***

export const deletePupuk = (pupukId) => {
  return api.delete(`/gap/pupuk/delete/${pupukId}/`);
};

export const downloadListPupuk = (params = {}) => {
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

  return api.get(`/gap/pupuk/download/`, {
    params: formattedParams,
    responseType: 'blob',
  });
};
