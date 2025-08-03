import api from './api';

export const getStaticLayerList = () => api.get(`/layer-static/list/`);
export const getStaticLayerData = (type) => api.get(`/layer-static/detail/${type}/`);
