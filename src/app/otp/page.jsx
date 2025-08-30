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
import LogoLembaga from '@/components/atoms/LogoLembaga';
import SipekebunLogo from '@/components/atoms/SipekebunLogo';
import InputText from '@/components/molecules/InputText';
import { login } from '@/services/auth';

const LoginPage = () => {
  const router = useRouter();
  const schemaValidation = Yup.object().shape({
    username: Yup.string().required('Username harus diisi'),
    password: Yup.string().required('Password harus diisi'),
  });
  const {
    handleSubmit,
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    isSubmitting,
  } = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: schemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const res = await login(values);
        if (res.status == 200) {
          Cookies.set('token', res?.data?.data?.access);
          Cookies.set('refreshToken', res?.data?.data?.refresh);
          router.push('/');
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
    <div className="flex h-screen items-center justify-center">
      <div className="flex hidden h-full w-2/3 flex-1 md:block">
        <Image
          src={bannerLogin}
          alt="banner-login"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex h-full w-[40vw] flex-col justify-center p-12">
        <div className="flex flex-row justify-between">
          <SipekebunLogo className={'text-[20px]'} />
          <LogoLembaga size={42} />
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <InputText
            label={'Username'}
            type="email"
            name="username"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
          />
          <InputText
            label="Password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
          />
          <Button
            isLoading={isSubmitting}
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            Login
          </Button>
          <div className="flex items-center justify-center">
            <Link href="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
