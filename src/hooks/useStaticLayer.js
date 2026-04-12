import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { getPetaOverlayDetail } from '@/services/petaOverlay';

import {
  getStaticLayerData,
  getStaticLayerList,
} from '../services/staticLayer';
import {
  setStaticLayerDetail,
  setStaticLayerList,
} from '../store/slices/staticLayer';

const useStaticLayer = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [uploadedLoading, setUploadedLoading] = useState(false);

  const { staticLayerList, staticLayersDetail } = useSelector(
    (state) => state.staticLayer
  );

  const fetchData = useCallback(
    async (fetchFunction, setAction, callback = null) => {
      setLoading(true);
      try {
        const response = await fetchFunction();
        if (callback) {
          callback(response);
        } else {
          const references = response.data.data;
          dispatch(
            setAction(
              references.map((data) => ({
                ...data,
                value: data?.slug,
                label: data?.name,
              }))
            )
          );
        }
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const fetchStaticLayerList = useCallback(
    () => fetchData(getStaticLayerList, setStaticLayerList),
    [fetchData]
  );
  const fetchStaticLayersDetail = useCallback(
    (staticLayerType) =>
      fetchData(
        () => getStaticLayerData(staticLayerType),
        null,
        (response) => {
          try {
            const data = response.data?.data;
            const tempStaticLayersDetail = { ...staticLayersDetail };
            tempStaticLayersDetail[staticLayerType] = { active: true, ...data };
            dispatch(setStaticLayerDetail(tempStaticLayersDetail));
          } catch (err) {
            console.error(err);
            toast.error('Gagal memproses data layer statis');
          } finally {
          }
        }
      ),
    [fetchData, staticLayersDetail, dispatch]
  );

  const fetchUploadedStaticLayerDetail = useCallback(
    async (id) => {
      setUploadedLoading(true);
      try {
        const response = await getPetaOverlayDetail(id);
        const data = response.data?.data;
        const tempStaticLayersDetail = { ...staticLayersDetail };
        const layerData = {
          active: true,
          ...data,
          id: `uploaded_${id}`,
        };
        tempStaticLayersDetail[`uploaded_${id}`] = layerData;
        dispatch(setStaticLayerDetail(tempStaticLayersDetail));
        return layerData;
      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat detail layer statis');
        throw err;
      } finally {
        setUploadedLoading(false);
      }
    },
    [staticLayersDetail, dispatch]
  );

  useEffect(() => {
    return () => {
      dispatch(setStaticLayerDetail({}));
    };
  }, [dispatch]);

  return {
    loading,
    error,
    uploadedLoading,
    staticLayerList,
    staticLayersDetail,
    fetchStaticLayerList,
    fetchStaticLayersDetail,
    fetchUploadedStaticLayerDetail,
  };
};

export default useStaticLayer;
