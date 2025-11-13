import api from './api';

// *** GET ***

export const getListPestisida = () => {
  return api.get('/gap/pestisida/list/');
};

export const getDetailPestisida = (id) =>
  api.get(`/gap/pestisida/detail/${id}/`);

export const deletePestisida = (id) =>
  api.delete(`/gap/pestisida/delete/${id}/`);

// *** POST ***

export const createPestisida = (payload) =>
  api.post(`/gap/pestisida/create/`, null, payload);

export const updatePestisida = (id, payload) =>
  api.post(`/gap/pestisida/update/${id}/`, null, payload);
