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
import { forgotPassword } from '@/services/auth';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

import LogoSipekebun from '../../../public/keling-kumang-logo.png';

const LoginPage = () => {
  const router = useRouter();
  const schemaValidation = Yup.object().shape({
    email: Yup.string()
      .email('Email tidak valid')
      .required('Email harus diisi'),
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
    <div className="flex h-screen w-screen bg-white">
      <div className="relative hidden py-8 pl-8 lg:flex lg:w-[60vw]">
        <Image
          src={bannerLogin}
          alt="banner-login"
          className="h-full w-full rounded-xl object-cover"
        />
      </div>

      <div className="flex w-full items-center justify-center px-8 lg:w-1/2">
        <div className="w-full max-w-xl">
          <div className="mb-8 flex items-center justify-center">
            <Image src={LogoSipekebun} width="auto" height={42} alt="logo" />
          </div>

          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Link href={'/login'}>
                <div className="flex flex-row items-center gap-3 font-bold">
                  <ArrowLeftIcon width={20} height={20} />
                  <Paragraph level={3}>Kembali</Paragraph>
                </div>
              </Link>
              <Heading level={3}>Lupa Kata Sandi</Heading>
              <Paragraph level={3}>Silahkan ikuti langkah di bawah.</Paragraph>
              <InputText
                placeholder="Masukan email terdaftar"
                label={'Email'}
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
              />
              <Button className="w-full" type="submit" isLoading={isSubmitting}>
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
