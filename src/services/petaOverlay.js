import api from './api';

export const createPetaOverlay = (payload) =>
  api.postData('/layer-static/peta/create/', payload);

export const updatePetaOverlay = (id, payload) =>
  api.postData(`/layer-static/peta/update/${id}/`, payload);

export const getPetaOverlayDetail = (id) =>
  api.get(`/layer-static/peta/detail/${id}/`);

export const deletePetaOverlay = (id) =>
  api.get(`/layer-static/peta/delete/${id}/`);

export const getPetaOverlayList = () => api.get('/layer-static/peta/list/');
