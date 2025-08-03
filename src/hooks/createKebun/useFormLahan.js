import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { editLahan, submitLahan } from '@/services/kebun';

const useFormLahan = ({
  pekebunId,
  data,
  successCallback = (q) => {},
  submitCallback = () => {},
  kebunId = 'null',
}) => {
  const formik = useFormik({
    // Use the data prop for initial values
    initialValues: {
      eks_plasma: data?.eks_plasma || '',
      status_lahan: data?.status_lahan_label || '',
      luas_lahan: data?.luas_lahan || '',
      no_dokumen: data?.no_dokumen || '',
      kecamatan: data?.kecamatan || '',
      desa: data?.desa || '',
    },
    // Your provided validation schema
    validationSchema: Yup.object({
      eks_plasma: Yup.string().required('Eks Plasma is required'),
      status_lahan: Yup.string().required('Status Lahan is required'),
      luas_lahan: Yup.number().required('Luas Lahan is required').positive('Must be positive'),
      no_dokumen: Yup.string().required('No Dokumen is required'),
      kecamatan: Yup.string().required('Kecamatan is required'),
      desa: Yup.string().required('Desa is required'),
    }),
    // Your provided onSubmit logic
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log('Submitting Lahan', values);
        submitCallback();
        const payload = {
          ...values,
          pekebun_id: pekebunId,
          id: kebunId,
        };
        if (kebunId) {
          const res = await editLahan(payload);
          if (res.status == 200) {
            toast.success('Data lahan berhasil ditambahkan');
            successCallback(res?.data?.data?.id);
          }
        } else {
          const res = await submitLahan(payload);
          if (res.status == 200) {
            toast.success('Data lahan berhasil ditambahkan');
            successCallback(res?.data?.data?.id);
          }
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
        console.log(error);
      }
    },
  });

  return formik;
};

export default useFormLahan;
