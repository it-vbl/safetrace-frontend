import api from './api';

export const getListKomoditas = () => api.get(`/referensi/komoditas-kelembagaan/`);
