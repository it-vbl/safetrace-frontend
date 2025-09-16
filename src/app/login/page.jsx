'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import bannerLogin from '@/assets/images/login-bg.png';
import LogoSipekebun from '../../../public/keling-kumang-logo.png';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import Button from '@/components/atoms/Button';
import LogoLembaga from '@/components/atoms/LogoLembaga';
import SipekebunLogo from '@/components/atoms/SipekebunLogo';
import InputText from '@/components/molecules/InputText';
import { login } from '@/services/auth';

const LoginPage = () => {
  const router = useRouter();

  const schemaValidation = Yup.object().shape({
    email: Yup.string()
      .email('Email tidak valid')
      .required('Email harus diisi'),
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
      email: '',
      password: '',
    },
    validationSchema: schemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const res = await login({
          username: values.email,
          password: values.password,
        });
        if (res.status == 200) {
          Cookies.set('token', res?.data?.data?.access);
          Cookies.set('refreshToken', res?.data?.data?.refresh);
          Cookies.set('fullName', res?.data?.data?.full_name);
          Cookies.set('userId', res?.data?.data?.id);
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
    <div className="flex h-screen w-screen bg-white">
      <div className="relative hidden py-8 pl-8 lg:flex lg:w-[60vw]">
        <Image
          src={bannerLogin}
          alt="banner-login"
          className="h-full w-full rounded-xl object-cover"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full items-center justify-center px-8 lg:w-1/2">
        <div className="w-full max-w-xl">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center">
            <Image src={LogoSipekebun} width="auto" height={42} alt="logo" />
          </div>

          {/* Welcome Card */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4">
              <Heading level={2} className="text-center text-lg font-normal">
                Selamat Datang
              </Heading>
              <Paragraph
                level={3}
                className="text-center text-sm font-medium text-gray-600"
              >
                Masukan email dan kata sandi untuk mulai menggunakan dashboard
                CU Keling Kumang.
              </Paragraph>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <InputText
                label={'Email'}
                type="email"
                name="email"
                placeholder="Masukan email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
              <InputText
                label="Password"
                type="password"
                name="password"
                placeholder="Masukan kata sandi"
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
              <div className="mt-6"></div>

              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className=" text-sm font-bold text-primary underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
            </form>
          </div>

          <div className="text-center text-xs text-gray-500">
            © 2025 CU Keling Kumang. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
