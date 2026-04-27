import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { submitPolaTanam } from '@/services/kebun';

const useFormPolaTanam = ({
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
      pola_tanam: data?.pola_tanam || '',
    },
    // Your provided validation schema
    validationSchema: Yup.object({
      pola_tanam: Yup.string().required('Pola Tanam is required'),
    }),
    // Your provided onSubmit logic
    onSubmit: async (values, { setSubmitting }) => {
      try {
        submitCallback();
        const payload = {
          ...values,
          pekebun_id: pekebunId,
          id: kebunId,
        };
        const res = await submitPolaTanam(payload);
        if (res.status == 200) {
          toast.success('Data pola tanam berhasil ditambahkan');
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

export default useFormPolaTanam;
