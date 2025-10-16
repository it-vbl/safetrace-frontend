import api from './api';

export const getListLB3 = async (params = '') => {
  try {
    const response = await api.get(`/lb3?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching LB3 data:', error);
    throw error;
  }
};

export const getLB3Detail = async (id) => {
  try {
    const response = await api.get(`/lb3/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching LB3 detail:', error);
    throw error;
  }
};

export const exportLB3ToExcel = async (params = '') => {
  try {
    const response = await api.get(`/lb3/export?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting LB3 data:', error);
    throw error;
  }
};
