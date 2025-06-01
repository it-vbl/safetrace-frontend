'use client';

import React, { useEffect, useState } from 'react';
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
import { calculatePremi, ocrKTP, ocrSTNK, registerPolis, uploadFile } from '@/services/polis';
import { TrashIcon } from '@radix-ui/react-icons';
import RadioButton from '@/components/molecules/RadioButton';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import useProvinces from '@/hooks/useProvinces';
import useRegencies from '@/hooks/useRegencies';
import useDistricts from '@/hooks/useDistricts';
import useVillages from '@/hooks/useVillages';
import { toast } from 'react-toastify';

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
    ktp_file_path: Yup.string().required('Foto KTP wajib diunggah'),
    stnk_file_path: Yup.string().required('Foto STNK wajib diunggah'),
    front_car_path: Yup.string().required('Kolom ini wajib diisi'),
    back_car_path: Yup.string().required('Kolom ini wajib diisi'),
    left_car_path: Yup.string().required('Kolom ini wajib diisi'),
    right_car_path: Yup.string().required('Kolom ini wajib diisi'),
  });
  const [errorSubmit, setErrorSubmit] = useState('');
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [loadingOCRKTP, setLoadingOCRKTP] = useState(false);
  const [loadingOCRSTNK, setLoadingOCRSTNK] = useState(false);
  const [polisID, setPolisID] = useState();
  const [modalPolisCreated, setModalPolisCreated] = useState(false);
  const [premi, setPremi] = useState(null);

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
      security_feature: false,
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

  const { provinceOptions } = useProvinces();
  const { regencyOptions } = useRegencies(formik.values.domicile_province);
  const { districtOptions } = useDistricts(formik.values.domicile_regency);
  const { villageOptions } = useVillages(formik.values.domicile_district);

  useEffect(() => {
    formik.setFieldValue('domicile_regency', '');
    formik.setFieldValue('domicile_district', '');
    formik.setFieldValue('domicile_village', '');
  }, [formik.values.domicile_province]);

  useEffect(() => {
    formik.setFieldValue('domicile_district', '');
    formik.setFieldValue('domicile_village', '');
  }, [formik.values.domicile_regency]);

  useEffect(() => {
    formik.setFieldValue('domicile_village', '');
  }, [formik.values.domicile_district]);

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
      setLoadingOCRKTP(true);
      const temp = [];
      temp.push(e.value);
      handleUploadFile(e, 'ktp_file_path');
      const response = await ocrKTP({ images: e.value });
      if (response) {
        formik.setFieldValue('nik', response.data.nik || '');
        formik.setFieldValue('fullName', response.data.fullName || '');
        formik.setFieldValue('birthDate', response.data.birthDate || '');
        formik.setFieldValue('birthPlace', response.data.birthPlace || '');
        formik.setFieldValue('religion', response.data.religion || '');
        formik.setFieldValue('marriage_status', response.data.marriage_status || '');
        formik.setFieldValue('address', response.data.address || '');
        formik.setFieldValue('rt', response.data.rt || '');
        formik.setFieldValue('rw', response.data.rw || '');
        formik.setFieldValue('village', response.data.village || '');
        formik.setFieldValue('district', response.data.district || '');
        formik.setFieldValue('regency', response.data.regency || '');
        formik.setFieldValue('province', response.data.province || '');
        formik.setFieldValue('gender', response.data.gender || '');
        formik.setFieldValue('age', response.data.age || '');
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingOCRKTP(false);
  };

  const handleCalculatePremi = async () => {
    try {
      // [
      //   'province1',
      //   'province2',
      //   'regency',
      //   'district',
      //   'village',
      //   'car_type',
      //   'license_ownership_year',
      //   'car_mileage',
      //   'owner_age',
      //   'car_release_year',
      //   'car_has_security_feature',
      //   'premi_claim_count',
      // ];
      const payload = {
        province1: formik.values.province,
        province2: formik.values.domicile_province,
        regency: formik.values.domicile_regency,
        district: formik.values.domicile_district,
        village: formik.values.domicile_village,
        car_type: formik.values.type,
        license_ownership_year: formik.values.sim_year,
        car_mileage: formik.values.mileage,
        owner_age: formik.values.age,
        car_release_year: formik.values.year_of_manufacture,
        has_gps: formik.values.has_gps == 'ya' ? true : false,
        has_dashcam: formik.values.has_dashcam == 'ya' ? true : false,
        premi_claim_count: formik.values.polis_count,
        polis_type: 'tlo',
      };
      const res = await calculatePremi(payload);
      if (res.status == 200) {
        toast.success(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOCRSTNK = async (e: any) => {
    try {
      setLoadingOCRSTNK(true);
      const temp = [];
      temp.push(e.value);
      handleUploadFile(e, 'stnk_file_path');
      const response = await ocrSTNK({ images: e.value });
      if (response) {
        formik.setFieldValue('plate_number', response.data.plate_number || '');
        formik.setFieldValue('owner_name', response.data.owner_name || '');
        formik.setFieldValue('brand', response.data.brand || '');
        formik.setFieldValue('type', response.data.type || '');
        formik.setFieldValue('model', response.data.model || '');
        formik.setFieldValue('year_of_manufacture', response.data.year_of_manufacture || '');
        formik.setFieldValue('color', response.data.color || '');
        formik.setFieldValue('cylinder', response.data.cylinder || '');
        formik.setFieldValue('chassis_number', response.data.chassis_number || '');
        formik.setFieldValue('engine_number', response.data.engine_number || '');
        formik.setFieldValue('bpkb_number', response.data.bpkb_number || '');
        formik.setFieldValue('fuel', response.data.fuel || '');
        formik.setFieldValue('tnkb_color', response.data.tnkb_color || '');
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingOCRSTNK(false);
  };

  return (
    <div className='h-min-screen relative min-h-screen w-full px-[64px] py-[64px] md:px-[120px]'>
      <div>
        <Heading level={3}>Lengkapi data untuk claim Asuransi</Heading>
      </div>
      <div className='flex flex-1 flex-col'>
        <form onSubmit={formik.handleSubmit} className='mt-4 flex flex-col gap-8'>
          <div>
            <Heading level={4}>Kuisioner</Heading>
            <Paragraph level={2}>
              Lengkapi Kuesioner Ini agar Kami Dapat Menyediakan Perlindungan yang Optimal
            </Paragraph>
            <div className='mt-4 flex flex-col items-start gap-4 rounded-md border border-gray-400 p-6'>
              <div className='flex flex-col items-start gap-2'>
                <Paragraph level={3}>
                  1. Apakah kendaraan Anda dilengkapi dengan sistem keamanan pelacak GPS (GPS Tracker)?{' '}
                </Paragraph>
                <RadioButton
                  options={[
                    { value: 'ya', label: 'Ya' },
                    { value: 'tidak', label: 'Tidak' },
                  ]}
                  name='has_gps'
                  name='has_gps'
                  value={formik.values.has_gps}
                  value={formik.values.has_gps}
                  onChange={formik.handleChange}
                />
              </div>
              <div className='flex flex-col items-start gap-2'>
                <Paragraph level={3}>
                  2. Apakah kendaraan Anda dilengkapi dengan kamera dasbor (dashboard camera)?
                </Paragraph>
                <RadioButton
                  options={[
                    { value: 'ya', label: 'Ya' },
                    { value: 'tidak', label: 'Tidak' },
                  ]}
                  name='has_dashcam'
                  value={formik.values.has_dashcam}
                  onChange={formik.handleChange}
                />
              </div>
              <div className='flex flex-col items-start gap-2'>
                <Paragraph level={3}>3. Berapa kilometer yang telah ditempuh kendaraan Anda?</Paragraph>
                <InputText
                  suffix={'KM'}
                  name='mileage'
                  onChange={formik.handleChange}
                  value={formik.values.mileage}
                  placeholder={'Jarak tempuh'}
                />
              </div>
              <div className='flex flex-col items-start gap-2'>
                <Paragraph level={3}>4. Sudah berapa tahun anda memiliki SIM?</Paragraph>
                <InputText
                  suffix='Tahun'
                  name='sim_year'
                  onChange={formik.handleChange}
                  value={formik.values.sim_year}
                  placeholder={'Tahun'}
                />
              </div>
              <div className='flex flex-col items-start gap-2'>
                <Paragraph level={3}>5. Apakah Anda memiliki riwayat kepemilikan polis asuransi?</Paragraph>
                <RadioButton
                  options={[
                    { value: 'ya', label: 'Ya' },
                    { value: 'tidak', label: 'Tidak' },
                  ]}
                  name='security_feature'
                  value={formik.values.security_feature}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.values.security_feature == 'ya' ? (
                <div className='flex flex-col items-start gap-2'>
                  <Paragraph level={3}>6. Berapa kali riwayat kepemilikan polis asuransi?</Paragraph>
                  <InputText
                    suffix='Kali'
                    name='polis_count'
                    onChange={formik.handleChange}
                    value={formik.values.polis_count}
                    placeholder={'Jumlah Polis'}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div>
            <Heading level={4}>Dokumen</Heading>
            <Paragraph level={2}>
              Pihak asuransi membutuhkan KTP dan STNK kamu sebagai bagian dari pembuatan polis
            </Paragraph>
            <div className='grid grid-cols-1 gap-4'>
              <div className='mt-4 flex flex-col'>
                {formik.values.ktp_file_path ? (
                  <>
                    <div className='relative my-8 h-[300px] w-full bg-gray-50'>
                      <Image
                        className='h-[300px] w-full bg-gray-50 object-contain'
                        height={300}
                        width={200}
                        src={process.env.NEXT_PUBLIC_BASE_URL + formik.values.ktp_file_path}
                        alt={`Foto KTP`}
                      />
                      <TrashIcon
                        onClick={() => {
                          formik.setFieldValue('ktp_file_path', '');
                          formik.setFieldValue('no_ktp', '');
                        }}
                        className='absolute right-2 top-2 h-6 w-6 cursor-pointer text-red-500'
                      />
                    </div>
                    {loadingOCRKTP ? (
                      <div className='flex flex-row items-center rounded-md bg-blue-100'>
                        <LoadingSpinner size='small' className='text !border-red-300' />
                        <Paragraph level={2}> Mengekstrak data dari KTP yang diunggah... </Paragraph>
                      </div>
                    ) : (
                      <div className='grid grid-cols-2 gap-2'>
                        <InputText
                          name='nik'
                          onChange={formik.handleChange}
                          value={formik.values.nik}
                          placeholder={'NIK'}
                          label='NIK'
                        />
                        <InputText
                          name='fullName'
                          onChange={formik.handleChange}
                          value={formik.values.fullName}
                          placeholder={'Nama Lengkap'}
                          label='Nama Lengkap'
                        />
                        <InputText
                          name='birthDate'
                          onChange={formik.handleChange}
                          value={formik.values.birthDate}
                          placeholder={'Tanggal Lahir'}
                          label='Tanggal Lahir'
                          type='date' // Asumsi menggunakan input tanggal
                        />
                        <InputText
                          name='birthPlace'
                          onChange={formik.handleChange}
                          value={formik.values.birthPlace}
                          placeholder={'Tempat Lahir'}
                          label='Tempat Lahir'
                        />
                        <InputText
                          name='religion'
                          onChange={formik.handleChange}
                          value={formik.values.religion}
                          placeholder={'Agama'}
                          label='Agama'
                        />
                        <InputText
                          name='marriage_status'
                          onChange={formik.handleChange}
                          value={formik.values.marriage_status}
                          placeholder={'Status Perkawinan'}
                          label='Status Perkawinan'
                        />
                        <InputText
                          name='address'
                          onChange={formik.handleChange}
                          value={formik.values.address}
                          placeholder={'Alamat'}
                          label='Alamat'
                        />
                        <InputText
                          name='rt'
                          onChange={formik.handleChange}
                          value={formik.values.rt}
                          placeholder={'RT'}
                          label='RT'
                        />
                        <InputText
                          name='rw'
                          onChange={formik.handleChange}
                          value={formik.values.rw}
                          placeholder={'RW'}
                          label='RW'
                        />
                        <InputText
                          name='village'
                          onChange={formik.handleChange}
                          value={formik.values.village}
                          placeholder={'Desa/Kelurahan'}
                          label='Desa/Kelurahan'
                        />
                        <InputText
                          name='district'
                          onChange={formik.handleChange}
                          value={formik.values.district}
                          placeholder={'Kecamatan'}
                          label='Kecamatan'
                        />
                        <InputText
                          name='regency'
                          onChange={formik.handleChange}
                          value={formik.values.regency}
                          placeholder={'Kabupaten/Kota'}
                          label='Kabupaten/Kota'
                        />
                        <InputText
                          name='province'
                          onChange={formik.handleChange}
                          value={formik.values.province}
                          placeholder={'Provinsi'}
                          label='Provinsi'
                        />
                        <InputText
                          name='gender'
                          onChange={formik.handleChange}
                          value={formik.values.gender}
                          placeholder={'Jenis Kelamin'}
                          label='Jenis Kelamin'
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <Upload name='upload_ktp' keyField='upload_ktp' label='Foto KTP' onChangeValue={handleOCRKTP} />
                )}
              </div>
              <div className='mt-4 flex flex-col'>
                {formik.values.stnk_file_path ? (
                  <>
                    <div className='relative my-8 h-[300px] w-full bg-gray-50'>
                      <Image
                        className='h-[300px] w-full bg-gray-50 object-contain'
                        height={300}
                        width={200}
                        src={process.env.NEXT_PUBLIC_BASE_URL + formik.values.stnk_file_path}
                        alt={`Foto KTP`}
                      />
                      <TrashIcon
                        onClick={() => {
                          formik.setFieldValue('stnk_file_path', '');
                        }}
                        className='absolute right-2 top-2 h-6 w-6 cursor-pointer text-red-500'
                      />
                    </div>
                    {loadingOCRSTNK ? (
                      <div className='flex flex-row items-center rounded-md bg-blue-100'>
                        <LoadingSpinner size='small' className='text !border-red-300' />
                        <Paragraph level={2}> Mengekstrak data dari STNK yang diunggah... </Paragraph>
                      </div>
                    ) : (
                      <div className='grid grid-cols-2 gap-2'>
                        <InputText
                          name='plate_number'
                          onChange={formik.handleChange}
                          value={formik.values.plate_number}
                          placeholder={'Nomor Plat'}
                          label='Nomor Plat'
                        />
                        <InputText
                          name='owner_name'
                          onChange={formik.handleChange}
                          value={formik.values.owner_name}
                          placeholder={'Nama Pemilik'}
                          label='Nama Pemilik'
                        />
                        <InputText
                          name='brand'
                          onChange={formik.handleChange}
                          value={formik.values.brand}
                          placeholder={'Merek'}
                          label='Merek'
                        />
                        <InputText
                          name='type'
                          onChange={formik.handleChange}
                          value={formik.values.type}
                          placeholder={'Jenis'}
                          label='Jenis'
                        />
                        <InputText
                          name='model'
                          onChange={formik.handleChange}
                          value={formik.values.model}
                          placeholder={'Model'}
                          label='Model'
                        />
                        <InputText
                          name='year_of_manufacture'
                          onChange={formik.handleChange}
                          value={formik.values.year_of_manufacture}
                          placeholder={'Tahun Pembuatan'}
                          label='Tahun Pembuatan'
                        />
                        <InputText
                          name='color'
                          onChange={formik.handleChange}
                          value={formik.values.color}
                          placeholder={'Warna'}
                          label='Warna'
                        />
                        <InputText
                          name='cylinder'
                          onChange={formik.handleChange}
                          value={formik.values.cylinder}
                          placeholder={'Kapasitas Silinder'}
                          label='Kapasitas Silinder'
                        />
                        <InputText
                          name='chassis_number'
                          onChange={formik.handleChange}
                          value={formik.values.chassis_number}
                          placeholder={'Nomor Rangka'}
                          label='Nomor Rangka'
                        />
                        <InputText
                          name='engine_number'
                          onChange={formik.handleChange}
                          value={formik.values.engine_number}
                          placeholder={'Nomor Mesin'}
                          label='Nomor Mesin'
                        />
                        <InputText
                          name='bpkb_number'
                          onChange={formik.handleChange}
                          value={formik.values.bpkb_number}
                          placeholder={'Nomor BPKB'}
                          label='Nomor BPKB'
                        />
                        <InputText
                          name='fuel'
                          onChange={formik.handleChange}
                          value={formik.values.fuel}
                          placeholder={'Bahan Bakar'}
                          label='Bahan Bakar'
                        />
                        <InputText
                          name='tnkb_color'
                          onChange={formik.handleChange}
                          value={formik.values.tnkb_color}
                          placeholder={'Warna TNKB'}
                          label='Warna TNKB'
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <Upload name='upload_stnk' keyField='upload_stnk' label='Foto STNK' onChangeValue={handleOCRSTNK} />
                )}

                <Paragraph level={6} className='mt-2 text-xs'>
                  * Nomor KTP akan otomatis terisi oleh sistem
                </Paragraph>
              </div>
            </div>
          </div>
          <div>
            <Heading level={4}>Video Mobil</Heading>
            <Paragraph level={2}>
              Silahkan upload video mobil yang akan di gunakan untuk melakukan analisa polis.
            </Paragraph>
            <div className='mt-4 grid grid-cols-2 gap-4'>
              {!formik.values.video_file_path ? (
                <Upload
                  allowedFiles={['video/mp4']}
                  name={'upload_video'}
                  keyField={'upload_video'}
                  label={'Video Mobil'}
                  onChangeValue={(e) => handleUploadFile(e, 'video_file_path')}
                />
              ) : (
                <div className='relative'>
                  <div className='z-2 absolute right-4 top-4 rounded-full bg-white p-2'>
                    <TrashIcon color='red' onClick={() => formik.setFieldValue('video_file_path', '')} />
                  </div>
                  <video
                    className='h-[75vh] w-full rounded-xl bg-black'
                    height={300}
                    autoPlay={true}
                    controls={true}
                    width={200}
                    src={process.env.NEXT_PUBLIC_BASE_URL + formik.values.video_file_path}
                  />
                </div>
              )}
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
              {/* <InputText name='no_plat' onChange={formik.handleChange} label={'No Plat'} placeholder={'No Plat'} /> */}
              {/* <InputText
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
              /> */}
              {/* <InputText
                name='nama_pemilik'
                onChange={formik.handleChange}
                label={'Nama Pemilik'}
                placeholder={'Nama Pemilik'}
              /> */}
            </div>
          </div>
          <div>
            <Heading level={4}>Informasi Pemilik</Heading>
            <Paragraph level={2}>
              Pihak asuransi memerlukan informasi pemilik untuk memproses polis. Tolong isi informasi pemilik dengan
              benar!
            </Paragraph>
            <div className='mt-4 flex flex-col items-start gap-2'>
              <Paragraph level={3}>Apakah alamat domisili sama dengan alamat KTP?</Paragraph>
              <RadioButton
                options={[
                  { value: 'ya', label: 'Ya' },
                  { value: 'tidak', label: 'Tidak' },
                ]}
                name='domisile_same_ktp'
                value={formik.values.domisile_same_ktp}
                onChange={formik.handleChange}
              />
            </div>
            {formik.values.domisile_same_ktp == 'tidak' ? (
              <>
                <div className='mt-6 grid grid-cols-2 gap-4'>
                  <Select
                    name='domicile_province'
                    onChange={formik.handleChange}
                    label={'Provinsi'}
                    placeholder={'Pilih provinsi'}
                    value={formik.values.domicile_province}
                    options={provinceOptions}
                    showSearchBar
                  />
                  <Select
                    name='domicile_regency'
                    onChange={formik.handleChange}
                    label={'Kota/Kabupaten'}
                    placeholder={'Pilih kota/kabupaten'}
                    value={formik.values.domicile_regency}
                    options={regencyOptions}
                    disabled={!formik.values.domicile_province}
                    showSearchBar
                  />
                  <Select
                    name='domicile_district'
                    onChange={formik.handleChange}
                    label={'Kecamatan'}
                    placeholder={'Pilih Kecamatan'}
                    value={formik.values.domicile_district}
                    options={districtOptions}
                    disabled={!formik.values.domicile_regency}
                    showSearchBar
                  />
                  <Select
                    name='domicile_village'
                    onChange={formik.handleChange}
                    label={'Kelurahan/Desa'}
                    placeholder={'Pilih kelurahan/desa'}
                    value={formik.values.domicile_village}
                    options={villageOptions}
                    disabled={!formik.values.domicile_district}
                    showSearchBar
                  />
                </div>
                <InputText
                  containerClassName='mt-4'
                  name='no_plat'
                  onChange={formik.handleChange}
                  label={'Alamat'}
                  placeholder={'Alamat'}
                />
              </>
            ) : null}
          </div>
          {errorSubmit ? (
            <Paragraph level={2} className='rounded-md bg-red-100 p-4 text-red-700'>
              {errorSubmit}
            </Paragraph>
          ) : null}

          <div className='flex flex-1 flex-col items-center justify-center'>
            <Heading level={3}>Estimasi Premi</Heading>
            <Button onClick={handleCalculatePremi} className='mt-2' isLoading={loadingSubmission} type='submit'>
              Hitung Premi
            </Button>
            {/* <Paragraph>Rp1.238.003</Paragraph> */}
          </div>
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
