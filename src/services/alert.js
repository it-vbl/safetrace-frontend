import api from './api';

export const getDeforestationAlerts = (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.kabupaten) queryParams.append('kabupaten', params.kabupaten);
  if (params.kecamatan) queryParams.append('kecamatan', params.kecamatan);
  if (params.source_type) queryParams.append('source_type', params.source_type);
  if (params.page) queryParams.append('page', params.page);
  if (params.page_size) queryParams.append('page_size', params.page_size);
  if (params.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  return api.get(
    `/alerts/deforestation/${queryString ? `?${queryString}` : ''}`
  );
};
