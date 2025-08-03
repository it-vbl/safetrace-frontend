import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import { getStaticLayerData, getStaticLayerList } from '../services/staticLayer';
import { setStaticLayerDetail, setStaticLayerList } from '../store/slices/staticLayer';

const useStaticLayer = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { staticLayerList, staticLayersDetail } = useSelector((state) => state.staticLayer);

  const fetchData = async (fetchFunction, setAction, callback = null) => {
    setLoading(true);
    try {
      const response = await fetchFunction();
      if (callback) {
        console.log('callback');
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
  };

  const fetchStaticLayerList = () => fetchData(getStaticLayerList, setStaticLayerList);
  const fetchStaticLayersDetail = (staticLayerType) =>
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
          console.log(err);
        }
      }
    );

  return {
    loading,
    error,
    staticLayerList,
    staticLayersDetail,
    fetchStaticLayerList,
    fetchStaticLayersDetail,
  };
};

export default useStaticLayer;
