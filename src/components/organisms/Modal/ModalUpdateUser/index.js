import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import Modal from '@/components/molecules/Modal';
import Select from '@/components/molecules/Select';
import SelectMultiple from '@/components/molecules/SelectMultiple';
import useReferences from '@/hooks/useReferences';

const statusOptions = [
  { label: 'Aktif', value: 'true' },
  { label: 'Tidak Aktif', value: 'false' },
];

const ModalUpdateUser = ({ open, setOpen, onSubmit, userData }) => {
    const {userRoles} = useReferences()
  const { values, handleChange, handleBlur, handleSubmit, touched, errors, isSubmitting } = useFormik({
    initialValues: {
      id: userData?.id || '',
      nama: userData?.name || '',
      username: userData?.username || '',
      email: userData?.email || '',
      roles: userData?.roles || [],
      status: userData?.is_active === true ? "true" : "false",
    },
    validationSchema: Yup.object({
      nama: Yup.string().required('Nama harus diisi'),
      username: Yup.string().required('Username harus diisi'),
      email: Yup.string().email('Email tidak valid').required('Email harus diisi'),
      roles: Yup.array().min(1, 'Pilih minimal satu peran'),
      status: Yup.boolean().required('Status harus dipilih'),
    }),
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error(error);
      }
    },
    enableReinitialize: true,
  });

  const handleOnClose = () => setOpen(false);

  return (
    <Modal className='!w-[600px] !max-w-[600px]' open={open} onclose={handleOnClose} label='Edit Pengguna'>
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
          options={userRoles}
          value={values.roles}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isMulti={true}
          isRequired={true}
          selectClassName={`h-[32px] min-h-[32px]`}
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

export default ModalUpdateUser;

