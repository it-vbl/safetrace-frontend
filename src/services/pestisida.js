import api from './api';

// *** GET ***

export const getListPestisida = (params = undefined) => {
  const config = params ? { params } : {};
  return api.get('/gap/pestisida/list/', config);
};

export const getDetailPestisidaKebun = (id) =>
  api.get(`/gap/pestisida/detail/kebun/${id}/`);

export const getListPestisidaKebun = (id) => {
  return api.get(`/gap/pestisida/list/kebun/${id}/`);
};

export const deletePestisida = (id) =>
  api.delete(`/gap/pestisida/delete/${id}/`);

// *** POST ***

export const createPestisida = (payload) =>
  api.post(`/gap/pestisida/create/`, null, payload);

export const updatePestisida = (id, payload) =>
  api.post(`/gap/pestisida/update/${id}/`, null, payload);
