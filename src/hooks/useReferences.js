import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getAsalBenih,
  getEksPlasma,
  getJenisKelamin,
  getJenisLahan,
  getJenisLegalitas,
  getJenisPupuk,
  getKelompokTani,
  getPendidikanTerakhir,
  getPolaTanam,
  getStatusLahan,
  getStatusPekerja,
  getStatusPerkawinan,
  getSumberKontak,
  getUserRoles,
} from '../services/referensi';
import {
  setAsalBenih,
  setEksPlasma,
  setJenisKelamin,
  setJenisLahan,
  setJenisLegalitas,
  setJenisPupuk,
  setKelompokTani,
  setPendidikanTerakhir,
  setPolaTanam,
  setStatusLahan,
  setStatusPekerja,
  setStatusPerkawinan,
  setSumberKontak,
  setUserRoles,
} from '../store/slices/referensi';

const useReferences = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const {
    pendidikanTerakhir,
    statusLahan,
    jenisLahan,
    jenisPupuk,
    asalBenih,
    polaTanam,
    jenisKelamin,
    eksPlasma,
    userRoles,
    statusPerkawinan,
    statusPekerja,
    kelompokTani,
    sumberKontak,
    jenisLegalitas,
  } = useSelector((state) => state.referensi);

  const fetchData = useCallback(
    async (fetchFunction, setAction) => {
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
    },
    [dispatch]
  );

  const fetchPendidikanTerakhir = useCallback(
    () => fetchData(getPendidikanTerakhir, setPendidikanTerakhir),
    [fetchData]
  );
  const fetchStatusLahan = useCallback(
    () => fetchData(getStatusLahan, setStatusLahan),
    [fetchData]
  );
  const fetchPolaTanam = useCallback(
    () => fetchData(getPolaTanam, setPolaTanam),
    [fetchData]
  );
  const fetchAsalBenih = useCallback(
    () => fetchData(getAsalBenih, setAsalBenih),
    [fetchData]
  );
  const fetchJenisLahan = useCallback(
    () => fetchData(getJenisLahan, setJenisLahan),
    [fetchData]
  );
  const fetchJenisPupuk = useCallback(
    () => fetchData(getJenisPupuk, setJenisPupuk),
    [fetchData]
  );
  const fetchJenisKelamin = useCallback(
    () => fetchData(getJenisKelamin, setJenisKelamin),
    [fetchData]
  );
  const fetchEksPlasma = useCallback(
    () => fetchData(getEksPlasma, setEksPlasma),
    [fetchData]
  );
  const fetchUserRoles = useCallback(
    () => fetchData(getUserRoles, setUserRoles),
    [fetchData]
  );
  const fetchStatusPerkawinan = useCallback(
    () => fetchData(getStatusPerkawinan, setStatusPerkawinan),
    [fetchData]
  );
  const fetchStatusPekerja = useCallback(
    () => fetchData(getStatusPekerja, setStatusPekerja),
    [fetchData]
  );
  const fetchKelompokTani = useCallback(
    () => fetchData(getKelompokTani, setKelompokTani),
    [fetchData]
  );
  const fetchSumberKontak = useCallback(
    () => fetchData(getSumberKontak, setSumberKontak),
    [fetchData]
  );
  const fetchJenisLegalitas = useCallback(
    () => fetchData(getJenisLegalitas, setJenisLegalitas),
    [fetchData]
  );

  return {
    loading,
    error,
    pendidikanTerakhir,
    statusLahan,
    jenisLahan,
    jenisPupuk,
    asalBenih,
    polaTanam,
    jenisKelamin,
    eksPlasma,
    userRoles,
    statusPerkawinan,
    statusPekerja,
    kelompokTani,
    sumberKontak,
    jenisLegalitas,
    fetchPendidikanTerakhir,
    fetchStatusLahan,
    fetchPolaTanam,
    fetchAsalBenih,
    fetchJenisLahan,
    fetchJenisPupuk,
    fetchJenisKelamin,
    fetchEksPlasma,
    fetchUserRoles,
    fetchStatusPerkawinan,
    fetchStatusPekerja,
    fetchKelompokTani,
    fetchSumberKontak,
    fetchJenisLegalitas,
  };
};

export default useReferences;
