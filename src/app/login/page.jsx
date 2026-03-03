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
import ImagePartnership from '../../../public/partnership.png';

const LoginPage = () => {
  const router = useRouter();

  const schemaValidation = Yup.object().shape({
    username: Yup.string().required('Email harus diisi'),
    password: Yup.string().required('Kata sandi harus diisi'),
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
          const data = res?.data?.data || {};
          const roles = Array.isArray(data?.roles) ? data.roles : [];

          Cookies.set('token', data?.access);
          Cookies.set('refreshToken', data?.refresh);
          Cookies.set('fullName', data?.full_name);
          Cookies.set('userId', data?.id?.toString());
          Cookies.set('username', data?.username);
          Cookies.set('email', data?.email);
          Cookies.set('roles', JSON.stringify(roles));
          Cookies.set('ketua_kelompok_tani', data?.ketua_kelompok_tani || '');

          toast.success('Login berhasil');

          // Normalize roles to numbers for comparison
          const normalizedRoles = roles
            .map((r) => (typeof r === 'number' ? r : parseInt(r, 10)))
            .filter((r) => !Number.isNaN(r));

          const onlyRole2 =
            normalizedRoles.length === 1 && normalizedRoles[0] === 2;

          if (onlyRole2) {
            router.push('/kabar-tani/kontak');
          } else {
            router.push('/');
          }
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
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center sm:mb-4">
            <Image src={LogoSipekebun} width="auto" height={42} alt="logo" />
          </div>

          {/* Welcome Card */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white px-6 py-8 shadow-sm sm:px-10">
            <div className="flex flex-col gap-2 text-center sm:gap-3">
              <Heading
                level={1}
                className="font-serif text-2xl font-normal sm:text-3xl"
              >
                Selamat Datang
              </Heading>
              <Paragraph
                level={2}
                className="text-sm font-normal text-gray-700 sm:text-base"
              >
                Masukan email dan kata sandi untuk mulai menggunakan dashboard
                CU Keling Kumang.
              </Paragraph>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5 sm:mt-8">
              <InputText
                label={'Email'}
                name="username"
                placeholder="Masukan email"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
              <InputText
                label="Kata Sandi"
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
                Masuk
              </Button>
              <div className="mt-4 sm:mt-6"></div>

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

          <div className="mb-4 mt-8 flex justify-center px-4 sm:mb-6 sm:mt-4">
            <Image
              src={ImagePartnership}
              alt="partnership"
              className="max-h-12 w-full object-contain sm:max-h-14"
            />
          </div>

          <div className="text-center text-xs font-medium text-gray-600">
            © 2026 CU Keling Kumang. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
