import { useCallback,useState } from 'react';

import { getRingkasanList } from '../services/stdb';

const useRingkasan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listRingkasan, setListRingkasan] = useState([]);

  const fetchRingkasan = useCallback(async ({ komoditas = '', start_date = '', end_date = '' } = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      if (komoditas) params.set('komoditas', komoditas);
      if (start_date) params.set('start_date', start_date);
      if (end_date) params.set('end_date', end_date);

      const response = await getRingkasanList(params);
      
      if (response.status === 200) {
        setListRingkasan(response.data.data || []);
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching ringkasan:', error);
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetRingkasan = useCallback(() => {
    setListRingkasan([]);
    setError(null);
  }, []);

  return {
    loading,
    error,
    listRingkasan,
    fetchRingkasan,
    resetRingkasan,
  };
};

export default useRingkasan;
