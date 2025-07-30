import { useState, useEffect } from 'react';
import { getDetailPekebun, getListKebun, getListPekebun, getListPekebunOnPendataan } from '../services/pekebun';
import { useSelector, useDispatch } from 'react-redux';
import { setDetailPekebun, setListKebun, setOnPendataanPekebuns, setPekebuns } from '@/store/slices/pekebun';

const usePekebuns = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPekebun, setTotalPekebun] = useState(0);

  const dispatch = useDispatch();

  const { pekebuns, onPendataanPekebuns, detailPekebun, listKebun } = useSelector((state) => state.pekebun);

  const fetchData = async (action, setDataCallback, setterCallback) => {
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
  };

  return {
    pekebuns,
    totalPekebun,
    onPendataanPekebuns,
    detailPekebun,
    listKebun,
    fetchPekebun: ({ page_size = 10, page = 1, search = '' } = {}) => {
      const params = `page_size=${page_size}&page=${page}&search=${search}`;
      return fetchData(() => getListPekebun(params), setPekebuns);
    },
    fetchPekebunOnPendataan: ({ page_size = 10, page = 1, search = '' } = {}) => {
      const params = `page_size=${page_size}&page=${page}&search=${search}`;
      return fetchData(() => getListPekebunOnPendataan(params), setOnPendataanPekebuns);
    },
    fetchDetailPekebun: (id) =>
      fetchData(
        () => getDetailPekebun(id),
        null,
        (data) => dispatch(setDetailPekebun(data?.data?.data))
      ),
    fetchListKebun: (params) =>
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
      ),
    loading,
    error,
  };
};

export default usePekebuns;
