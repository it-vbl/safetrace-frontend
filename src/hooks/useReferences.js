import { useState } from 'react';
import {
  getPendidikanTerakhir,
  getStatusLahan,
  getPolaTanam,
  getAsalBenih,
  getJenisLahan,
  getJenisPupuk,
  getKomoditasKelembagaan,
  getSTDBStatuses,
  getJenisKelamin,
  getEksPlasma,
} from '../services/referensi';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSTDBStatuses,
  setPendidikanTerakhir,
  setStatusLahan,
  setPolaTanam,
  setAsalBenih,
  setJenisLahan,
  setJenisPupuk,
  setKomoditasKelembagaan,
  setJenisKelamin,
  setEksPlasma,
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

  const search = (key, value) => {
    const find = references.find((data) => data[key] === value);
    return find;
  };

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
    search,
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
