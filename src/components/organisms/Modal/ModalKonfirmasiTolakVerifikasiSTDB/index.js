import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Modal from '@/components/molecules/Modal';
import Select from '@/components/molecules/Select';

const optionAlasan = [
  { label: 'Masuk kawasan hutan lindung', value: 'Masuk kawasan hutan lindung' },
  { label: 'Masuk kawasan hutan produksi', value: 'Masuk kawasan hutan produksi' },
  { label: 'Masuk kawasan hutan konservasi', value: 'Masuk kawasan hutan konservasi' },
  { label: 'Tumpang tindih dengan HGU', value: 'Tumpang tindih dengan HGU' },
  { label: 'Tumpang tindih dengan kebun lain', value: 'Tumpang tindih dengan kebun lain' },
  { label: 'Luas lahan lebih dari 25 Ha', value: 'Luas lahan lebih dari 25 Ha' },
  { label: 'Peta tidak valid', value: 'Peta tidak valid' },
  { label: 'Lainnya', value: 'Lainnya' },
];

const ModalKonfirmasiTolakVerifikasiSTDB = ({ open, setOpen, onSubmit, namaPekebun, jumlahKebun }) => {
  const handleOnClose = () => setOpen(false);

  const handleOnAdd = (data) => {
    onSubmit(data);
    setOpen(false);
  };

  const { values, handleChange, handleBlur, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      alasan: '',
    },
    validationSchema: Yup.object({
      alasan: Yup.string().required('Komoditas harus diisi'),
    }),
    onSubmit: (values) => {
      handleOnAdd(values);
    },
  });

  return (
    <Modal className='!w-[400px]' open={open} onclose={handleOnClose} label='STDB TIDAK DITERBITKAN'>
      <div className='flex flex-col gap-4 pt-4'>
        <span className='text-[14px]'>
          Apakah Anda tidak ingin menerbitkan STDB atas nama <b>{namaPekebun}</b> dengan{' '}
          <b>jumlah kebun {jumlahKebun}</b>?
        </span>
        <Select
          isRequired={true}
          selectClassName='!min-h-[30px] h-[30px]'
          label='Alasan Penolakan'
          placeholder='Pilih alasan penolakan'
          options={optionAlasan}
          name='alasan'
          value={values.alasan}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className='mt-4 flex flex-row justify-end gap-2'>
        <Button onClick={() => setOpen(false)} className='bg-red-500'>
          Batalkan
        </Button>
        <Button onClick={handleSubmit}>Ya, Tidak Terbit</Button>
      </div>
    </Modal>
  );
};

export default ModalKonfirmasiTolakVerifikasiSTDB;
