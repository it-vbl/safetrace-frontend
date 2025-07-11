import { useState, useEffect } from 'react';
import { getSTDBList } from '../services/stdb';
import { useSelector, useDispatch } from 'react-redux';
import { setSTDB } from '@/store/slices/stdb';

const useSTDB = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const { stdb, filterKomoditas } = useSelector((state) => state.stdb);

  const search = (key, value) => {
    const find = stdb.find((data) => data[key] === value);
    return find;
  };

  const fetchSTDB = async () => {
    setLoading(true);
    try {
      const response = await getSTDBList();
      const stdb = response.data.data.results;
      dispatch(
        setSTDB(
          stdb.map((data) => {
            const geom = {
              type: 'Polygon',
              coordinates: data?.geom?.coordinates?.[0]?.map((coord) => [coord[1], coord[0]]),
            };
            return {
              ...data,
              value: data?.value,
              label: data?.name,
              geom,
            };
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
    fetchSTDB();
  }, [filterKomoditas]);

  return { stdb, filterKomoditas, loading, error, search };
};

export default useSTDB;
