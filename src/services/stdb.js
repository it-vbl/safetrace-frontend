import api from './api';

export const getSTDBList = (params) => api.get(`/pekebun/kebun/list/?${params}`);
export const pengajuanVerifikasi = (payload) => api.post(`/stdb/pengajuan-verifikasi/`, null, payload);
export const getVerifikasiList = (params) => api.get(`/stdb/verifikasi/list/?${params}`);
export const prosesVerifikasiKebun = (payload) => api.post(`/stdb/verifikasi/kebun/proses/`, null, payload);
export const getStatusVerifikasiKebun = (pekebunId, kebunId) =>
  api.get(`/stdb/verifikasi/kebun/status/${pekebunId}/${kebunId}/`);
export const batalkanVerifikasiKebun = (payload) => api.post(`/stdb/verifikasi/kebun/batal/`, null, payload);
export const ubahVerifikasiKebunKePendataan = (payload) => api.post(`/stdb/ubah-ke-pendataan/`, null, payload);
export const tidakTerbitVerifikasiKebun = (payload) => api.post(`/stdb/tidak-terbit/`, null, payload);
export const rekomendasiTerbit = (payload) => api.post(`/stdb/rekomendasi-terbit/`, null, payload);
export const getListKebunSTDB = (stdbId) => api.get(`/stdb/kebun/list/${stdbId}/`);
