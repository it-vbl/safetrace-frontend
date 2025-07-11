import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { submitMitraPenjualan } from '@/services/kebun';

const useFormMitraPenjualan = ({
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
      mitra_penjualan: data?.mitra_penjualan || '',
    },
    // Your provided validation schema
    validationSchema: Yup.object({
      mitra_penjualan: Yup.string().required('Mitra Penjualan is required'),
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
        const res = await submitMitraPenjualan(payload);
        if (res.status == 200) {
          toast.success('Data mitra penjualan berhasil ditambahkan');
          successCallback(res?.data?.data?.id);
        }
      } catch (error) {
        failedCallback();
        toast.error(error?.response?.data?.message);
        console.log(error);
      }
    },
  });

  return formik;
};

export default useFormMitraPenjualan;
