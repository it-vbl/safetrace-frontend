'use client';

import { useEffect, useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useRouter } from 'next/navigation';
import Select from '@/components/molecules/Select';
import useWilayah from '@/hooks/useWilayah';
import useSTDB from '@/hooks/useSTDB';
import usePekebuns from '@/hooks/usePekebuns';
import { useDispatch } from 'react-redux';
import useReferences from '@/hooks/useReferences';
import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import DatePicker from '@/components/molecules/DatePicker';
import Accordion from '@/components/molecules/Accordion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { checkNIK, createPekebun } from '@/services/pekebun';
import { toast } from 'react-toastify';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const CreatePekebun = () => {
  const [isNIKRegistered, setIsNIKRegistered] = useState(true);

  const router = useRouter();
  const {
    listProvinsi,
    listKota,
    listKecamatan,
    listDesa,
    fetchListDesa,
    fetchListProvinsi,
    fetchListKota,
    fetchListKecamatan,
  } = useWilayah();

  const { jenisKelamin, fetchJenisKelamin, pendidikanTerakhir, fetchPendidikanTerakhir } = useReferences();

  const schemaValidation = Yup.object().shape({
    nama: Yup.string().required('Nama harus diisi'),
    nik: Yup.string().required('NIK harus diisi'),
    no_ponsel: Yup.string().required('No ponsel harus diisi'),
    tempat_lahir: Yup.string().required('Tempat lahir harus diisi'),
    tanggal_lahir: Yup.string().required('Tanggal lahir harus diisi'),
    jenis_kelamin: Yup.string().required('Jenis kelamin harus diisi'),
    pendidikan_terakhir: Yup.string().required('Pendidikan terakhir harus diisi'),
    provinsi: Yup.number().required('Provinsi harus diisi'),
    kabupaten: Yup.number().required('Kabupaten harus diisi'),
    kecamatan: Yup.number().required('Kecamatan harus diisi'),
    desa: Yup.number().required('Desa harus diisi'),
    alamat_ktp: Yup.string().required('Alamat KTP harus diisi'),
  });

  const { handleSubmit, values, touched, errors, handleBlur, handleChange } = useFormik({
    initialValues: {
      nama: '',
      nik: '',
      no_ponsel: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      jenis_kelamin: null,
      pendidikan_terakhir: null,
      provinsi: null,
      kabupaten: null,
      kecamatan: null,
      desa: null,
      alamat_ktp: '',
    },
    validationSchema: schemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await createPekebun(values);
        if (res.status == 200) {
          toast.success('Data pekebun berhasil ditambahkan');
          router.push('/stdb/pendataan');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const periksaNIK = async () => {
    try {
      const res = await checkNIK(values.nik);
      if (res.status == 200) {
        if (!res.data?.data?.terdaftar) {
          setIsNIKRegistered(false);
        }
        toast.success(res.data?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('NIK sudah digunakan');
    }
  };

  useEffect(() => {
    fetchListProvinsi();
    fetchJenisKelamin();
    fetchPendidikanTerakhir();
  }, []);

  useEffect(() => {
    if (values.provinsi) {
      fetchListKota(values.provinsi);
    }
  }, [values.provinsi]);

  useEffect(() => {
    if (values.kabupaten) {
      fetchListKecamatan(values.kabupaten);
    }
  }, [values.kabupaten]);

  useEffect(() => {
    if (values.kecamatan) {
      fetchListDesa(values.kecamatan);
    }
  }, [values.kecamatan]);

  return (
    <form onSubmit={handleSubmit} className='relative max-h-[calc(100vh-72px)] w-full'>
      <Accordion defaultIsOpen={true} title='IDENTITAS PEKEBUN'>
        <>
          <div className='flex flex-row items-end justify-start gap-2'>
            <InputText
              isRequired={true}
              label='NIK'
              name='nik'
              placeholder='Cari NIK'
              value={values.nik}
              containerClassName='w-[300px]'
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.nik && errors.nik}
            />
            <Button onClick={periksaNIK} variant='secondary' className='h-[30px]'>
              Cari
            </Button>
          </div>
          {!isNIKRegistered ? (
            <>
              <div className='grid grid-cols-3 gap-6 border-b border-dashed border-b-gray-300 py-4'>
                <InputText
                  isRequired={true}
                  label='Nama'
                  name='nama'
                  placeholder='Masukan Nama'
                  className='w-full'
                  value={values.nama}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.nama && errors.nama}
                />
                <InputText
                  isRequired={true}
                  label='Tempat Lahir'
                  name='tempat_lahir'
                  placeholder='Masukan Tempat Lahir'
                  className='w-full'
                  value={values.tempat_lahir}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.tempat_lahir && errors.tempat_lahir}
                />
                <DatePicker
                  label='Tanggal Lahir'
                  name='tanggal_lahir'
                  placeholder='Masukan Tanggal Lahir'
                  value={values.tanggal_lahir ? moment(values.tanggal_lahir, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.tanggal_lahir && errors.tanggal_lahir}
                />
              </div>
              <div className='grid grid-cols-3 gap-6 border-b border-dashed border-b-gray-300 py-4'>
                <Select
                  selectClassName='!min-h-[30px] h-[30px]'
                  label='Jenis Kelamin'
                  name='jenis_kelamin'
                  placeholder='Pilih Jenis Kelamin'
                  options={jenisKelamin}
                  value={values.jenis_kelamin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.jenis_kelamin && errors.jenis_kelamin}
                />
                <Select
                  selectClassName='!min-h-[30px] h-[30px]'
                  label='Provinsi'
                  name='provinsi'
                  placeholder='Pilih Provinsi'
                  options={listProvinsi}
                  value={values.provinsi}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.provinsi && errors.provinsi}
                  showSearchBar={true}
                />
                <Select
                  selectClassName='!min-h-[30px] h-[30px]'
                  label='Kabupaten/Kota'
                  name='kabupaten'
                  placeholder='Pilih Kabupaten/Kota'
                  options={listKota}
                  value={values.kabupaten}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.kabupaten && errors.kabupaten}
                  showSearchBar={true}
                />
              </div>
              <div className='grid grid-cols-3 gap-6 border-b border-dashed border-b-gray-300 py-4'>
                <Select
                  selectClassName='!min-h-[30px] h-[30px]'
                  label='Kecamatan'
                  name='kecamatan'
                  placeholder='Pilih Kecamatan'
                  options={listKecamatan}
                  value={values.kecamatan}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.kecamatan && errors.kecamatan}
                  showSearchBar={true}
                />
                <Select
                  isRequired={true}
                  selectClassName='!min-h-[30px] h-[30px]'
                  label='Desa/Kelurahan'
                  name='desa'
                  placeholder='Pilih Desa/Kelurahan'
                  options={listDesa}
                  value={values.desa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.desa && errors.desa}
                  showSearchBar={true}
                />
                <InputText
                  isRequired={true}
                  label='Alamat Sesuai KTP'
                  name='alamat_ktp'
                  placeholder='Masukan Alamat Sesuai KTP'
                  className='w-full'
                  value={values.alamat_ktp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.alamat_ktp && errors.alamat_ktp}
                />
              </div>
              <div className='grid grid-cols-3 gap-6 py-4'>
                <Select
                  isRequired={true}
                  selectClassName='!min-h-[30px] h-[30px]'
                  label='Pendidikan Terakhir'
                  name='pendidikan_terakhir'
                  placeholder='Pilih Pendidikan Terakhir'
                  options={pendidikanTerakhir}
                  value={values.pendidikan_terakhir}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.pendidikan_terakhir && errors.pendidikan_terakhir}
                />
                <InputText
                  isRequired={true}
                  label='Nomor Telepon'
                  name='no_ponsel'
                  placeholder='Masukan Nomor Telepon'
                  className='w-full'
                  value={values.no_ponsel}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.no_ponsel && errors.no_ponsel}
                />
              </div>
            </>
          ) : null}
        </>
      </Accordion>
      <div className='mt-4 flex flex-row justify-end gap-2'>
        <Button type='button' className='bg-red-500'>
          Batalkan
        </Button>
        <Button type='submit'>Simpan</Button>
      </div>
    </form>
  );
};

export default CreatePekebun;
