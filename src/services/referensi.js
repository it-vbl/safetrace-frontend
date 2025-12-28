import api from './api';

export const getPendidikanTerakhir = () =>
  api.get(`/referensi/pendidikan-terakhir/`);
export const getStatusLahan = () => api.get(`/referensi/status-lahan/`);
export const getPolaTanam = () => api.get(`/referensi/pola-tanam/`);
export const getAsalBenih = () => api.get(`/referensi/asal-benih/`);
export const getJenisLahan = () => api.get(`/referensi/jenis-lahan/`);
export const getJenisPupuk = () => api.get(`/referensi/jenis-pupuk/`);
export const getJenisKelamin = () => api.get(`/referensi/jenis-kelamin/`);
export const getEksPlasma = () => api.get(`/referensi/eks-plasma/`);
export const getUserRoles = () => api.get(`/referensi/user-roles/`);
export const getKelompokTani = () => api.get(`/petani/kelompok-tani/list/`);
export const getStatusPerkawinan = () =>
  api.get(`/referensi/status-perkawinan/`);
export const getStatusPekerja = () => api.get(`/referensi/status-pekerja/`);
export const getSumberKontak = () => api.get(`/referensi/sumber-kontak/`);
export const getJenisLegalitas = () => api.get(`/referensi/jenis-legalitas/`);
