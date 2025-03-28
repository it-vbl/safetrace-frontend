'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
import { claimPolis, getClaimDetail, ocrKTP, registerPolis, uploadFile } from '@/services/polis';
import { TrashIcon } from '@radix-ui/react-icons';

const ClaimDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { claimId } = params;
  const t = useTranslations('ReimburseSubmission');
  const schemaValidation = Yup.object().shape({
    reimbursementName: Yup.string().required('Reimbursement name is required'),
  });
  const [errorSubmit, setErrorSubmit] = useState();
  const [claimDetail, setClaimDetail] = useState<any>();

  const newDent = claimDetail?.claim?.is_new_dent === 1;

  const formik = useFormik({
    initialValues: {
      foto_bukti: [],
      id_polis: '',
      plat_nomor: '',
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
      } catch (err: any) {
        console.error('ERROR', err);
        setErrorSubmit(err?.response?.data?.reason || 'Terjadi Kesalahan, mohon coba lagi');
      }
    },
  });

  const handleUploadFile = async (e: any) => {
    try {
      const response = await uploadFile({ file: e.value });
      if (response) {
        const temp: any = [...formik.values.foto_bukti];
        temp.push(response.data.filepath);
        console.log('CHECK DATA', temp);
        formik.setFieldValue('foto_bukti', temp);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemovePhoto = (index: any) => {
    const temp = [...formik.values.foto_bukti];
    temp.splice(index, 1);
    formik.setFieldValue('foto_bukti', temp);
  };

  const handleGetClaimDetail = async () => {
    try {
      const response = await getClaimDetail(claimId);
      if (response.status == 200) {
        setClaimDetail(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleGetClaimDetail();
  }, []);

  console.log('CHECK STATE', claimDetail);

  return (
    <div className='h-min-screen relative min-h-screen w-full py-[64px] sm:px-[32px] md:px-[124px] xl:px-[200px]'>
      <div>
        <Heading level={3}>Lengkapi data untuk claim Asuransi</Heading>
      </div>
      <div className='flex flex-1 flex-col'>
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-8'>
          <div>
            <Heading level={4}>Informasi Mobil</Heading>
            <Paragraph level={2}>Detail Informasi Kepemilikan mobil</Paragraph>
            <div className='mt-6 grid grid-cols-2 gap-4'>
              <InputText
                name='jenis_mobil'
                onChange={formik.handleChange}
                value={claimDetail?.polis?.jenis_mobil}
                placeholder={'Jenis Mobil'}
              />
              <InputText
                name='no_mesin'
                onChange={formik.handleChange}
                value={claimDetail?.polis?.no_mesin}
                placeholder={'No Mesin'}
              />
              <InputText
                name='no_plat'
                onChange={formik.handleChange}
                value={claimDetail?.polis?.no_plat}
                placeholder={'No Plat'}
              />
              <InputText
                name='tipe_mobil'
                onChange={formik.handleChange}
                value={claimDetail?.polis?.tipe_mobil}
                placeholder={'Tipe Mobil'}
              />
              <InputText
                name='no_rangka'
                onChange={formik.handleChange}
                value={claimDetail?.polis?.no_rangka}
                placeholder={'No Rangka'}
              />
              <InputText
                name='nama_pemilik'
                onChange={formik.handleChange}
                value={claimDetail?.polis?.nama_pemilik}
                placeholder={'Nama Pemilik'}
              />
              <div>
                <Heading level={6}>Foto Tampak Depan</Heading>
                <Image
                  className='mt-3 h-[300px] w-full rounded-xl bg-gray-100 object-contain'
                  height={300}
                  width={200}
                  objectFit='contain'
                  src={process.env.NEXT_PUBLIC_BASE_URL + claimDetail?.polis?.front_car_path}
                  alt='foto tampak depan'
                />
              </div>
              <div>
                <Heading level={6}>Foto Tampak Belakang</Heading>
                <Image
                  className='mt-3 h-[300px] w-full rounded-xl bg-gray-100 object-contain'
                  height={300}
                  width={200}
                  objectFit='contain'
                  src={process.env.NEXT_PUBLIC_BASE_URL + claimDetail?.polis?.back_car_path}
                  alt='foto tampak belakang'
                />
              </div>
              <div>
                <Heading level={6}>Foto Tampak Samping Kiri</Heading>
                <Image
                  className='mt-3 h-[300px] w-full rounded-xl bg-gray-100 object-contain'
                  height={300}
                  width={200}
                  objectFit='contain'
                  src={process.env.NEXT_PUBLIC_BASE_URL + claimDetail?.polis?.left_car_path}
                  alt='foto tampak kiri'
                />
              </div>
              <div>
                <Heading level={6}>Foto Tampak Samping Kanan</Heading>
                <Image
                  className='mt-3 h-[300px] w-full rounded-xl bg-gray-100 object-contain'
                  height={300}
                  width={200}
                  objectFit='contain'
                  src={process.env.NEXT_PUBLIC_BASE_URL + claimDetail?.polis?.right_car_path}
                  alt='foto tampak kanan'
                />
              </div>
            </div>
          </div>
          <div>
            <Heading level={4}>Foto Kerusakan</Heading>
            <div className='mt-4 flex flex-col gap-4'>
              <InputText
                name='damage_reason'
                label='Kronologi Kerusakan'
                onChange={formik.handleChange}
                value={claimDetail?.claim?.damage_reason}
                // label={t('claim_field_ktp_number_label')}
                placeholder={'Kronologi kerusakan'}
              />
              <div className='grid grid-cols-2 gap-4'>
                {claimDetail?.supporting_photos?.map((data: any, index: Number) => {
                  return (
                    <Image
                      key={`foto-detail-kerusakan-${index}`}
                      className='h-[300px] w-full rounded-xl bg-gray-100 object-contain'
                      height={300}
                      width={200}
                      objectFit='contain'
                      src={process.env.NEXT_PUBLIC_BASE_URL + data?.path}
                      alt='foto detail kerusakan'
                    />
                  );
                })}
              </div>
              {/* <Upload label='Foto Tampak Depan' onChangeValue={(e) => handleUploadFile(e, 'front_car_path')} />
              <Upload label='Foto Tampak Belakang' onChangeValue={(e) => handleUploadFile(e, 'back_car_path')} />
              <Upload label='Foto Tampak Samping Kiri' onChangeValue={(e) => handleUploadFile(e, 'left_car_path')} />
              <Upload label='Foto Tampak Samping Kanan' onChangeValue={(e) => handleUploadFile(e, 'right_car_path')} /> */}
            </div>
          </div>
          <div>
            <Heading level={4}>Hasil Analisa</Heading>
            <div className='grid grid-cols-2 gap-4'>
              <div className='mt-4 flex flex-col gap-2'>
                <Paragraph className='font-bold' level={3}>
                  Skor Kesamaan : {claimDetail?.claim?.similarity_score}
                </Paragraph>
                <Paragraph level={3}>{claimDetail?.claim?.similarity_reason}</Paragraph>
              </div>
              <div className='mt-4 flex flex-col gap-2'>
                <Paragraph
                  className={`rounded-md px-3 py-2 font-bold ${
                    newDent ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                  }`}
                  level={3}
                >
                  {newDent ? 'Terdapat Kerusakan Baru' : 'Tidak Terdapat Kerusakan Baru'}
                </Paragraph>
                <Paragraph level={3}>{claimDetail?.claim?.new_dent_reason}</Paragraph>
              </div>
            </div>
          </div>

          {errorSubmit ? (
            <Paragraph level={2} className='rounded-md bg-red-100 p-4 text-red-700'>
              {errorSubmit}
            </Paragraph>
          ) : null}
          <div className='flex flex-1 flex-row gap-4'>
            <Button type='submit' className='w-full bg-red-500'>
              Tolak
            </Button>
            <Button type='submit' className='w-full'>
              Terima
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimDetail;
