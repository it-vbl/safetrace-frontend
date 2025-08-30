import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import Modal from '@/components/molecules/Modal';

const ModalUbahDataPengguna = ({
  open,
  setOpen,
  onSubmit,
  initialValues = {},
}) => {
  const [apiErrors, setApiErrors] = useState({});

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    errors,
    isSubmitting,
    setFieldError,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: initialValues.name || '',
      username: initialValues.username || '',
      email: initialValues.email || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Nama harus diisi'),
      username: Yup.string().required('Username harus diisi'),
      email: Yup.string()
        .email('Email tidak valid')
        .required('Email harus diisi'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setApiErrors({});
        await onSubmit(values);
        setSubmitting(false);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'Gagal mengubah data pengguna';
        toast.error(errorMessage);

        // Handle API validation errors
        if (error.response?.status === 400 && error.response?.data?.errors) {
          const apiErrors = error.response.data.errors;
          setApiErrors(apiErrors);

          // Set field errors for formik
          Object.keys(apiErrors).forEach((field) => {
            if (apiErrors[field] && apiErrors[field].length > 0) {
              setFieldError(field, apiErrors[field][0]);
            }
          });
        }
        setSubmitting(false);
      }
    },
  });

  const handleOnClose = () => {
    setApiErrors({});
    resetForm();
    setOpen(false);
  };

  // Combine formik errors with API errors
  const allErrors = { ...errors, ...apiErrors };

  return (
    <Modal
      className="!w-[500px] !max-w-[500px] !normal-case !font-normal"
      open={open}
      onclose={handleOnClose}
      label="Ubah Data Pengguna"
    >
      <div className="flex flex-col gap-4 pt-4">
        <InputText
          label="Nama"
          name="name"
          placeholder="Masukkan nama"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={allErrors}
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
          errors={allErrors}
          touched={touched}
          isRequired={true}
        />
        <InputText
          label="Email"
          name="email"
          type="email"
          placeholder="Masukkan email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={allErrors}
          touched={touched}
          isRequired={true}
        />
      </div>
      <div className="mt-4 flex flex-row justify-end gap-2">
        <Button
          isLoading={isSubmitting}
          onClick={handleOnClose}
          className="bg-red-500"
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

export default ModalUbahDataPengguna;
