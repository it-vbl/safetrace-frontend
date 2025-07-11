import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { submitJenisPupuk } from '@/services/kebun';

const useFormJenisPupuk = ({
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
      jenis_pupuk: data?.jenis_pupuk || '',
    },
    // Your provided validation schema
    validationSchema: Yup.object({
      jenis_pupuk: Yup.string().required('Jenis Pupuk is required'),
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
        const res = await submitJenisPupuk(payload);
        if (res.status == 200) {
          toast.success('Data jenis pupuk berhasil ditambahkan');
          successCallback(res?.data?.data?.id);
        }
      } catch (error) {
        failedCallback();
        toast.error(error?.response?.data?.message);
        console.log(error);
      }
    },
    enableReinitialize: true,
  });

  return formik;
};

export default useFormJenisPupuk;
