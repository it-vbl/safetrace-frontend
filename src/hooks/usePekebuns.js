import { useCallback,useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';

import { setDetailPekebun, setListKebun, setOnPendataanPekebuns, setPekebuns } from '@/store/slices/pekebun';

import { getDetailPekebun, getListKebun, getListPekebun, getListPekebunOnPendataan } from '../services/pekebun';

const usePekebuns = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPekebun, setTotalPekebun] = useState(0);

  const dispatch = useDispatch();

  const { pekebuns, onPendataanPekebuns, detailPekebun, listKebun } = useSelector((state) => state.pekebun);

  const fetchData = useCallback(async (action, setDataCallback, setterCallback) => {
    setLoading(true);
    try {
      const response = await action();
      if (setterCallback) {
        setterCallback(response);
      } else {
        const pekebuns = response.data.data.results;
        setTotalPekebun(response.data.data.count);
        dispatch(setDataCallback(pekebuns));
      }
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    pekebuns,
    totalPekebun,
    onPendataanPekebuns,
    detailPekebun,
    listKebun,
    fetchPekebun: useCallback(({ page_size = 10, page = 1, search = '' } = {}) => {
      const params = `page_size=${page_size}&page=${page}&search=${search}`;
      return fetchData(() => getListPekebun(params), setPekebuns);
    }, [fetchData]),
    fetchPekebunOnPendataan: useCallback(({ page_size = 10, page = 1, search = '', komoditas = '', kecamatan = '' } = {}) => {
      let params = `page_size=${page_size}&page=${page}&search=${search}`;
      if (komoditas) params += `&komoditas=${komoditas}`;
      if (kecamatan) params += `&kecamatan=${kecamatan}`;
      return fetchData(() => getListPekebunOnPendataan(params), setOnPendataanPekebuns);
    }, [fetchData]),
    fetchDetailPekebun: useCallback((id) =>
      fetchData(
        () => getDetailPekebun(id),
        null,
        (data) => dispatch(setDetailPekebun(data?.data?.data))
      ), [fetchData, dispatch]),
    fetchListKebun: useCallback((params) =>
      fetchData(
        () => getListKebun(params),
        setListKebun,
        (data) => {
          const listKebun = data?.data?.data?.results;
          dispatch(
            setListKebun(
              listKebun.map((data) => {
                return {
                  ...data,
                  peta: {
                    ...data?.peta,
                    geom: {
                      ...data?.peta?.geom,
                      coordinates: data?.peta?.geom?.coordinates?.[0]?.map((coord) => [coord[1], coord[0]]),
                    },
                    titik_koordinat: {
                      ...data?.peta?.titik_koordinat,
                      coordinates: [
                        data?.peta?.titik_koordinat?.coordinates[1],
                        data?.peta?.titik_koordinat?.coordinates[0],
                      ],
                    },
                  },
                };
              })
            )
          );
        }
      ), [fetchData, dispatch]),
    loading,
    error,
  };
};

export default usePekebuns;
