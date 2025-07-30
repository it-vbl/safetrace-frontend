'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';

import bannerLogin from '@/assets/images/login-bg.png';
import { forgotPasswordReset } from '@/services/auth';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import Heading from '@/components/atoms/Typography/Heading';
import Cookies from 'js-cookie';
import Link from 'next/link';

const ResetPasswordPage = () => {
  const router = useRouter();
  const otpToken = Cookies.get('otp_token');
  const otp = Cookies.get('otp');

  const { handleSubmit, values, errors, touched, handleBlur, handleChange, isSubmitting } = useFormik({
    initialValues: {
      password: '',
      repassword: '',
    },
    validationSchema: Yup.object().shape({
      password: Yup.string().required('Kata sandi harus diisi'),
      repassword: Yup.string().oneOf([Yup.ref('password'), null], 'Kata sandi tidak cocok'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const res = await forgotPasswordReset({ ...values, otp_token: otpToken, otp });
        if (res.status === 200) {
          router.push('/login');
          toast.success('Kata sandi berhasil diubah');
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='flex hidden h-full w-2/3 flex-1 md:block'>
        <Image src={bannerLogin} alt='banner-login' className='h-full w-full object-cover' />
      </div>
      <div className='flex h-full w-[40vw] flex-col justify-center bg-bgColor p-12'>
        <form onSubmit={handleSubmit} className='mt-8 space-y-[40px]'>
          <Link href={'/login'}>
            <div className='flex flex-row items-center gap-3 font-bold'>
              <ArrowLeftIcon width={20} height={20} />
              <Paragraph level={3}>Kembali</Paragraph>
            </div>
          </Link>
          <div>
            <Heading level={3}>Kata Sandi Baru</Heading>
            <Paragraph level={3}>Gunakan kata sandi terbaru.</Paragraph>
          </div>
          <InputText
            label='Kata Sandi'
            type='password'
            name='password'
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
            placeholder='Masukan kata sandi baru'
          />
          <InputText
            label='Ulang Kata Sandi'
            type='password'
            name='repassword'
            value={values.repassword}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
            placeholder='Masukan ulang kata sandi baru '
          />
          <Button type='submit' isLoading={isSubmitting}>
            Ubah Kata Sandi
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
