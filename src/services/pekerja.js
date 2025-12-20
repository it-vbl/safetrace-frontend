import api from './api';

export const getListPekerja = (params = {}) => {
  return api.get('/petani/pekerja/list/', { params });
};

export const getPekerjaById = (id) => {
  return api.get(`/petani/pekerja/detail/${id}/`);
};

export const getPekerjaByPetani = (petaniId) => {
  return api.get(`/petani/pekerja/by-petani/${petaniId}/`);
};

export const createPekerja = (formData) => {
  return api.postData('/petani/pekerja/create/', formData);
};

export const updatePekerja = (id, formData) => {
  return api.postData(`/petani/pekerja/update/${id}/`, formData);
};

export const deletePekerja = (id) => {
  return api.delete(`/petani/pekerja/delete/${id}/`);
};

export const downloadListPekerja = (params = {}) => {
  return api.get('/petani/pekerja/download/', {
    params,
    responseType: 'blob',
  });
};
