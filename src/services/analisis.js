import api from './api';

/**
 * Get STDB statistics.
 *
 * @param {string} [params.komoditas] - The name of the crop.
 * @param {string} [params.start_date] - The start date of the period.
 * @param {string} [params.end_date] - The end date of the period.
 * @return {Promise} A promise that resolves to the STDB statistics.
 */
export const getStdbStatistik = (params) =>
  api.get('/analisis/stdb-statistik/', { params });

export const getJenisPupukStatistik = (params) =>
  api.get('/analisis/jenis-pupuk-statistik/', { params });

export const getPolaTanamStatistik = (params) =>
  api.get('/analisis/pola-tanam-statistik/', { params });

export const getEksPlasmaStatistik = (params) =>
  api.get('/analisis/eks-plasma-statistik/', { params });

