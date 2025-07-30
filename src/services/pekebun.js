import api from './api';

export const getListPekebun = (params) => api.get(`/pekebun/list/?${params}`);
export const getListPekebunOnPendataan = (params) => api.get(`/pekebun/pendataan/list/?${params}`);
export const getDetailPekebun = (id) => api.get(`/pekebun/detail/${id}/`);

// Kebun Endpoint
export const getListKebun = (params) => api.get(`/pekebun/kebun/list/?${params}`);
export const getDetailKebun = (idKebun) => api.get(`/pekebun/kebun/detail/${idKebun}/`);

export const createPekebun = (payload) => api.post(`/pekebun/create/`, null, payload);
export const createLembagaTani = (payload) => api.post(`/pekebun/lembaga-tani/create/`, null, payload);
export const checkNIK = (nik) => api.get(`/pekebun/periksa-nik/${nik}`);
export const deletePekebun = (payload) => api.post(`/pekebun/delete/`, null, payload);
