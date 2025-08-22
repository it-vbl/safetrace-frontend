import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setSTDB } from '@/store/slices/stdb';

import {
  getDataBerakhirList,
  getDataTerbitList,
  getListKebunSTDB,
  getPenerbitanList,
  getRingkasanList,
  getStatusVerifikasiKebun,
  getSTDBList,
  getTidakTerbitList,
  getVerifikasiList,
} from '../services/stdb';

const useSTDB = ({ page_size = 10, page = 1, search = '' } = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalSTDB, setTotalSTDB] = useState(0);
  const [listVerifikasi, setListVerifikasi] = useState([]);
  const [listKebunSTDB, setListKebunSTDB] = useState([]);
  const [listTidakTerbit, setListTidakTerbit] = useState([]);
  const [listPenerbitan, setListPenerbitan] = useState([]);
  const [listTerbit, setListTerbit] = useState([]);
  const [listDataBerakhir, setListDataBerakhir] = useState([]);

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
    setLoading(true);
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
    } finally {
      setLoading(false);
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

  const fetchAPI = async (api, setState, params) => {
    setLoading(true);
    try {
      const response = await api(params);
      if (response.status == 200) {
        setState(response.data.data.results);
        setTotalSTDB(response.data.data.count);
      }
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTidakTerbit = async (params) => {
    return fetchAPI(getTidakTerbitList, setListTidakTerbit, params);
  };

  const fetchPenerbitan = async (params) => {
    return fetchAPI(getPenerbitanList, setListPenerbitan, params);
  };

  const fetchTerbit = async (params) => {
    return fetchAPI(getDataTerbitList, setListTerbit, params);
  };

  const fetchDataBerakhir = async (params) => {
    return fetchAPI(getDataBerakhirList, setListDataBerakhir, params);
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
    listTidakTerbit,
    listPenerbitan,
    listTerbit,
    listDataBerakhir,
    fetchStatusVerifikasiKebun,
    fetchListVerifikasi,
    fetchSTDB,
    fetchListKebunSTDB,
    fetchTidakTerbit,
    fetchPenerbitan,
    fetchTerbit,
    fetchDataBerakhir,
  };
};

export default useSTDB;
