'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import bannerLogin from '@/assets/images/login-bg.png';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import InputText from '@/components/molecules/InputText';
import { forgotPassword } from '@/services/auth';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

const LoginPage = () => {
  const router = useRouter();
  const schemaValidation = Yup.object().shape({
    email: Yup.string().email('Email tidak valid').required('Email harus diisi'),
  });
  const { handleSubmit, values, touched, errors, handleBlur, handleChange, isSubmitting } = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: schemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const res = await forgotPassword({ email: values.email });
        if (res.status == 200) {
          toast.success('OTP berhasil dikirim ke email anda');
          Cookies.set('otp_token', res.data.data.otp_token);
          Cookies.set('forgotPasswordEmail', values.email);
          router.push('/forgot-password/verify-otp');
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
        console.error(error);
      }
    },
  });

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <div className='flex hidden h-full w-2/3 flex-1 md:block'>
        <Image src={bannerLogin} alt='banner-login' className='h-full w-full object-cover' />
      </div>
      <div className='flex h-full w-[40vw] flex-col justify-center bg-bgColor p-12'>
        <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
          <Link href={'/login'}>
            <div className='flex flex-row items-center gap-3 font-bold'>
              <ArrowLeftIcon width={20} height={20} />
              <Paragraph level={3}>Kembali</Paragraph>
            </div>
          </Link>
          <Heading level={3}>Lupa Kata Sandi</Heading>
          <Paragraph level={3}>Silahkan ikuti langkah di bawah.</Paragraph>
          <InputText
            placeholder='Masukan email terdaftar'
            label={'Email'}
            type='email'
            name='email'
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
          />
          <Button className='w-full' type='submit' loading={isSubmitting}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
