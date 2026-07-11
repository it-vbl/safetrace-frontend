import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import Modal from '@/components/molecules/Modal';
import Select from '@/components/molecules/Select';

const ModalCreateLembagaTani = ({ open, setOpen, onSubmit, onCancel }) => {
  const handleOnClose = () => setOpen(false);

  const handleOnAdd = (data) => {
    onSubmit(data);
    setOpen(false);
  };

  const { values, handleChange, handleBlur, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      nama: '',
      komoditas: '',
      no_simluhtan: '',
      alamat: '',
    },
    validationSchema: Yup.object({
      nama: Yup.string().required('Nama Lembaga Tani harus diisi'),
      komoditas: Yup.string().required('Komoditas harus diisi'),
      no_simluhtan: Yup.string().required('No Dalam Simluhtan harus diisi'),
      alamat: Yup.string().required('Alamat Lembaga Tani harus diisi'),
    }),
    onSubmit: (values) => {
      handleOnAdd(values);
    },
  });


  return (
    <Modal
      open={open}
      onclose={handleOnClose}
      label='Tambah Lembaga Tani'
      footer={
        <div className='flex justify-end gap-2'>
          <Button variant='secondary' onClick={handleOnClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>Simpan</Button>
        </div>
      }
    >
      <div className='grid grid-cols-2 gap-6 border-b border-dashed border-b-gray-300 py-4'>
        <InputText
          isRequired={true}
          label='Nama Lembaga Tani'
          placeholder='Masukan Nama'
          className='w-full'
          name='nama'
          value={values.nama}
          onChange={handleChange}
          errors={errors}
          touched={touched}
        />
        <Select
          isRequired={true}
          selectClassName='!min-h-[30px] h-[30px]'
          label='Komoditas'
          placeholder='Pilih Komoditas'
          options={[]}
          name='komoditas'
          value={values.komoditas}
          onChange={handleChange}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className='grid grid-cols-2 gap-6 py-4'>
        <InputText
          isRequired={true}
          label='No Dalam Simluhtan'
          placeholder='Masukan Nama'
          className='w-full'
          name='no_simluhtan'
          value={values.no_simluhtan}
          onChange={handleChange}
          errors={errors}
          touched={touched}
        />
        <InputText
          isRequired={true}
          label='Alamat Lembaga Tani'
          placeholder='Masukan Alamat Lembaga Tani'
          className='w-full'
          name='alamat'
          value={values.alamat}
          onChange={handleChange}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className='mt-4 flex flex-row justify-end gap-2'>
        <Button onClick={() => setOpen(false)} className='bg-tertiary'>
          Batalkan
        </Button>
        <Button onClick={handleSubmit}>Simpan</Button>
      </div>
    </Modal>
  );
};

export default ModalCreateLembagaTani;
