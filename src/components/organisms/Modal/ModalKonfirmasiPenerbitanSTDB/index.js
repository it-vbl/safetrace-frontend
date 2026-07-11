import { useFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import DatePicker from '@/components/molecules/DatePicker';
import InputText from '@/components/molecules/InputText';
import Modal from '@/components/molecules/Modal';

const ModalKonfirmasiPenerbitanSTDB = ({ open, setOpen, onSubmit, namaPekebun, jumlahKebun }) => {
  const { values, handleChange, handleBlur, handleSubmit, touched, errors, isSubmitting } = useFormik({
    initialValues: {
      no_stdb: '',
      tanggal_terbit: '',
    },
    validationSchema: Yup.object({
      no_stdb: Yup.string().required('Nomor STDB harus diisi'),
      tanggal_terbit: Yup.date().required('Tanggal penerbitan harus diisi'),
    }),
    onSubmit: async (values) => {
      try {
        const formattedDate = moment(values.tanggal_terbit).format('DD/MM/YYYY');
        const res = await onSubmit({ ...values, tanggal_terbit: formattedDate });
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleOnClose = () => setOpen(false);

  return (
    <Modal className='!w-[400px]' open={open} onclose={handleOnClose} label='PENCATATAN PENERBITAN STDB'>
      <div className='flex flex-col gap-4 pt-4'>
        <span className='text-[14px]'>
          Apakah Anda ingin mencatatkan penerbitan STDB atas nama <b>{namaPekebun}</b> dengan{' '}
          <b>jumlah kebun {jumlahKebun}</b>?
        </span>
        <InputText
          label='Nomor STDB'
          name='no_stdb'
          placeholder='Contoh : STDB/NAMAKOTA/01012025/001'
          value={values.no_stdb}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
        />
        <DatePicker
          label='Tanggal Penerbitan'
          name='tanggal_terbit'
          placeholder='Pilih tanggal penerbitan'
          value={values.tanggal_terbit}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          requiredField={true}
        />
      </div>
      <div className='mt-4 flex flex-row justify-end gap-2'>
        <Button isLoading={isSubmitting} onClick={() => setOpen(false)} className='bg-tertiary'>
          Batalkan
        </Button>
        <Button isLoading={isSubmitting} onClick={handleSubmit}>
          Ya, Terbitkan
        </Button>
      </div>
    </Modal>
  );
};

export default ModalKonfirmasiPenerbitanSTDB;
