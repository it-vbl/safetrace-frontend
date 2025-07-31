import { useEffect,useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';

import { setKomoditas } from '@/store/slices/komoditas';

import { getListKomoditas } from '../services/komoditas';

const useKomoditas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const { komoditas } = useSelector((state) => state.komoditas);

  const search = (key, value) => {
    const find = komoditas.find((data) => data[key] === value);
    return find;
  };

  const fetchKomoditas = async () => {
    setLoading(true);
    try {
      const response = await getListKomoditas();
      const komoditas = response.data.data;
      dispatch(setKomoditas(komoditas));
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKomoditas();
  }, []);

  return { komoditas, loading, error, search };
};

export default useKomoditas;
