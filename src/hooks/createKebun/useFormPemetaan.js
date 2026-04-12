import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { submitPemetaan } from '@/services/kebun';

const useFormPemetaan = ({
  pekebunId,
  kebunId,
  data,
  successCallback = (q) => {},
  submitCallback = () => {},
  failedCallback = () => {},
}) => {
  const formik = useFormik({
    // Use the data prop for initial values
    initialValues: {
      peta: data?.peta || [],
    },
    // Your provided onSubmit logic
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!values?.peta || values?.peta?.filter((coord) => coord !== null).length == 0) {
          toast.error('Peta tidak boleh kosong');
          return;
        } else if (values?.peta?.length < 3) {
          toast.error('Peta minimal 3 titik');
          return;
        }
        submitCallback();
        const coordinates = [values?.peta?.map((coord) => [parseFloat(coord.lng), parseFloat(coord.lat)])];
        if (
          coordinates?.[0]?.[0]?.[0] !== coordinates?.[0]?.[coordinates?.[0].length - 1]?.[0] &&
          coordinates?.[0]?.[0]?.[1] !== coordinates?.[0]?.[coordinates?.[0].length - 1]?.[1]
        ) {
          coordinates?.[0]?.push(coordinates?.[0]?.[0]);
        }
        const payload = {
          pekebun_id: pekebunId,
          id: kebunId,
          geom: {
            type: 'Polygon',
            coordinates,
          },
        };
        const res = await submitPemetaan(payload);
        if (res.status == 200) {
          toast.success('Data peta berhasil ditambahkan');
          successCallback(res?.data?.data?.id);
        }
      } catch (error) {
        failedCallback();
        toast.error(error?.response?.data?.message);
        console.error(error);
      }
    },
    enableReinitialize: true,
  });

  return formik;
};

export default useFormPemetaan;
