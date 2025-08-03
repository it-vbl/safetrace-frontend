import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setSTDB } from '@/store/slices/stdb';

import { getListKebunSTDB, getStatusVerifikasiKebun, getSTDBList, getVerifikasiList } from '../services/stdb';

const useSTDB = ({ page_size = 10, page = 1, search = '' } = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalSTDB, setTotalSTDB] = useState(0);
  const [listVerifikasi, setListVerifikasi] = useState([]);
  const [listKebunSTDB, setListKebunSTDB] = useState([]);
  const [totalListVerifikasi, setTotalListVerifikasi] = useState(0);

  const dispatch = useDispatch();

  const { stdb, filterKomoditas, filterKecamatan, filterSTDBStatus } = useSelector((state) => state.stdb);

  const fetchSTDB = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (page_size) params.set('page_size', page_size);
      if (page) params.set('page', page);
      filterKomoditas.forEach((komoditas) => params.append('komoditas', komoditas));
      filterKecamatan.forEach((kecamatan) => params.append('kecamatan', kecamatan));
      if (filterSTDBStatus) params.set('status_stdb', filterSTDBStatus);
      if (search) params.set('search', search);
      const response = await getSTDBList(params);
      const stdb = response.data.data.results;
      setTotalSTDB(response.data.data.count);
      dispatch(
        setSTDB(
          stdb.map((data) => {
            const geom = {
              type: 'Polygon',
              coordinates: data?.peta?.geom?.coordinates?.[0]?.map((coord) => [coord[1], coord[0]]),
            };
            return {
              ...data,
              value: data?.value,
              label: data?.name,
              peta: {
                ...data?.peta,
                geom,
              },
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

  const fetchStatusVerifikasiKebun = async (pekebunId, kebunId) => {
    try {
      const response = await getStatusVerifikasiKebun(pekebunId, kebunId);
      const data = response.data.data;
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const fetchListVerifikasi = async ({ page_size, page, search }) => {
    try {
      const params = new URLSearchParams();
      if (page_size) params.set('page_size', page_size);
      if (page) params.set('page', page);
      if (search) params.set('search', search);
      const response = await getVerifikasiList(params);
      if (response.status == 200) {
        setListVerifikasi(response.data.data.results);
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const fetchListKebunSTDB = async (stdbId) => {
    try {
      const response = await getListKebunSTDB(stdbId);
      if (response.status == 200) {
        setListKebunSTDB(response.data.data.results);
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return {
    stdb,
    filterSTDBStatus,
    filterKomoditas,
    filterKecamatan,
    loading,
    error,
    totalSTDB,
    listVerifikasi,
    listKebunSTDB,
    fetchStatusVerifikasiKebun,
    fetchListVerifikasi,
    fetchSTDB,
    fetchListKebunSTDB,
  };
};

export default useSTDB;
