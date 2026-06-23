import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { submitPemetaan, uploadShapefile } from '@/services/kebun';

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
      uploaded_file: null,
    },
    // Your provided onSubmit logic
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (values.uploaded_file) {
          submitCallback();
          const formData = new FormData();
          formData.append('petani_id', pekebunId || 1);
          formData.append('shapefile_upload', values.uploaded_file);

          const toastId = toast.loading('Mengunggah file pemetaan...');
          const response = await uploadShapefile(kebunId, formData);

          if (response?.data?.status === 'success' || response?.status === 200 || response?.status === 201) {
            toast.update(toastId, { render: 'Data peta berhasil ditambahkan', type: 'success', isLoading: false, autoClose: 3000 });
            successCallback(response?.data?.data?.id || kebunId);
          } else {
            throw new Error(response?.data?.message || 'Gagal mengunggah file pemetaan');
          }
          return;
        }

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
        toast.dismiss();
        toast.error(error?.response?.data?.message || error?.message || 'Gagal mengunggah file pemetaan');
        console.error(error);
      }
    },
    enableReinitialize: true,
  });

  return formik;
};

export default useFormPemetaan;
