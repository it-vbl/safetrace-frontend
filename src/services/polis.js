import api from './api';

export const registerPolis = (payload) => api.post(`/polis`, null, payload);

export const claimPolis = (payload) => api.post(`/polis/claim`, null, payload);

export const evaluatePolis = (payload) => api.post(`/polis/evaluation`, null, payload);

export const getClaimList = () => api.get(`/polis/claims`);

export const getClaimDetail = (claimId) => api.get(`/polis/claims/${claimId}`);

export const updateClaimStatus = (claimId, status) =>
  api.update(`/polis/claims/${claimId}/updateStatus`, null, { status });

export const uploadFile = (file) => api.postData(`/upload`, file);

export const ocrKTP = (file) => api.postData(`/ai/ocr-ktp`, file);
