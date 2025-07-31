import { useEffect,useState } from 'react';

import { getRegencies } from '../services/master';

const useRegencies = (provinceId) => {
  const [regencies, setRegencies] = useState([]);
  const [regencyOptions, setRegencyOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegencies = async () => {
      setLoading(true);
      try {
        const response = await getRegencies(provinceId);
        const regencies = response.data.data;
        setRegencies(regencies);
        setRegencyOptions(
          regencies.map((data) => {
            return { value: data.id, label: data.name };
          })
        );
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    if (provinceId) {
      fetchRegencies();
    }
  }, [provinceId]);

  return { regencies, regencyOptions, loading, error };
};

export default useRegencies;
