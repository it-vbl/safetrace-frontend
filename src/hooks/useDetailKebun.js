import { useState } from 'react';
import { getDetailKebun } from '../services/pekebun';

const useDetailKebun = (idKebun = null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = (key, value) => {
    const find = detailKebun.find((data) => data[key] === value);
    return find;
  };

  const fetchDetailKebun = async (id) => {
    setLoading(true);
    try {
      const response = await getDetailKebun(id || idKebun);
      const detailKebun = response.data.data;
      return detailKebun;
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, search, fetchDetailKebun };
};

export default useDetailKebun;
