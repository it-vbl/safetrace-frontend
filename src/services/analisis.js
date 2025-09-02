import STDBProcessStepChart from '../components/organisms/STDBProcessStepChart'; // Importing the new chart component

import api from './api';

// Existing API functions
export const getStdbStatistik = (params) =>
  api.get('/analisis/stdb-statistik/', { params });

export const getJenisPupukStatistik = (params) =>
  api.get('/analisis/jenis-pupuk-statistik/', { params });

export const getPolaTanamStatistik = (params) =>
  api.get('/analisis/pola-tanam-statistik/', { params });

export const getEksPlasmaStatistik = (params) =>
  api.get('/analisis/eks-plasma-statistik/', { params });
