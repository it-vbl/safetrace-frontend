import { useCallback,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setListDesa, setListKecamatan, setListKota, setListProvinsi } from '@/store/slices/wilayah';

import { getDesa, getKecamatan, getKota, getProvinsi } from '../services/wilayah';

const useWilayah = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const { listProvinsi, listKota, listKecamatan, listDesa } = useSelector((state) => state.wilayah);

  const search = (key, value) => {
    const find = kecamatanSanggau.find((data) => data[key] === value);
    return find;
  };

  const fetchData = useCallback(async (action, id, setDataCallback) => {
    setLoading(true);
    try {
      const response = await action(id);
      const data = response.data.data;
      dispatch(
        setDataCallback(
          data.map((data) => {
            return { value: data?.value, label: data?.name };
          })
        )
      );
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const fetchListProvinsi = useCallback(() => fetchData(getProvinsi, null, setListProvinsi), [fetchData]);
  const fetchListKota = useCallback((idProvinsi) => fetchData(getKota, idProvinsi, setListKota), [fetchData]);
  const fetchListKecamatan = useCallback((idKota) => fetchData(getKecamatan, idKota, setListKecamatan), [fetchData]);
  const fetchListDesa = useCallback((idKecamatan) => fetchData(getDesa, idKecamatan, setListDesa), [fetchData]);

  return {
    listProvinsi,
    listKota,
    listKecamatan,
    listDesa,
    loading,
    error,
    search,
    fetchListProvinsi,
    fetchListKota,
    fetchListKecamatan,
    fetchListDesa,
  };
};

export default useWilayah;
