import { useState, useEffect } from 'react';
import { getVillages } from '../services/master';

const useVillages = (districtId) => {
  const [villages, setVillages] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVillages = async () => {
      setLoading(true);
      try {
        const response = await getVillages(districtId);
        const villages = response.data.data;
        setVillages(villages);
        setVillageOptions(
          villages.map((data) => {
            return { value: data.id, label: data.name };
          })
        );
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    if (districtId) {
      fetchVillages();
    }
  }, [districtId]);

  return { villages, villageOptions, loading, error };
};

export default useVillages;
