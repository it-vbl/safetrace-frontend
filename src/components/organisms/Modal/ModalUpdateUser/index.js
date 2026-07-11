import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import Modal from '@/components/molecules/Modal';
import Select from '@/components/molecules/Select';
import SelectMultiple from '@/components/molecules/SelectMultiple';
import useReferences from '@/hooks/useReferences';
import { getListPabrik } from '@/services/penjualan';

const statusOptions = [
  { label: 'Aktif', value: 'true' },
  { label: 'Tidak Aktif', value: 'false' },
];

const ModalUpdateUser = ({ open, setOpen, onSubmit, userData }) => {
  const { userRoles, kelompokTani, fetchKelompokTani, fetchUserRoles } = useReferences();

  useEffect(() => {
    fetchKelompokTani();
    fetchUserRoles();
  }, [fetchKelompokTani, fetchUserRoles]);

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    errors,
    isSubmitting,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      id: userData?.id || '',
      nama: userData?.name || '',
      username: userData?.username || '',
      email: userData?.email || '',
      roles: userData?.roles ? userData.roles.map(String) : [],
      status: userData?.is_active === true ? 'true' : 'false',
      ketua_kelompok_tani: userData?.ketua_kelompok_tani || '',
      pabrik: userData?.pabrik?.id ? String(userData.pabrik.id) : '',
    },
    validationSchema: Yup.object({
      nama: Yup.string().required('Nama harus diisi'),
      username: Yup.string().required('Username harus diisi'),
      email: Yup.string()
        .email('Email tidak valid')
        .required('Email harus diisi'),
      roles: Yup.array().min(1, 'Pilih minimal satu peran'),
      status: Yup.boolean().required('Status harus dipilih'),
      ketua_kelompok_tani: Yup.string().when('roles', {
        is: (roles) => roles && roles.some((role) => role == '3'),
        then: (schema) => schema.required('Ketua Kelompok Tani harus diisi'),
        otherwise: (schema) => schema,
      }),
      pabrik: Yup.string().when('roles', {
        is: (roles) => roles && roles.some((role) => role == '6'),
        then: (schema) => schema.required('Pabrik harus diisi'),
        otherwise: (schema) => schema,
      }),
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

  // Reset form when modal is closed
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  // Check if selected roles include "ketua kelompok tani"
  const hasKetuaKelompokTaniRole =
    values.roles && values.roles.some((role) => role == '3');

  // Check if selected roles include "mitra pabrik"
  const hasMitraPabrikRole =
    values.roles && values.roles.some((role) => role == '6');

  const [pabrikOptions, setPabrikOptions] = useState([]);
  const [isLoadingPabrik, setIsLoadingPabrik] = useState(false);

  useEffect(() => {
    const fetchPabrik = async () => {
      setIsLoadingPabrik(true);
      try {
        const response = await getListPabrik();
        if (
          response?.status === 200 &&
          (response?.data?.status === 'success' || response?.data?.data)
        ) {
          const data =
            response?.data?.data?.results || response?.data?.results || [];
          const options = data.map((pabrik) => ({
            value: String(pabrik.id),
            label: pabrik.nama,
          }));
          setPabrikOptions(options);
        }
      } catch (error) {
        console.error('Error fetching pabrik list:', error);
      } finally {
        setIsLoadingPabrik(false);
      }
    };

    fetchPabrik();
  }, []);

  // Reset ketua_kelompok_tani field when role is deselected
  useEffect(() => {
    if (!hasKetuaKelompokTaniRole && values.ketua_kelompok_tani) {
      setFieldValue('ketua_kelompok_tani', '');
    }
  }, [hasKetuaKelompokTaniRole, values.ketua_kelompok_tani, setFieldValue]);

  // Reset pabrik field when role is deselected
  useEffect(() => {
    if (!hasMitraPabrikRole && values.pabrik) {
      setFieldValue('pabrik', '');
    }
  }, [hasMitraPabrikRole, values.pabrik, setFieldValue]);

  // Custom handler for Ketua Kelompok Tani to store the name instead of ID
  const handleKelompokTaniChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = kelompokTani.find(
      (option) => option.value === selectedValue
    );
    setFieldValue('ketua_kelompok_tani', selectedOption?.label || '');
  };

  const handleOnClose = () => setOpen(false);

  return (
    <Modal
      className="!w-[600px] !max-w-[600px]"
      open={open}
      onclose={handleOnClose}
      label="Edit Pengguna"
    >
      <div className="flex flex-col gap-4 pt-4 grid grid-cols-2 gap-4">
        <InputText
          label="Nama"
          name="nama"
          placeholder="Masukkan nama"
          value={values.nama}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
        />
        <InputText
          label="Username"
          name="username"
          placeholder="Masukkan username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
        />
        <InputText
          label="Email"
          name="email"
          placeholder="Masukkan email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
        />
        <SelectMultiple
          label="Roles"
          name="roles"
          placeholder="Pilih role"
          options={userRoles}
          value={values.roles}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
          selectClassName={`h-[42px] min-h-[42px]`}
        />
        {hasKetuaKelompokTaniRole && (
          <Select
            label="Ketua Kelompok Tani"
            name="ketua_kelompok_tani"
            placeholder="Pilih kelompok tani"
            options={kelompokTani}
            value={
              kelompokTani.find(
                (option) => option.label === values.ketua_kelompok_tani
              )?.value || ''
            }
            onChange={handleKelompokTaniChange}
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
            isRequired={true}
            selectClassName={`h-[42px] min-h-[42px]`}
          />
        )}
        {hasMitraPabrikRole && (
          <Select
            label="Pabrik"
            name="pabrik"
            placeholder="Pilih pabrik"
            options={pabrikOptions}
            value={values.pabrik}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
            isRequired={true}
            selectClassName={`h-[42px] min-h-[42px]`}
          />
        )}
        <Select
          label="Status"
          name="status"
          options={statusOptions}
          value={values.status}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
          selectClassName={`h-[42px] min-h-[42px]`}
        />
      </div>
      <div className="mt-4 flex flex-row justify-end gap-2">
        <Button
          isLoading={isSubmitting}
          onClick={handleOnClose}
          className="bg-tertiary"
        >
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
