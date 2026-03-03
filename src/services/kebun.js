import api from './api';

export const submitLahan = (payload) =>
  api.post(`/pekebun/kebun/lahan-create/`, null, payload);
export const createKebun = (payload) => api.postData(`/kebun/create/`, payload);
export const createKebunDetail = (payload) =>
  api.post(`/kebun/create/`, null, payload);
export const getKebunDetail = (idKebun) => api.get(`/kebun/detail/${idKebun}/`);
export const updateKebun = (idKebun, payload) =>
  api.post(`/kebun/update/${idKebun}/`, null, payload);
export const updateKebunPeta = (idKebun, payload) =>
  api.patch(`/kebun/peta/create-update/${idKebun}/`, null, payload);
export const editLahan = (payload) =>
  api.post(`/pekebun/kebun/lahan-edit/`, null, payload);
export const submitPolaTanam = (payload) =>
  api.post(`/pekebun/kebun/pola-tanam/create-edit/`, null, payload);
export const submitJenisPupuk = (payload) =>
  api.post(`/pekebun/kebun/jenis-pupuk/create-edit/`, null, payload);
export const submitMitraPenjualan = (payload) =>
  api.post(`/pekebun/kebun/mitra-penjualan/create-edit/`, null, payload);
export const submitPemetaan = (payload) =>
  api.post(`/pekebun/kebun/peta/create-edit/`, null, payload);
export const createKomoditas = (payload) =>
  api.post(`/pekebun/kebun/komoditas/create/`, null, payload);
export const editKomoditas = (payload) =>
  api.post(`/pekebun/kebun/komoditas/edit/`, null, payload);
export const deleteKomoditas = (payload) =>
  api.post(`/pekebun/kebun/komoditas/delete/`, null, payload);
export const deleteKebun = (payload) =>
  api.post(`/pekebun/kebun/delete/`, null, payload);
export const downloadSHPKebun = (idKebun) =>
  api.get(`/pekebun/kebun/peta/download/${idKebun}`);
export const createKebunLampiran = (payload) =>
  api.postData(`/kebun/lampiran/create/`, payload);
export const updateKebunLampiran = (idKebun, payload) =>
  api.postData(`/kebun/lampiran/update/${idKebun}/`, payload);
export const getStatistikDokumenKebun = () =>
  api.get('/kebun/statistik/dokumen/');
export const getSidebarStatistics = () =>
  api.get('/statistics/sidebar-statistics/');
