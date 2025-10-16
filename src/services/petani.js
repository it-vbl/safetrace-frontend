import api from './api';

// *** GET ***

export const getListPetani = (params = {}) => {
  const formattedParams = {
    ...params,
    ...(params.keanggotaan !== undefined && {
      keanggotaan: params.keanggotaan.toString()
    }),

    ...(params.kelompok_tani && {
      kelompok_tani: params.kelompok_tani
    }),
    
    ...(params.search && {
      search: params.search
    })
  };
  
  return api.get(`/petani/list/`, { params: formattedParams });
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
