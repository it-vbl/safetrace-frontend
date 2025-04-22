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
import InputText from '@/components/molecules/InputText';
import Modal from '@/components/molecules/Modal';
import Select from '@/components/molecules/Select';
import Upload from '@/components/molecules/Upload';
import { ocrKTP, registerPolis, uploadFile } from '@/services/polis';
import { TrashIcon } from '@radix-ui/react-icons';

const carType: any = [
  { label: 'SUV', value: 'SUV' },
  { label: 'Sedan', value: 'Sedan' },
  { label: 'Hatchback', value: 'Hatchback' },
  { label: 'MPV', value: 'MPV' },
  { label: 'Pickup', value: 'Pickup' },
  { label: 'Convertible', value: 'Convertible' },
  { label: 'Coupe', value: 'Coupe' },
  { label: 'Wagon', value: 'Wagon' },
  { label: 'Van', value: 'Van' },
  { label: 'Crossover', value: 'Crossover' },
];

const carCategories: any = [
  { label: 'Mobil Penumpang', value: 'Mobil Penumpang' },
  { label: 'Mobil Niaga', value: 'Mobil Niaga' },
  { label: 'Mobil Sport', value: 'Mobil Sport' },
  { label: 'Mobil Listrik', value: 'Mobil Listrik' },
  { label: 'Mobil Hybrid', value: 'Mobil Hybrid' },
  { label: 'Mobil Balap', value: 'Mobil Balap' },
  { label: 'Mobil Polisi', value: 'Mobil Polisi' },
  { label: 'Mobil Ambulans', value: 'Mobil Ambulans' },
  { label: 'Mobil Pemadam', value: 'Mobil Pemadam' },
  { label: 'Mobil Dinas', value: 'Mobil Dinas' },
];

const SignupForm = () => {
  const router = useRouter();
  const t = useTranslations('ReimburseSubmission');
  const schemaValidation = Yup.object().shape({
    ktp_file_path: Yup.string().required('KTP is required'),
    front_car_path: Yup.string().required('Field is required'),
    back_car_path: Yup.string().required('Field is required'),
    left_car_path: Yup.string().required('Field is required'),
    right_car_path: Yup.string().required('Field is required'),
  });
  const [errorSubmit, setErrorSubmit] = useState('');
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [polisID, setPolisID] = useState();
  const [modalPolisCreated, setModalPolisCreated] = useState(false);

  const formik: any = useFormik({
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
    validationSchema: schemaValidation,
    onSubmit: async (values) => {
      try {
        setLoadingSubmission(true);
        setErrorSubmit('');
        const response = await registerPolis(values);
        if (response.status == 201) {
          setPolisID(response.data.id);
          setModalPolisCreated(true);
        } else {
        }
      } catch (err) {
        console.error('ERROR', err);
        setErrorSubmit((err as any)?.response?.data?.reason || 'Terjadi Kesalahan, mohon coba lagi');
      }
      setLoadingSubmission(false);
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
        <form onSubmit={formik.handleSubmit} className='mt-4 flex flex-col gap-8'>
          <div>
            <Heading level={4}>Foto KTP</Heading>
            <Paragraph level={2}>Pihak asuransi membutuhkan KTP kamu sebagai bagian dari pembuatan polis</Paragraph>
            <div className='mt-4 flex flex-col'>
              {formik.values.ktp_file_path ? (
                <Image
                  className='my-8 h-[300px] w-full bg-gray-50 object-contain'
                  height={300}
                  width={200}
                  src={process.env.NEXT_PUBLIC_BASE_URL + formik.values.ktp_file_path}
                  alt={`Foto KTP`}
                />
              ) : (
                <Upload onChangeValue={handleOCRKTP} />
              )}
              <InputText
                name='no_ktp'
                disabled={true}
                onChange={formik.handleChange}
                value={formik.values.no_ktp}
                placeholder={'Nomor KTP'}
              />
              <Paragraph level={6} className='mt-2 text-xs'>
                * Nomor KTP akan otomatis terisi oleh sistem
              </Paragraph>
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
                      alt='foto-mobil'
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
              Pihak asuransi memerlukan informasi mobil kamu untuk memproses polis. Tolong isi informasi mobil kamu
              dengan benar!
            </Paragraph>
            <div className='mt-6 grid grid-cols-2 gap-4'>
              <Select
                name='jenis_mobil'
                onChange={formik.handleChange}
                label={'Jenis Mobil'}
                placeholder={'Pilih jenis mobil'}
                value={formik.values.jenis_mobil}
                options={carType}
              />
              <Select
                name='tipe_mobil'
                onChange={formik.handleChange}
                label={'Tipe Mobil'}
                value={formik.values.tipe_mobil}
                placeholder={'Pilih tipe mobil'}
                options={carCategories}
              />
              <InputText name='no_plat' onChange={formik.handleChange} label={'No Plat'} placeholder={'No Plat'} />
              <InputText
                name='no_mesin'
                onChange={formik.handleChange}
                label={'No Mesin'}
                placeholder={'No Mesin, ex: MH1HABD123K123321'}
              />
              <InputText
                name='no_rangka'
                onChange={formik.handleChange}
                label={'No Rangka'}
                placeholder={'No Rangka, ex: WDB1245678B123456'}
              />
              <InputText
                name='nama_pemilik'
                onChange={formik.handleChange}
                label={'Nama Pemilik'}
                placeholder={'Nama Pemilik'}
              />
            </div>
          </div>
          {errorSubmit ? (
            <Paragraph level={2} className='rounded-md bg-red-100 p-4 text-red-700'>
              {errorSubmit}
            </Paragraph>
          ) : null}
          <Button isLoading={loadingSubmission} type='submit'>
            Submit
          </Button>
        </form>
      </div>
      <Modal
        title='Pengajuan polis berhasil di buat'
        onClose={() => {
          setModalPolisCreated(false);
          router.push('/');
        }}
        visible={modalPolisCreated}
      >
        <div>
          <Paragraph className='text-center'>ID Polis kamu adalah {polisID}</Paragraph>
          <div className='flex w-full flex-row items-end justify-center'>
            <Button
              onClick={() => {
                setModalPolisCreated(false);
                router.push('/');
              }}
              className='mt-4'
            >
              Oke
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SignupForm;
