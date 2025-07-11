import { useState, useEffect } from 'react';
import { getKecamatanSanggau } from '../services/wilayah';
import { useSelector, useDispatch } from 'react-redux';
import { setKecamatanSanggau } from '@/store/slices/kecamatanSanggau';

const useKecamatanSanggau = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const { kecamatanSanggau } = useSelector((state) => state.kecamatanSanggau);

  const search = (key, value) => {
    const find = kecamatanSanggau.find((data) => data[key] === value);
    return find;
  };

  const fetchKecamatanSanggau = async () => {
    setLoading(true);
    try {
      const response = await getKecamatanSanggau();
      const kecamatanSanggau = response.data.data;
      dispatch(
        setKecamatanSanggau(
          kecamatanSanggau.map((data) => {
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
  };

  useEffect(() => {
    fetchKecamatanSanggau();
  }, []);

  return { kecamatanSanggau, loading, error, search };
};

export default useKecamatanSanggau;
