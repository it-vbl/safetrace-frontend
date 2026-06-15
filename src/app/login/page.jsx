'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import InputText from '@/components/molecules/InputText';
import { hasPermission, isViewOnlyRole } from '@/libs/permissions';
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
          Cookies.set('pabrik', data?.pabrik?.nama || '');
          Cookies.set('pabrik_id', data?.pabrik?.id?.toString() || '');

          toast.success('Login berhasil');

          // Normalize roles to numbers for comparison
          const normalizedRoles = roles
            .map((r) => {
              if (r === null || r === undefined) return null;
              let val = r;
              if (typeof r === 'object' && 'id' in r) {
                val = r.id;
              }
              return typeof val === 'number' ? val : parseInt(val, 10);
            })
            .filter((r) => r !== null && !Number.isNaN(r));

          const onlyRole2 =
            normalizedRoles.length === 1 && normalizedRoles[0] === 2;

          if (onlyRole2) {
            router.push('/kabar-tani/kontak');
          } else if (isViewOnlyRole(normalizedRoles) && !hasPermission(normalizedRoles, 'peta.dashboard')) {
            router.push('/traceability/petani');
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
    <div className="flex h-screen w-full bg-white">
      <div className="relative max-lg:hidden py-8 pl-8 lg:flex lg:w-[60%] lg:shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/login-bg.png"
          alt="banner-login"
          className="h-full w-full rounded-xl object-cover"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full items-center justify-center px-8 lg:w-[40%] lg:shrink-0">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="m-4 flex items-center justify-center">
            <Image src={LogoSipekebun} alt="logo" style={{ height: '38px', width: 'auto' }} />
          </div>

          {/* Welcome Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:px-10">
            <div className="flex flex-col gap-2 text-center">
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
                Keling Kumang.
              </Paragraph>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-6">
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

          <div className="m-4 flex justify-center px-4">
            <Image src={ImagePartnership} alt="logo" style={{ height: '52px', width: 'auto' }} />
          </div>

          <div className="text-center text-xs font-medium text-gray-600">
            © 2026 Keling Kumang. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
