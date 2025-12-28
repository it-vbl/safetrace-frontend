import api from './api';

//list STDB
export const getPenerbitanList = (params) =>
  api.get(`/stdb/penerbitan/list/?${params}`);
export const getVerifikasiList = (params) =>
  api.get(`/stdb/verifikasi/list/?${params}`);
export const getTidakTerbitList = (params) =>
  api.get(`/stdb/tidak-terbit/list/?${params}`);
export const getDataTerbitList = (params) =>
  api.get(`/stdb/data-terbit/list/?${params}`);
export const getDataBerakhirList = (params) =>
  api.get(`/stdb/data-berakhir/list/?${params}`);

// proses STDB
export const pengajuanVerifikasi = (payload) =>
  api.post(`/stdb/pengajuan-verifikasi/`, null, payload);
export const prosesVerifikasiKebun = (payload) =>
  api.post(`/stdb/verifikasi/kebun/proses/`, null, payload);
export const getStatusVerifikasiKebun = (pekebunId, kebunId) =>
  api.get(`/stdb/verifikasi/kebun/status/${pekebunId}/${kebunId}/`);
export const batalkanVerifikasiKebun = (payload) =>
  api.post(`/stdb/verifikasi/kebun/batal/`, null, payload);
export const ubahVerifikasiKebunKePendataan = (payload) =>
  api.post(`/stdb/ubah-ke-pendataan/`, null, payload);
export const tidakTerbitVerifikasiKebun = (payload) =>
  api.post(`/stdb/tidak-terbit/`, null, payload);
export const rekomendasiTerbit = (payload) =>
  api.post(`/stdb/rekomendasi-terbit/`, null, payload);
export const getListKebunSTDB = (stdbId) =>
  api.get(`/stdb/kebun/list/${stdbId}/`);
export const prosesPenerbitanSTDB = (payload) =>
  api.post(`/stdb/penerbitan/proses/`, null, payload);
export const prosesDataBerakhirSTDB = (payload) =>
  api.post(`/stdb/data-berakhir/proses/`, null, payload);
export const prosesCetakSTDB = (payload) =>
  api.post(`/stdb/cetak/proses/`, null, payload);

export const getRingkasanList = (params) =>
  api.get(`/stdb/ringkasan/?${params}`);

export const getJumlahStdbChartBar = (params = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('getJumlahStdbChartBar params', params);
  }
  return api.get('/analisis/chart-bar/jumlah-stdb/', { params });
};

export const getLuasKebunKomoditasChartBar = (params = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('getLuasKebunKomoditasChartBar params', params);
  }
  return api.get('/analisis/chart-bar/luas-kebun-komoditas/', { params });
};

export const getJumlahStdbTerbitKomoditasPie = (params = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('getJumlahStdbTerbitKomoditasPie params', params);
  }
  return api.get('/analisis/chart-pie/stdb-terbit-komoditas/', { params });
};
