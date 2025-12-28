import { useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';

import { setKomoditas } from '@/store/slices/komoditas';

const useKomoditas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const { komoditas } = useSelector((state) => state.komoditas);

  const search = (key, value) => {
    const find = komoditas.find((data) => data[key] === value);
    return find;
  };


  return { komoditas, loading, error, search };
};

export default useKomoditas;
