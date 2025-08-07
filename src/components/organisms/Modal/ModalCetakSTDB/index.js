import { useFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import Modal from '@/components/molecules/Modal';

const ModalKonfirmasiPenerbitanSTDB = ({ open, setOpen, onSubmit, namaPekebun, jumlahKebun }) => {
  const { values, handleChange, handleBlur, handleSubmit, touched, errors, isSubmitting } = useFormik({
    initialValues: {
      nama_pejabat: '',
      jabatan: '',
    },
    validationSchema: Yup.object({
      nama_pejabat: Yup.string().required('Nama pejabat harus diisi'),
      jabatan: Yup.string().required('Jabatan harus diisi'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await onSubmit(values);
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleOnClose = () => setOpen(false);

  return (
    <Modal className='!w-[400px]' open={open} onclose={handleOnClose} label='CETAK STDB'>
      <div className='flex flex-col gap-4 pt-4'>
        <span className='text-[14px]'>
          Apakah Anda ingin mencatatkan penerbitan STDB atas nama <b>{namaPekebun}</b> dengan{' '}
          <b>jumlah kebun {jumlahKebun}</b>?
        </span>
        <InputText
          label='Nama Pejabat'
          name='nama_pejabat'
          placeholder='Contoh : Willy Tuliso'
          value={values.nama_pejabat}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
        />
        <InputText
          label='Jabatan'
          name='jabatan'
          placeholder='Contoh : Pejabat Tinggi'
          value={values.jabatan}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
        />
      </div>
      <div className='mt-4 flex flex-row justify-end gap-2'>
        <Button isLoading={isSubmitting} onClick={() => setOpen(false)} className='bg-red-500'>
          Batalkan
        </Button>
        <Button isLoading={isSubmitting} onClick={handleSubmit}>
          Ya, Cetak
        </Button>
      </div>
    </Modal>
  );
};

export default ModalKonfirmasiPenerbitanSTDB;
