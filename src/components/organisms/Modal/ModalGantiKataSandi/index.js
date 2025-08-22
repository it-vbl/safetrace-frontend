import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import Modal from '@/components/molecules/Modal';

const ModalGantiKataSandi = ({ open, setOpen, onSubmit }) => {
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
    initialValues: {
      password: '',
      new_password: '',
      re_new_password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Kata sandi saat ini harus diisi'),
      new_password: Yup.string()
        .min(8, 'Kata sandi baru minimal 8 karakter')
        .required('Kata sandi baru harus diisi')
        .notOneOf(
          [Yup.ref('password')],
          'Kata sandi baru harus berbeda dari kata sandi saat ini'
        ),
      re_new_password: Yup.string()
        .oneOf([Yup.ref('new_password'), null], 'Kata sandi tidak sesuai')
        .required('Ulangi kata sandi baru harus diisi'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setApiErrors({});
        await onSubmit(values);
        setSubmitting(false);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'Gagal mengubah kata sandi';
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
      label="Ganti Kata Sandi"
    >
      <div className="flex flex-col gap-4 pt-4">
        <InputText
          label="Kata Sandi Saat Ini"
          name="password"
          type="password"
          placeholder="Masukkan kata sandi saat ini"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={allErrors}
          touched={touched}
          isRequired={true}
        />
        <InputText
          label="Kata Sandi Baru"
          name="new_password"
          type="password"
          placeholder="Masukkan kata sandi baru"
          value={values.new_password}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={allErrors}
          touched={touched}
          isRequired={true}
        />
        <InputText
          label="Ulangi Kata Sandi Baru"
          name="re_new_password"
          type="password"
          placeholder="Ulangi kata sandi baru"
          value={values.re_new_password}
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

export default ModalGantiKataSandi;
