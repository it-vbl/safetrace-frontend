import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import Modal from '@/components/molecules/Modal';
import SelectMultiple from '@/components/molecules/SelectMultiple';

const rolesOptions = [
  { label: 'Admin', value: '1' },
  { label: 'Tim Pendataan', value: '2' },
  { label: 'Tim Verifikasi', value: '3' },
  { label: 'Tim Penerbitan', value: '4' },
  { label: 'Tim Monitoring', value: '5' },
];

const statusOptions = [
  { label: 'Aktif', value: '1' },
  { label: 'Tidak Aktif', value: '0' },
];

const ModalCreateUser = ({ open, setOpen, onSubmit }) => {
  const { values, handleChange, handleBlur, handleSubmit, touched, errors, isSubmitting } = useFormik({
    initialValues: {
      nama: '',
      username: '',
      email: '',
      roles: [],
      password: '',
      confirmPassword: '',
      status: '1',
    },
    validationSchema: Yup.object({
      nama: Yup.string().required('Nama harus diisi'),
      username: Yup.string().required('Username harus diisi'),
      email: Yup.string().email('Email tidak valid').required('Email harus diisi'),
      roles: Yup.array().min(1, 'Pilih minimal satu peran'),
      password: Yup.string().required('Kata sandi harus diisi'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Kata sandi tidak sesuai')
        .required('Ulangi kata sandi harus diisi'),
      status: Yup.string().required('Status harus dipilih'),
    }),
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleOnClose = () => setOpen(false);

  return (
    <Modal className='!w-[600px] !max-w-[600px]' open={open} onclose={handleOnClose} label='Tambah Pengguna'>
      <div className='flex flex-col gap-4 pt-4 grid grid-cols-2 gap-4'>
        <InputText
          label='Nama'
          name='nama'
          placeholder='Masukkan nama'
          value={values.nama}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
        />
        <InputText
          label='Username'
          name='username'
          placeholder='Masukkan username'
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
        />
        <InputText
          label='Email'
          name='email'
          placeholder='Masukkan email'
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
        />
        <SelectMultiple
          label='Roles'
          name='roles'
          placeholder='Pilih role'
          options={rolesOptions}
          value={values.roles}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isMulti={true}
          isRequired={true}
          selectClassName={`h-[32px] min-h-[32px]`}
        />
        <InputText
          label='Kata Sandi'
          name='password'
          type='password'
          placeholder='Masukkan kata sandi'
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
        />
        <InputText
          label='Ulangi Kata Sandi'
          name='confirmPassword'
          type='password'
          placeholder='Ulangi kata sandi'
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
        />
        <Select
          label='Status'
          name='status'
          options={statusOptions}
          value={values.status}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
          selectClassName={`h-[32px] min-h-[32px]`}
        />
      </div>
      <div className='mt-4 flex flex-row justify-end gap-2'>
        <Button isLoading={isSubmitting} onClick={handleOnClose} className='bg-red-500'>
          Batalkan
        </Button>
        <Button isLoading={isSubmitting} onClick={handleSubmit}>
          Simpan
        </Button>
      </div>
    </Modal>
  );
};

export default ModalCreateUser;
