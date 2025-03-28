'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputText from '@/components/molecules/InputText';
import Upload from '@/components/molecules/Upload';
import { useTranslations } from 'next-intl';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import Modal from '@/components/molecules/Modal';
import Accordion from '@/components/molecules/Accordion';
import { claimPolis, ocrKTP, registerPolis, uploadFile } from '@/services/polis';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TrashIcon } from '@radix-ui/react-icons';

const ClaimForm = () => {
  const router = useRouter();
  const t = useTranslations('ReimburseSubmission');
  const schemaValidation = Yup.object().shape({
    reimbursementName: Yup.string().required('Reimbursement name is required'),
  });
  const [errorSubmit, setErrorSubmit] = useState();

  const formik = useFormik({
    initialValues: {
      foto_bukti: [],
      id_polis: '',
      nama_pemilik: '',
      damage_reason: '',
    },
    onSubmit: async (values) => {
      try {
        const response = await claimPolis(values);
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

  const handleUploadFile = async (e: any) => {
    try {
      const response = await uploadFile({ file: e.value });
      if (response) {
        const temp = [...formik.values.foto_bukti];
        temp.push(response.data.filepath);
        console.log('CHECK DATA', temp);
        formik.setFieldValue('foto_bukti', temp);
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

  const handleRemovePhoto = (index) => {
    const temp = [...formik.values.foto_bukti];
    temp.splice(index, 1);
    formik.setFieldValue('foto_bukti', temp);
  };

  console.log('formik values', formik.values);

  return (
    <div className='h-min-screen relative min-h-screen w-full px-[200px] py-[64px]'>
      <div>
        <Heading level={3}>Lengkapi data untuk claim Asuransi</Heading>
      </div>
      <div className='flex flex-1 flex-col'>
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-8'>
          <div>
            <Heading level={4}>Informasi Mobil</Heading>
            <Paragraph level={2}>
              Pihak asuransi memerlukan foto mobil kamu untuk memproses polis. Tolong masukan informasi sesuai dengan
              data yang kamu miliki
            </Paragraph>
            <div className='mt-6 grid grid-cols-2 gap-4'>
              <InputText
                name='id_polis'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'Nomor Polis'}
              />
            </div>
          </div>
          <div>
            <Heading level={4}>Unggah Foto Kerusakan</Heading>
            <Paragraph level={2}>
              Pihak asuransi memerlukan foto kerusakan pada mobil kamu untuk memproses claim. Tolong unggah foto dalam
              kondisi terang, supaya lebih jelas ya!
            </Paragraph>
            <div className='mt-4 flex flex-col gap-4'>
              <InputText
                name='damage_reason'
                onChange={formik.handleChange}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'Kronologi kerusakan'}
              />
              <Upload onChangeValue={(e) => handleUploadFile(e)} />
              <div className='grid grid-cols-2 gap-4'>
                {formik.values.foto_bukti.map((data, index) => {
                  return (
                    <div className='relative'>
                      <div className='z-2 absolute right-4 top-4 rounded-full bg-white p-2'>
                        <TrashIcon color='red' onClick={() => handleRemovePhoto(index)} />
                      </div>
                      <Image
                        className='h-[300px] w-full rounded-xl bg-gray-100 object-contain'
                        height={300}
                        width={200}
                        objectFit='contain'
                        src={process.env.NEXT_PUBLIC_BASE_URL + data}
                      />
                    </div>
                  );
                })}
              </div>
              {/* <Upload label='Foto Tampak Depan' onChangeValue={(e) => handleUploadFile(e, 'front_car_path')} />
              <Upload label='Foto Tampak Belakang' onChangeValue={(e) => handleUploadFile(e, 'back_car_path')} />
              <Upload label='Foto Tampak Samping Kiri' onChangeValue={(e) => handleUploadFile(e, 'left_car_path')} />
              <Upload label='Foto Tampak Samping Kanan' onChangeValue={(e) => handleUploadFile(e, 'right_car_path')} /> */}
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

export default ClaimForm;
