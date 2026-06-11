import api from './api';

// *** GET ***

export const getLaporanList = (params = {}) =>
  api.get(`/laporan/statistik/`, { params });

export const downloadLaporan = (id, payload = {}) => {
  return api.get(`/laporan/statistik/${id}/download/`, {
    params: payload,
    data: payload,
    responseType: 'blob',
  });
};

// *** POST ***

export const createLaporan = (payload) =>
  api.post(`/laporan/statistik/create/`, null, payload);

// *** DELETE ***

export const deleteLaporan = (id, payload) =>
  api.deleteData(`/laporan/statistik/${id}/delete/`, payload);

