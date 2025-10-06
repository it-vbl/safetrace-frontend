import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getAsalBenih,
  getEksPlasma,
  getJenisKelamin,
  getJenisLahan,
  getJenisPupuk,
  getKelompokTani,
  getKomoditasKelembagaan,
  getPendidikanTerakhir,
  getPolaTanam,
  getStatusLahan,
  getStatusPerkawinan,
  getSTDBStatuses,
  getUserRoles,
} from '../services/referensi';
import {
  setAsalBenih,
  setEksPlasma,
  setJenisKelamin,
  setJenisLahan,
  setJenisPupuk,
  setKelompokTani,
  setKomoditasKelembagaan,
  setPendidikanTerakhir,
  setPolaTanam,
  setStatusLahan,
  setStatusPerkawinan,
  setSTDBStatuses,
  setUserRoles,
} from '../store/slices/referensi';

const useReferences = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const {
    stdbStatuses,
    pendidikanTerakhir,
    statusLahan,
    jenisLahan,
    jenisPupuk,
    asalBenih,
    polaTanam,
    komoditasKelembagaan,
    jenisKelamin,
    eksPlasma,
    userRoles,
    statusPerkawinan,
    kelompokTani,
  } = useSelector((state) => state.referensi);

  const fetchData = async (fetchFunction, setAction) => {
    setLoading(true);
    try {
      const response = await fetchFunction();
      const references = response.data.data;
      dispatch(
        setAction(
          references.map((data) => ({
            ...data,
            value: data?.value,
            label: data?.label,
          }))
        )
      );
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSTDBStatuses = useCallback(() => fetchData(getSTDBStatuses, setSTDBStatuses), []);
  const fetchPendidikanTerakhir = useCallback(() => fetchData(getPendidikanTerakhir, setPendidikanTerakhir), []);
  const fetchStatusLahan = useCallback(() => fetchData(getStatusLahan, setStatusLahan), []);
  const fetchPolaTanam = useCallback(() => fetchData(getPolaTanam, setPolaTanam), []);
  const fetchAsalBenih = useCallback(() => fetchData(getAsalBenih, setAsalBenih), []);
  const fetchJenisLahan = useCallback(() => fetchData(getJenisLahan, setJenisLahan), []);
  const fetchJenisPupuk = useCallback(() => fetchData(getJenisPupuk, setJenisPupuk), []);
  const fetchKomoditasKelembagaan = useCallback(() => fetchData(getKomoditasKelembagaan, setKomoditasKelembagaan), []);
  const fetchJenisKelamin = useCallback(() => fetchData(getJenisKelamin, setJenisKelamin), []);
  const fetchEksPlasma = useCallback(() => fetchData(getEksPlasma, setEksPlasma), []);
  const fetchUserRoles = useCallback(() => fetchData(getUserRoles, setUserRoles), []);
  const fetchStatusPerkawinan = useCallback(() => fetchData(getStatusPerkawinan, setStatusPerkawinan), []);
  const fetchKelompokTani = useCallback(() => fetchData(getKelompokTani, setKelompokTani), []);

  return {
    loading,
    error,
    stdbStatuses,
    pendidikanTerakhir,
    statusLahan,
    jenisLahan,
    jenisPupuk,
    asalBenih,
    polaTanam,
    komoditasKelembagaan,
    jenisKelamin,
    eksPlasma,
    userRoles,
    statusPerkawinan,
    kelompokTani,
    fetchSTDBStatuses,
    fetchPendidikanTerakhir,
    fetchStatusLahan,
    fetchPolaTanam,
    fetchAsalBenih,
    fetchJenisLahan,
    fetchJenisPupuk,
    fetchKomoditasKelembagaan,
    fetchJenisKelamin,
    fetchEksPlasma,
    fetchUserRoles,
    fetchStatusPerkawinan,
    fetchKelompokTani,
  };
};

export default useReferences;
