import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getAsalBenih,
  getEksPlasma,
  getJenisKelamin,
  getJenisLahan,
  getJenisPupuk,
  getKomoditasKelembagaan,
  getPendidikanTerakhir,
  getPolaTanam,
  getStatusLahan,
  getSTDBStatuses,
} from '../services/referensi';
import {
  setAsalBenih,
  setEksPlasma,
  setJenisKelamin,
  setJenisLahan,
  setJenisPupuk,
  setKomoditasKelembagaan,
  setPendidikanTerakhir,
  setPolaTanam,
  setStatusLahan,
  setSTDBStatuses,
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

  const fetchSTDBStatuses = () => fetchData(getSTDBStatuses, setSTDBStatuses);
  const fetchPendidikanTerakhir = () => fetchData(getPendidikanTerakhir, setPendidikanTerakhir);
  const fetchStatusLahan = () => fetchData(getStatusLahan, setStatusLahan);
  const fetchPolaTanam = () => fetchData(getPolaTanam, setPolaTanam);
  const fetchAsalBenih = () => fetchData(getAsalBenih, setAsalBenih);
  const fetchJenisLahan = () => fetchData(getJenisLahan, setJenisLahan);
  const fetchJenisPupuk = () => fetchData(getJenisPupuk, setJenisPupuk);
  const fetchKomoditasKelembagaan = () => fetchData(getKomoditasKelembagaan, setKomoditasKelembagaan);
  const fetchJenisKelamin = () => fetchData(getJenisKelamin, setJenisKelamin);
  const fetchEksPlasma = () => fetchData(getEksPlasma, setEksPlasma);

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
  };
};

export default useReferences;
