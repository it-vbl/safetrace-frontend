'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import Accordion from '@/components/molecules/Accordion';
import InputText from '@/components/molecules/InputText';
import Modal from '@/components/molecules/Modal';
import Upload from '@/components/molecules/Upload';
import { ocrKTP, registerPolis, uploadFile } from '@/services/polis';
import { TrashIcon } from '@radix-ui/react-icons';

const SignupForm = () => {
  const router = useRouter();
  const t = useTranslations('ReimburseSubmission');
  const schemaValidation = Yup.object().shape({
    reimbursementName: Yup.string().required('Reimbursement name is required'),
  });
  const [errorSubmit, setErrorSubmit] = useState();

  const formik = useFormik({
    initialValues: {
      ktp_file_path: '',
      no_ktp: '',
      front_car_path: '',
      back_car_path: '',
      left_car_path: '',
      right_car_path: '',
      jenis_mobil: '',
      tipe_mobil: '',
      no_mesin: '',
      no_rangka: '',
      no_plat: '',
      nama_pemilik: '',
    },
    onSubmit: async (values) => {
      try {
        setErrorSubmit('');
        const response = await registerPolis(values);
        if (response.status == 201) {
          // router.replace('/id');
        } else {
        }
      } catch (err) {
        console.error('ERROR', err);
        setErrorSubmit(err?.response?.data?.reason || 'Terjadi Kesalahan, mohon coba lagi');
      }
    },
  });

  const carPhotos = [
    {
      field: 'front_car_path',
      label: 'Foto Tampak Depan',
    },
    {
      field: 'back_car_path',
      label: 'Foto Tampak Belakang',
    },
    {
      field: 'left_car_path',
      label: 'Foto Tampak Samping Kiri',
    },
    {
      field: 'right_car_path',
      label: 'Foto Tampak Samping Kanan',
    },
  ];

  const handleUploadFile = async (e: any, fieldName: string) => {
    try {
      const response = await uploadFile({ file: e.value });
      if (response) {
        formik.setFieldValue(fieldName, response.data.filepath);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOCRKTP = async (e: any) => {
    try {
      const temp = [];
      temp.push(e.value);
      handleUploadFile(e, 'ktp_file_path');
      const response = await ocrKTP({ images: e.value });
      if (response) {
        formik.setFieldValue('no_ktp', response.data.NIK);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='h-min-screen relative min-h-screen w-full px-[200px] py-[64px]'>
      <div>
        <Heading level={3}>Lengkapi data untuk claim Asuransi</Heading>
      </div>
      <div className='flex flex-1 flex-col'>
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-8'>
          {/* <Select
            name='approver'
            onChange={() => {}}
            label={t('approver_field_label')}
            placeholder={t('approver_field_placeholder')}
            options={[
              { label: 'Abyan Pratama', value: 1 },
              { label: 'Faathir Muhammad', value: 2 },
            ]}
          /> */}
          <div>
            <Heading level={4}>Foto KTP</Heading>
            <Paragraph level={2}>Pihak asuransi membutuhkan KTP kamu sebagai bagian dari pembuatan polis</Paragraph>
            <div className='mt-4 flex flex-col'>
              {formik.values.ktp_file_path ? (
                <Image
                  className='my-8'
                  height={300}
                  width={200}
                  src={process.env.NEXT_PUBLIC_BASE_URL + formik.values.ktp_file_path}
                />
              ) : (
                <Upload onChangeValue={handleOCRKTP} />
              )}
              <InputText
                name='no_ktp'
                onChange={formik.handleChange}
                value={formik.values.no_ktp}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'Nomor KTP'}
              />
            </div>
          </div>
          <div>
            <Heading level={4}>Foto Mobil</Heading>
            <Paragraph level={2}>
              Pihak asuransi memerlukan foto mobil kamu untuk memproses polis. Tolong unggah foto mobilmu dalam kondisi
              terang, supaya lebih jelas ya!
            </Paragraph>
            <div className='mt-4 grid grid-cols-2 gap-4'>
              {carPhotos.map((data, index) => {
                return !formik.values[data.field] ? (
                  <Upload label={data?.label} onChangeValue={(e) => handleUploadFile(e, data?.field)} />
                ) : (
                  <div className='relative'>
                    <div className='z-2 absolute right-4 top-4 rounded-full bg-white p-2'>
                      <TrashIcon color='red' onClick={() => formik.setFieldValue(data.field, '')} />
                    </div>
                    <Image
                      className='w-full rounded-xl'
                      height={300}
                      width={200}
                      src={process.env.NEXT_PUBLIC_BASE_URL + formik.values[data.field]}
                    />
                  </div>
                );
              })}
              {/* <Upload label='Foto Tampak Depan' onChangeValue={(e) => handleUploadFile(e, 'front_car_path')} />
              <Upload label='Foto Tampak Belakang' onChangeValue={(e) => handleUploadFile(e, 'back_car_path')} />
              <Upload label='Foto Tampak Samping Kiri' onChangeValue={(e) => handleUploadFile(e, 'left_car_path')} />
              <Upload label='Foto Tampak Samping Kanan' onChangeValue={(e) => handleUploadFile(e, 'right_car_path')} /> */}
            </div>
          </div>
          <div>
            <Heading level={4}>Informasi Mobil</Heading>
            <Paragraph level={2}>
              Pihak asuransi memerlukan foto mobil kamu untuk memproses polis. Tolong masukan informasi sesuai dengan
              data yang kamu miliki
            </Paragraph>
            <div className='mt-6 grid grid-cols-2 gap-4'>
              <InputText
                name='jenis_mobil'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'Jenis Mobil'}
              />
              <InputText
                name='no_mesin'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'No Mesin'}
              />
              <InputText
                name='no_plat'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'No Plat'}
              />
              <InputText
                name='tipe_mobil'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'Tipe Mobil'}
              />
              <InputText
                name='no_rangka'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'No Rangka'}
              />
              <InputText
                name='nama_pemilik'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'Nama Pemilik'}
              />
            </div>
          </div>
          {errorSubmit ? (
            <Paragraph level={2} className='rounded-md bg-red-100 p-4 text-red-700'>
              {errorSubmit}
            </Paragraph>
          ) : null}
          <Button type='submit'>Submit</Button>
        </form>
      </div>
      <Modal visible={false} title='Detail Reimburse' subtitle='Lembar 1'>
        <Accordion
          accordionItemClassName='!border rounded-sm'
          items={[
            {
              title: 'How do I login?',
              description: (
                <p className='text-[14px] font-medium leading-[18px] text-[#414347]'>
                  Please check this video.{' '}
                  <span
                    className='cursor-pointer font-bold text-[#4C79AB] underline'
                    onClick={() => console.log('clicked!')}
                  >
                    Click Here
                  </span>
                </p>
              ),
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default SignupForm;
