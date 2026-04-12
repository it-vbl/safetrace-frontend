import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { createKomoditas, editKomoditas } from '@/services/kebun';

const useFormKomoditas = ({ kebunId, data, successCallback = (q) => {}, submitCallback = () => {} }) => {
  const formik = useFormik({
    // Use the data prop for initial values
    initialValues: {
      nama: data?.nama || '',
      tahun_tanam: data?.tahun_tanam || '',
      tahun_sebelum_peremajaan: data?.tahun_sebelum_peremajaan || '',
      asal_benih: data?.asal_benih || '',
      jenis_lahan: data?.jenis_lahan || '',
      jumlah_tegakan_pohon: data?.jumlah_tegakan_pohon || '',
      produksi_per_tahun: data?.produksi_per_tahun || '',
    },
    // Your provided validation schema
    validationSchema: Yup.object({
      nama: Yup.string().required('Nama is required'),
      tahun_tanam: Yup.number().required('Tahun Tanam is required').positive('Must be positive'),
      tahun_sebelum_peremajaan: Yup.number()
        .required('Tahun Sebelum Peremajaan is required')
        .positive('Must be positive'),
      asal_benih: Yup.string().required('Asal Benih is required'),
      jenis_lahan: Yup.string().required('Jenis Lahan is required'),
      jumlah_tegakan_pohon: Yup.number().required('Jumlah Tegakan Pohon is required').positive('Must be positive'),
      produksi_per_tahun: Yup.number().required('Produksi Per Tahun is required').positive('Must be positive'),
    }),
    // Your provided onSubmit logic
    onSubmit: async (values, { setSubmitting }) => {
      try {
        submitCallback();
        const payload = {
          kebun_id: kebunId,
          ...values,
        };
        if (values.id) {
          const res = await editKomoditas(payload);
          if (res.status == 200) {
            toast.success('Data komoditas berhasil ditambahkan');
            successCallback(res?.data?.data?.kebun);
          }
        } else {
          const res = await createKomoditas(payload);
          if (res.status == 200) {
            toast.success('Data komoditas berhasil ditambahkan');
            successCallback(res?.data?.data?.kebun);
          }
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
        console.error(error);
      }
    },
  });

  return formik;
};

export default useFormKomoditas;
