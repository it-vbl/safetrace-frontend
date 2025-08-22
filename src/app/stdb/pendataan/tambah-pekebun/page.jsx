'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useFormik } from 'formik';
import moment from 'moment';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Accordion from '@/components/molecules/Accordion';
import DatePicker from '@/components/molecules/DatePicker';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import ModalNIKAlreadyUsed from '@/components/organisms/Modal/ModalNIKAlreadyUsed';
import useReferences from '@/hooks/useReferences';
import useWilayah from '@/hooks/useWilayah';
import { checkNIK, createPekebun } from '@/services/pekebun';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const CreatePekebun = () => {
  const [isNIKRegistered, setIsNIKRegistered] = useState(true);
  const [isCheckNIK, setIsCheckNIK] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalNIK, setModalNIK] = useState('');
  const [modalIdPekebun, setModalIdPekebun] = useState(null);

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
    nik: Yup.string()
      .required('NIK harus diisi')
      .matches(/^\d{16}$/, 'NIK harus 16 digit angka'),
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

  function formatErrorMessage(response) {
    let message = `${response.message}:\n\n`;

    // Collect all error messages from the errors object
    const errorList = [];
    for (const key in response.errors) {
      if (Array.isArray(response.errors[key])) {
        errorList.push(...response.errors[key]);
      }
    }

    // Append numbered errors
    errorList.forEach((err, index) => {
      message += `${index > 0 ? ',' : ''} ${err.replace(/\.$/, '')}\n`;
    });

    return message.trim();
  }

  const {
    handleSubmit,
    validateForm,
    values,
    touched,
    setTouched,
    errors,
    setErrors,
    handleBlur,
    handleChange,
    isSubmitting,
    setFieldValue,
  } = useFormik({
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
        toast.error(formatErrorMessage(error?.response?.data));
      } finally {
        setSubmitting(false);
      }
    },
  });

  const periksaNIK = async () => {
    try {
      setIsCheckNIK(true);
      const errors = await validateForm();
      setErrors(errors);
      if (!errors.nik) {
        const res = await checkNIK(values.nik);
        if (res.status == 200) {
          if (!res.data?.data?.terdaftar) {
            setIsNIKRegistered(false);
            setErrors({});
            setTouched({});
            setModalOpen(false);
          } else {
            // NIK already used, show modal
            setModalNIK(values.nik);
            setModalIdPekebun(res.data?.data?.pekebun?.id);
            setModalOpen(true);
          }
          toast.success(res.data?.message);
        }
      }
    } catch (error) {
      console.error(error);
      // Remove toast error here to avoid duplicate message with modal
      // toast.error('NIK sudah digunakan');
    } finally {
      setIsCheckNIK(false);
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
    <>
      <form onSubmit={handleSubmit} className='relative max-h-[calc(100vh-72px)] w-full'>
        <Accordion defaultIsOpen={true} title='IDENTITAS PEKEBUN'>
          <>
            <div
              className={`flex flex-row ${
                errors?.nik && touched?.nik ? 'items-center' : 'items-end'
              } justify-start gap-2`}
            >
              <InputText
                isRequired={true}
                label='NIK'
                name='nik'
                placeholder='Cari NIK'
                value={values.nik}
                containerClassName='w-[300px]'
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
              <Button
                isDisabled={errors?.nik}
                isLoading={isCheckNIK}
                onClick={periksaNIK}
                variant='secondary'
                className='h-[30px]'
              >
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
                    errors={errors}
                    touched={touched}
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
                    errors={errors}
                    touched={touched}
                  />
                  <DatePicker
                    label='Tanggal Lahir'
                    name='tanggal_lahir'
                    placeholder='Masukan Tanggal Lahir'
                    value={values.tanggal_lahir ? moment(values.tanggal_lahir, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
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
                    errors={errors}
                    touched={touched}
                  />
                  <Select
                    selectClassName='!min-h-[30px] h-[30px]'
                    label='Provinsi'
                    name='provinsi'
                    placeholder='Pilih Provinsi'
                    options={listProvinsi}
                    value={values.provinsi}
                    onChange={(e) => {
                      setFieldValue('kabupaten', '');
                      setFieldValue('kecamatan', '');
                      setFieldValue('desa', '');
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    showSearchBar={true}
                  />
                  <Select
                    selectClassName='!min-h-[30px] h-[30px]'
                    label='Kabupaten/Kota'
                    name='kabupaten'
                    placeholder='Pilih Kabupaten/Kota'
                    options={listKota}
                    value={values.kabupaten}
                    onChange={(e) => {
                      setFieldValue('kecamatan', '');
                      setFieldValue('desa', '');
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
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
                    onChange={(e) => {
                      setFieldValue('desa', '');
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
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
                    errors={errors}
                    touched={touched}
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
                    errors={errors}
                    touched={touched}
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
                    errors={errors}
                    touched={touched}
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
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </>
            ) : null}
          </>
        </Accordion>
        <div className='mt-4 flex flex-row justify-end gap-2'>
          <Button onClick={() => router.back()} isLoading={isSubmitting} type='button' className='bg-red-500'>
            Batalkan
          </Button>
          <Button isLoading={isSubmitting} type='submit'>
            Simpan
          </Button>
        </div>
      </form>
      <ModalNIKAlreadyUsed open={modalOpen} setOpen={setModalOpen} nik={modalNIK} idPekebun={modalIdPekebun} />
    </>
  );
};

export default CreatePekebun;
