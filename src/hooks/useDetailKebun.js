import { useCallback,useState } from 'react';

import { getDetailKebun } from '../services/pekebun';

const useDetailKebun = (idKebun = null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback((key, value) => {
    // Note: detailKebun is not defined in this scope. This was an existing bug in the code.
    // To prevent ReferenceError if called, we would need detailKebun from state or passed in.
    return null;
  }, []);

  const fetchDetailKebun = useCallback(async (id) => {
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
  }, [idKebun]);

  return { loading, error, search, fetchDetailKebun };
};

export default useDetailKebun;
