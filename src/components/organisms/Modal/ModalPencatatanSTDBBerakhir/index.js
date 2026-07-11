import { useFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import DatePicker from '@/components/molecules/DatePicker';
import InputText from '@/components/molecules/InputText';
import Modal from '@/components/molecules/Modal';

const ModalPencatatanSTDBBerakhir = ({ open, setOpen, onSubmit, namaPekebun, jumlahKebun }) => {
  const { values, handleChange, handleBlur, handleSubmit, touched, errors, isSubmitting } = useFormik({
    initialValues: {
      alasan: '',
      tanggal_berakhir: '',
    },
    validationSchema: Yup.object({
      alasan: Yup.string().required('Alasan harus diisi'),
      tanggal_berakhir: Yup.date().required('Tanggal berakhir harus diisi'),
    }),
    onSubmit: async (values) => {
      try {
        const formattedDate = moment(values.tanggal_berakhir).format('DD/MM/YYYY');
        const res = await onSubmit({ ...values, tanggal_berakhir: formattedDate });
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleOnClose = () => setOpen(false);

  return (
    <Modal className='!w-[400px]' open={open} onclose={handleOnClose} label='PENCATATAN STDB BERAKHIR'>
      <div className='flex flex-col gap-4 pt-4'>
        <span className='text-[14px]'>
          Apakah Anda ingin mencatatkan STDB berakhir atas nama <b>{namaPekebun}</b> dengan{' '}
          <b>jumlah kebun {jumlahKebun}</b>?
        </span>
        <InputText
          label='Alasan'
          name='alasan'
          placeholder='Contoh : Kebun tidak valid'
          value={values.alasan}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
        />
        <DatePicker
          label='Tanggal Berakhir'
          name='tanggal_berakhir'
          placeholder='Pilih tanggal berakhir'
          value={values.tanggal_berakhir}
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
          Ya, Catat STDB Berakhir
        </Button>
      </div>
    </Modal>
  );
};

export default ModalPencatatanSTDBBerakhir;
