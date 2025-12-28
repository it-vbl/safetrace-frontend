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

  const fetchPendidikanTerakhir = useCallback(
    () => fetchData(getPendidikanTerakhir, setPendidikanTerakhir),
    []
  );
  const fetchStatusLahan = useCallback(
    () => fetchData(getStatusLahan, setStatusLahan),
    []
  );
  const fetchPolaTanam = useCallback(
    () => fetchData(getPolaTanam, setPolaTanam),
    []
  );
  const fetchAsalBenih = useCallback(
    () => fetchData(getAsalBenih, setAsalBenih),
    []
  );
  const fetchJenisLahan = useCallback(
    () => fetchData(getJenisLahan, setJenisLahan),
    []
  );
  const fetchJenisPupuk = useCallback(
    () => fetchData(getJenisPupuk, setJenisPupuk),
    []
  );
  const fetchJenisKelamin = useCallback(
    () => fetchData(getJenisKelamin, setJenisKelamin),
    []
  );
  const fetchEksPlasma = useCallback(
    () => fetchData(getEksPlasma, setEksPlasma),
    []
  );
  const fetchUserRoles = useCallback(
    () => fetchData(getUserRoles, setUserRoles),
    []
  );
  const fetchStatusPerkawinan = useCallback(
    () => fetchData(getStatusPerkawinan, setStatusPerkawinan),
    []
  );
  const fetchStatusPekerja = useCallback(
    () => fetchData(getStatusPekerja, setStatusPekerja),
    []
  );
  const fetchKelompokTani = useCallback(
    () => fetchData(getKelompokTani, setKelompokTani),
    []
  );
  const fetchSumberKontak = useCallback(
    () => fetchData(getSumberKontak, setSumberKontak),
    []
  );
  const fetchJenisLegalitas = useCallback(
    () => fetchData(getJenisLegalitas, setJenisLegalitas),
    []
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
