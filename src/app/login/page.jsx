'use client';
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
import { login } from '@/services/auth';

import LogoSipekebun from '../../../public/keling-kumang-logo.png';

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
        const res = await login({
          username: values.username,
          password: values.password,
        });

        if (res.status === 200 && res?.data?.status === 'success') {
          Cookies.set('token', res?.data?.data?.access);
          Cookies.set('refreshToken', res?.data?.data?.refresh);
          Cookies.set('fullName', res?.data?.data?.full_name);
          Cookies.set('userId', res?.data?.data?.id.toString());
          Cookies.set('username', res?.data?.data?.username);
          Cookies.set('email', res?.data?.data?.email);
          Cookies.set('roles', JSON.stringify(res?.data?.data?.roles));

          toast.success('Login berhasil');
          router.push('/');
        } else {
          toast.error('Login gagal, silakan coba lagi');
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || 'Terjadi kesalahan saat login';
        toast.error(errorMessage);
        console.error('Login error:', error);
      } finally {
        setSubmitting(false);
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
            <div className="flex flex-col gap-4 text-center">
              <Heading level={1} className="font-normal">
                Selamat Datang
              </Heading>
              <Paragraph level={2} className="font-normal">
                Masukan email dan kata sandi untuk mulai menggunakan dashboard
                CU Keling Kumang.
              </Paragraph>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <InputText
                label={'Username'}
                name="username"
                placeholder="Masukan username"
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
