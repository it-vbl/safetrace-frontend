import api from './api';

export const getProvinces = () => api.get(`/master/provinces`);

export const getRegencies = (regencyId) => api.get(`/master/provinces/${regencyId}/regencies`);

export const getDistricts = (districtId) => api.get(`/master/provinces/regencies/${districtId}/districts`);

export const getVillages = (villageId) => api.get(`/master/provinces/regencies/districts/${villageId}/villages`);
