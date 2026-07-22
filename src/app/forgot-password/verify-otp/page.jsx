'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

import assets from '@/config/assets';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import OTPInput from '@/components/molecules/OTPInput';
import { forgotPassword, forgotPasswordVerifyOTP } from '@/services/auth';
import { ArrowLeftIcon } from '@radix-ui/react-icons';



const LoginPage = () => {
  const router = useRouter();
  const otpToken = Cookies.get('otp_token');
  const email = Cookies.get('forgotPasswordEmail');
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  useEffect(() => {
    let timer;
    if (isResendDisabled) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResendDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isResendDisabled]);

  const {
    handleSubmit,
    values,
    errors,
    handleBlur,
    handleChange,
    isSubmitting,
  } = useFormik({
    initialValues: {
      otp: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const res = await forgotPasswordVerifyOTP({
          otp: values.otp,
          otp_token: otpToken,
        });
        if (res.status === 200) {
          Cookies.set('otp', values.otp);
          router.push('/forgot-password/reset-password');
          toast.success('Verifikasi OTP berhasil');
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleResendOTP = async () => {
    if (isResendDisabled) return;
    try {
      setIsResendDisabled(true);
      const res = await forgotPassword({ email });
      if (res.status === 200) {
        Cookies.set('otp_token', res.data.data.otp_token);
        toast.success('OTP berhasil dikirim ulang ke email anda');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };
  useEffect(() => {
    if (values.otp.length === 6 && /^\d+$/.test(values.otp)) {
      handleSubmit();
    }
  }, [values.otp, handleSubmit]);

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
            <form className="space-y-6">
              <Link href={'/login'}>
                <div className="flex flex-row items-center gap-3 font-bold">
                  <ArrowLeftIcon width={20} height={20} />
                  <Paragraph level={3}>Kembali</Paragraph>
                </div>
              </Link>
              <div>
                <Heading level={3}>OTP</Heading>
                <Paragraph level={3}>
                  Masukan kode OTP yang telah kami kirimkan ke email Anda.
                </Paragraph>
              </div>
              <OTPInput
                length={6}
                value={values.otp}
                onChange={(e) => {
                  handleChange({
                    target: {
                      name: 'otp',
                      value: e,
                    },
                  });
                }}
                onBlur={handleBlur}
                name="otp"
              />
              <div>
                <Paragraph level={3}>
                  Tidak dapat kode OTP?{' '}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="font-bold text-primary underline"
                    disabled={isResendDisabled}
                  >
                    Kirim Ulang OTP {isResendDisabled && `(${resendTimer}s)`}
                  </button>
                </Paragraph>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
