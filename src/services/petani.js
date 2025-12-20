import api from './api';

// *** GET ***

export const getListPetani = (params = {}) => {
  const formattedParams = {
    ...params,
    ...(params.keanggotaan !== undefined && {
      keanggotaan: params.keanggotaan.toString(),
    }),

    ...(params.kelompok_tani && {
      kelompok_tani: params.kelompok_tani,
    }),

    ...(params.search && {
      search: params.search,
    }),
  };

  return api.get(`/petani/list/`, { params: formattedParams });
};

export const downloadListPetani = (params = {}) => {
  const formattedParams = {
    ...params,
    ...(params.keanggotaan !== undefined && {
      keanggotaan: params.keanggotaan.toString(),
    }),

    ...(params.kelompok_tani && {
      kelompok_tani: params.kelompok_tani,
    }),

    ...(params.search && {
      search: params.search,
    }),
  };

  return api.get(`/petani/list/download/`, {
    params: formattedParams,
    responseType: 'blob',
  });
};

export const getDetailPetani = (id) => api.get(`/petani/detail/${id}/`);

export const deletePetani = (id) => api.delete(`/petani/delete/${id}/`);

export const getDetailLampiranPetani = (id) =>
  api.get(`/petani/lampiran/detail/${id}/`);

// *** POST ***

export const createPetani = (payload) =>
  api.post(`/petani/create/`, null, payload);

export const updatePetani = (id, payload) =>
  api.post(`/petani/update/${id}/`, null, payload);

// *** POST MULTIPART ***

export const createLampiranPetani = (payload) =>
  api.postData(`/petani/lampiran/create/`, payload);

export const updateLampiranPetani = (id, payload) =>
  api.postData(`/petani/lampiran/update/${id}/`, payload);

// *** DIKLAT ***

export const getListDiklat = (params = {}) => {
  const formattedParams = {
    ...params,
    ...(params.kelompok_tani && {
      kelompok_tani: params.kelompok_tani,
    }),
    ...(params.search && {
      search: params.search,
    }),
  };
  return api.get(`/petani/diklat/list/`, { params: formattedParams });
};

export const getStatistikDiklat = () => api.get(`/petani/diklat/statistik/`);

export const updateDiklat = (id, payload) =>
  api.post(`/petani/diklat/update/${id}/`, null, payload);

export const getDetailDiklat = (id) => api.get(`/petani/diklat/detail/${id}/`);

export const downloadListDiklat = (params = {}) => {
  const formattedParams = {
    ...params,
    ...(params.kelompok_tani && {
      kelompok_tani: params.kelompok_tani,
    }),
    ...(params.search && {
      search: params.search,
    }),
  };
  return api.get(`/petani/diklat/download/`, {
    params: formattedParams,
    responseType: 'blob',
  });
};
