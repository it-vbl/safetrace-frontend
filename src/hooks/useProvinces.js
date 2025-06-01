import { useState, useEffect } from 'react';
import { getProvinces } from '../services/master';

const useProvinces = () => {
  const [provinces, setProvinces] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = (key, value) => {
    const find = provinces.find((data) => data[key] === value);
    return find;
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const response = await getProvinces();
        const provinces = response.data.data;
        setProvinces(provinces);
        setProvinceOptions(
          provinces.map((data) => {
            return { value: data.id, label: data.name };
          })
        );
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  return { provinces, provinceOptions, loading, error, search };
};

export default useProvinces;
