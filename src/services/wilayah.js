import api from './api';

export const getKecamatanSanggau = () => api.get(`/wilayah-indonesia/kecamatan/sanggau/`);
export const getProvinsi = () => api.get(`/wilayah-indonesia/provinsi`);
export const getKota = (idProvinsi) => api.get(`/wilayah-indonesia/kabupaten/${idProvinsi}`);
export const getKecamatan = (idKota) => api.get(`/wilayah-indonesia/kecamatan/${idKota}/`);
export const getDesa = (idKecamatan) => api.get(`/wilayah-indonesia/desa/${idKecamatan}/`);
