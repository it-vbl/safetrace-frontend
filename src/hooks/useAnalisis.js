import { useCallback,useState } from 'react';

import {
  getEksPlasmaStatistik,
  getJenisPupukStatistik,
  getPolaTanamStatistik,
  getStdbStatistik,
} from '../services/analisis';

const useAnalisis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stdbStatistik, setStdbStatistik] = useState([]);
  const [jenisPupukStatistik, setJenisPupukStatistik] = useState([]);
  const [polaTanamStatistik, setPolaTanamStatistik] = useState([]);
  const [eksPlasmaStatistik, setEksPlasmaStatistik] = useState([]);

  const fetchStdbStatistik = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await getStdbStatistik(params);
      if (response.status === 200) {
        setStdbStatistik(response.data.data.results || response.data.data);
      }
    } catch (error) {
      console.error('Error fetching STDB statistik:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJenisPupukStatistik = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await getJenisPupukStatistik(params);
      if (response.status === 200) {
        setJenisPupukStatistik(response.data.data.results || response.data.data);
      }
    } catch (error) {
      console.error('Error fetching jenis pupuk statistik:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPolaTanamStatistik = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await getPolaTanamStatistik(params);
      if (response.status === 200) {
        setPolaTanamStatistik(response.data.data.results || response.data.data);
      }
    } catch (error) {
      console.error('Error fetching pola tanam statistik:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEksPlasmaStatistik = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await getEksPlasmaStatistik(params);
      if (response.status === 200) {
        setEksPlasmaStatistik(response.data.data.results || response.data.data);
      }
    } catch (error) {
      console.error('Error fetching eks plasma statistik:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAPI = useCallback(async (api, setState, params) => {
    setLoading(true);
    try {
      const response = await api(params);
      if (response.status === 200) {
        setState(response.data.data.results || response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    stdbStatistik,
    jenisPupukStatistik,
    polaTanamStatistik,
    eksPlasmaStatistik,
    fetchStdbStatistik,
    fetchJenisPupukStatistik,
    fetchPolaTanamStatistik,
    fetchEksPlasmaStatistik,
    fetchAPI,
    resetError,
  };
};

export default useAnalisis;
