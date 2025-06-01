import { useState, useEffect } from 'react';
import { getDistricts } from '../services/master';

const useDistricts = (regencyId) => {
  const [districts, setDistricts] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      setLoading(true);
      try {
        const response = await getDistricts(regencyId);
        const districts = response.data.data;
        setDistricts(districts);
        setDistrictOptions(
          districts.map((data) => {
            return { value: data.id, label: data.name };
          })
        );
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    if (regencyId) {
      fetchDistricts();
    }
  }, [regencyId]);

  return { districts, districtOptions, loading, error };
};

export default useDistricts;
