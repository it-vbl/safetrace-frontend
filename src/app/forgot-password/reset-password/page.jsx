'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import assets from '@/config/assets';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import InputText from '@/components/molecules/InputText';
import { forgotPasswordReset } from '@/services/auth';
import { ArrowLeftIcon } from '@radix-ui/react-icons';



const ResetPasswordPage = () => {
  const router = useRouter();
  const otpToken = Cookies.get('otp_token');
  const otp = Cookies.get('otp');

  const {
    handleSubmit,
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    isSubmitting,
  } = useFormik({
    initialValues: {
      password: '',
      repassword: '',
    },
    validationSchema: Yup.object().shape({
      password: Yup.string().required('Kata sandi harus diisi'),
      repassword: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'Kata sandi tidak cocok'
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const res = await forgotPasswordReset({
          ...values,
          otp_token: otpToken,
          otp,
        });
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
    <div className="flex h-screen w-full bg-white">
      <div className="relative max-lg:hidden py-8 pl-8 lg:flex lg:w-[60%] lg:shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assets.login.background}
          alt="banner-login"
          className="h-full w-full rounded-xl object-cover"
        />
      </div>

      <div className="flex w-full items-center justify-center px-8 lg:w-[40%] lg:shrink-0">
        <div className="w-full max-w-xl">
          <div className="mb-8 flex items-center justify-center">
            <Image src={assets.login.logo} width={200} height={42} style={{ width: 'auto', height: 42 }} alt="logo" />
          </div>

          <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Link href={'/login'}>
                <div className="flex flex-row items-center gap-3 font-bold">
                  <ArrowLeftIcon width={20} height={20} />
                  <Paragraph level={3}>Kembali</Paragraph>
                </div>
              </Link>
              <div>
                <Heading level={3}>Kata Sandi Baru</Heading>
                <Paragraph level={3}>Gunakan kata sandi terbaru.</Paragraph>
              </div>
              <InputText
                label="Kata Sandi"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                placeholder="Masukan kata sandi baru"
              />
              <InputText
                label="Ulang Kata Sandi"
                type="password"
                name="repassword"
                value={values.repassword}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                placeholder="Masukan ulang kata sandi baru "
              />
              <Button type="submit" isLoading={isSubmitting}>
                Ubah Kata Sandi
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
