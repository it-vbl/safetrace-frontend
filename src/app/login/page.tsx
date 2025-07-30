'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';

import bannerLogin from '@/assets/images/login-bg.png';
import SipekebunLogo from '@/components/atoms/SipekebunLogo';
import LogoLembaga from '@/components/atoms/LogoLembaga';
import { login } from '@/services/auth';
import Cookies from 'js-cookie';

import * as Yup from 'yup';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const router = useRouter();
  const schemaValidation = Yup.object().shape({
    email: Yup.string().email('Email tidak valid').required('Email harus diisi'),
    password: Yup.string().required('Password harus diisi'),
  });
  const { handleSubmit, values, touched, errors, handleBlur, handleChange, isSubmitting } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: schemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const res = await login({ username: values.email, password: values.password });
        if (res.status == 200) {
          Cookies.set('token', res?.data?.data?.access);
          Cookies.set('refreshToken', res?.data?.data?.refresh);
          router.push('/mapview');
          toast.success('Login berhasil');
        } else {
          router;
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
        console.error(error);
      }
    },
  });

  return (
    <div className='flex h-screen w-screen items-center justify-center '>
      <div className='flex hidden h-full w-2/3 flex-1 md:block'>
        <Image src={bannerLogin} alt='banner-login' className='h-full w-full object-cover' />
      </div>
      <div className='flex h-full w-[40vw] flex-col justify-center bg-bgColor p-12'>
        <div className='flex flex-row justify-between'>
          <SipekebunLogo className={'text-[20px]'} />
          <LogoLembaga size={42} />
        </div>
        <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
          <InputText
            label={'Email'}
            type='email'
            name='email'
            placeholder='Masukan email'
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
          />
          <InputText
            label='Password'
            type='password'
            name='password'
            placeholder='Masukan kata sandi'
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
          />
          <Button isLoading={isSubmitting} type='submit' className='w-full' disabled={isSubmitting}>
            Login
          </Button>
          <div className='mt-6'>
            <Link href='/forgot-password' className=' text-sm font-bold text-primary underline'>
              Lupa kata sandi?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
