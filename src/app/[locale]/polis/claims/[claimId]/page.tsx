'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import InputText from '@/components/molecules/InputText';
import { claimPolis, getClaimDetail, updateClaimStatus, uploadFile } from '@/services/polis';
import convertSnakeCaseToTitleCase from '@/utils/convertSnakeCaseToTitleCase';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

const status = {
  rejected: 'Ditolak',
  approved: 'Disetujui',
  'on-analyzing': 'Dalam Analisa',
  'waiting-approval': 'Menunggu Persetujuan',
};

const ClaimDetail = () => {
  const router = useRouter();
  const params = useParams();
  const { claimId } = params;
  const t = useTranslations('ReimburseSubmission');
  const schemaValidation = Yup.object().shape({
    reimbursementName: Yup.string().required('Reimbursement name is required'),
  });
  const [errorSubmit, setErrorSubmit] = useState();
  const [claimDetail, setClaimDetail] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const handleUpdateClaimStatus = async (status: string) => {
    try {
      setIsSubmitting(true);
      const res = await updateClaimStatus(claimId, status);
      if (res.status === 200) {
        router.push('/id/polis/claim/list');
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  return (
    <div className='h-min-screen relative min-h-screen w-full px-[64px] py-[64px] md:px-[120px]'>
      <Button onClick={() => router.back()} className='mb-4' variant='tertiary' size='small' icon={<ArrowLeftIcon />}>
        Kembali
      </Button>
      <div>
        <Heading level={3}>Detail Claim</Heading>
        <Heading level={5} className='my-4 w-auto rounded-md bg-blue-50 px-4 py-2'>
          Polis ID : {claimDetail?.polis?.id}
          <br />
          Claim ID : {claimDetail?.claim?.id}
        </Heading>
      </div>
      <div className='flex flex-1 flex-col'>
        <div className='flex flex-col gap-8'>
          <div>
            <Heading level={4}>Informasi Mobil</Heading>
            <Paragraph level={2}>Detail Informasi Kepemilikan mobil</Paragraph>
            <div className='mt-6 grid grid-cols-2 gap-4'>
              <InputText
                disabled={true}
                name='jenis_mobil'
                onChange={formik.handleChange}
                value={claimDetail?.polis?.jenis_mobil}
                placeholder={'Jenis Mobil'}
              />
              <InputText
                disabled={true}
                name='no_mesin'
                value={claimDetail?.polis?.no_mesin}
                placeholder={'No Mesin'}
              />
              <InputText disabled={true} name='no_plat' value={claimDetail?.polis?.no_plat} placeholder={'No Plat'} />
              <InputText
                disabled={true}
                name='tipe_mobil'
                value={claimDetail?.polis?.tipe_mobil}
                placeholder={'Tipe Mobil'}
              />
              <InputText
                disabled={true}
                name='no_rangka'
                value={claimDetail?.polis?.no_rangka}
                placeholder={'No Rangka'}
              />
              <InputText
                disabled={true}
                name='nama_pemilik'
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
            <Heading level={4}>Detail Kerusakan Mobil</Heading>
            <Paragraph level={2}>Silahkan pilih titik-titik kerusakan Mobil</Paragraph>
            <div className='mt-4 flex flex-col gap-4'>
              <InputText
                disabled={true}
                name='damage_reason'
                label='Kronologi Kerusakan'
                value={claimDetail?.claim?.damage_reason}
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
            </div>
          </div>
          <div>
            <Heading level={4}>Hasil Analisa</Heading>
            {claimDetail?.analysis_results?.length > 0 ? (
              <div className='mt-8 rounded-md border border-gray-100 p-4'>
                <Heading level={5} className='mb-2'>
                  Kerusakan lama yang di claim oleh customer:
                </Heading>
                <div className='flex flex-col gap-4'>
                  {claimDetail?.analysis_results?.map((data: any, index: number) => {
                    const differences = data?.differences ? data?.differences?.split(';') : [];
                    return (
                      <div
                        key={`detail-claim-${index}`}
                        className='flex flex-col items-start rounded-md border border-gray-100 p-6'
                      >
                        <Paragraph level={2} className='mb-2 line-clamp-1 font-medium text-neutral8'>
                          {index + 1}. {convertSnakeCaseToTitleCase(data?.damage_section)}
                        </Paragraph>
                        <div className={'flex w-full flex-row gap-4'}>
                          <div className='flex flex-1 flex-col gap-2 text-gray-600'>
                            <Image
                              className='h-[300px] w-full rounded-xl bg-gray-100 object-contain'
                              height={300}
                              width={200}
                              objectFit='contain'
                              src={process.env.NEXT_PUBLIC_BASE_URL + data?.polis_photo_path}
                              alt='foto detail kerusakan'
                            />
                            <Paragraph level={4}>
                              *Foto diambil pada saat pengajuan <b>polis</b>
                            </Paragraph>
                          </div>
                          <div className='flex flex-1 flex-col gap-2 text-gray-600'>
                            <Image
                              className='h-[300px] w-full rounded-xl bg-gray-100 object-contain'
                              height={300}
                              width={200}
                              objectFit='contain'
                              src={process.env.NEXT_PUBLIC_BASE_URL + data?.claim_photo_path}
                              alt='foto detail kerusakan'
                            />
                            <Paragraph level={4}>
                              *Foto diambil pada saat pengajuan <b>klaim</b>
                            </Paragraph>
                          </div>
                        </div>
                        <div
                          className={`mt-4 !w-auto rounded-md p-2 ${
                            data?.is_new_dent ? 'bg-orange-100 text-orange-900' : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <Paragraph level={2} className='font-bold'>
                            {data?.is_new_dent ? 'Terdapat kerusakan baru' : 'Tidak terdapat kerusakan baru'}
                          </Paragraph>
                          {data?.is_new_dent ? <Paragraph level={3}>{data?.new_dent_reason}</Paragraph> : null}
                        </div>
                        <div
                          className={`mt-4 !w-auto rounded-md p-2 ${
                            data?.similarity_score < 50
                              ? 'bg-red-100 text-red-900'
                              : data?.similarity_score < 75
                              ? 'bg-yellow-100 text-yellow-900'
                              : 'bg-green-100 text-green-900'
                          }`}
                        >
                          <Paragraph level={2} className='font-bold'>
                            Skor kesamaan : {data?.similarity_score}/100
                          </Paragraph>
                          <Paragraph level={3}>{data?.same_car_reason}</Paragraph>
                          {differences?.length > 0 && (
                            <div className='mt-4'>
                              <Paragraph level={3} className='font-bold'>
                                List Perbedaan
                              </Paragraph>
                              {differences?.map((diff: any, index: any) => {
                                return <Paragraph key={`diff-${index}`} level={3}>{`${index + 1}. ${diff}`}</Paragraph>;
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
            {claimDetail?.new_damages?.length > 0 ? (
              <div className='mt-8 rounded-md border border-gray-100 p-4'>
                <Heading level={5} className='mb-2 '>
                  Kerusakan baru
                </Heading>
                <div className='flex flex-col gap-4'>
                  {claimDetail?.new_damages?.map((data: any, index: number) => {
                    return (
                      <div
                        key={`detail-claim-${index}`}
                        className='flex flex-col items-start rounded-md border border-gray-100 p-6'
                      >
                        <Paragraph level={2} className='mb-2 line-clamp-1 font-medium text-neutral8'>
                          {index + 1}. {convertSnakeCaseToTitleCase(data?.damage_section)}
                        </Paragraph>
                        <div className={'flex w-full flex-row gap-4'}>
                          <Image
                            className='h-[300px] w-full rounded-xl bg-gray-100 object-contain'
                            height={300}
                            width={200}
                            objectFit='contain'
                            src={process.env.NEXT_PUBLIC_BASE_URL + data?.path}
                            alt='foto detail kerusakan'
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {errorSubmit ? (
            <Paragraph level={2} className='rounded-md bg-red-100 p-4 text-red-700'>
              {errorSubmit}
            </Paragraph>
          ) : null}
          <div className='flex flex-1 flex-row gap-4'>
            <Button onClick={() => handleUpdateClaimStatus('rejected')} type='' className='w-full bg-red-500'>
              Tolak
            </Button>
            <Button onClick={() => handleUpdateClaimStatus('approved')} type='' className='w-full'>
              Terima
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetail;
