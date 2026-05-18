'use client';

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import DatePicker from '@/components/molecules/DatePicker';
import InputText from '@/components/molecules/InputText';
import BaseModal from '@/components/molecules/Modal';
import Select from '@/components/molecules/Select';
import TextArea from '@/components/molecules/TextArea';
import useWilayah from '@/hooks/useWilayah';

const validationSchema = Yup.object({
  id: Yup.string().required('Id Petani is required'),
  nama: Yup.string().required('Nama Petani is required'),
  jenis_kelamin: Yup.string().required('Jenis Kelamin is required'),
  kelompok_tani: Yup.string().required('Kelompok Tani is required'),
  alamat: Yup.string().required('Alamat is required'),
  no_ktp: Yup.string().required('No. KTP is required'),
  tempat_lahir: Yup.string().required('Tempat Lahir is required'),
  tanggal_lahir: Yup.string().required('Tanggal Lahir is required'),
  no_kk: Yup.string().required('No. KK is required'),
  status_pernikahan: Yup.string().required('Status Pernikahan is required'),
  no_nib: Yup.string(),
  tanggal_terbit_sppl: Yup.string(),
  tanggal_bergabung: Yup.string(),
  no_whatsapp: Yup.string(),
  keanggotaan: Yup.string().required('Status Keanggotaan is required'),
  pendidikan_terakhir: Yup.string().required('Pendidikan Terakhir is required'),
  provinsi: Yup.string().required('Provinsi is required'),
  kabupaten: Yup.string().required('Kabupaten is required'),
  kecamatan: Yup.string().required('Kecamatan is required'),
  desa: Yup.string().required('Desa is required'),
});

const EditPetaniModal = ({
  open,
  setOpen,
  initialValues,
  onSave,
  jenisKelamin = [],
  statusPerkawinan = [],
  kelompokTani = [],
  pendidikanTerakhir = [],
  statusKeanggotaan = [],
}) => {
  const {
    listProvinsi,
    listKota,
    listKecamatan,
    listDesa,
    fetchListProvinsi,
    fetchListKota,
    fetchListKecamatan,
    fetchListDesa,
  } = useWilayah();

  useEffect(() => {
    if (open) {
      fetchListProvinsi();

      if (initialValues.provinsi) {
        fetchListKota(initialValues.provinsi);
      }

      if (initialValues.kabupaten) {
        fetchListKecamatan(initialValues.kabupaten);
      }

      if (initialValues.kecamatan) {
        fetchListDesa(initialValues.kecamatan);
      }
    }
  }, [open, initialValues, fetchListProvinsi, fetchListKota, fetchListKecamatan, fetchListDesa]);

  const handleProvinsiChange = (e) => {
    formik.handleChange(e);
    formik.setFieldValue('kabupaten', '');
    formik.setFieldValue('kecamatan', '');
    formik.setFieldValue('desa', '');
    if (e.target.value) {
      fetchListKota(e.target.value);
    }
  };

  const handleKotaChange = (e) => {
    formik.handleChange(e);
    formik.setFieldValue('kecamatan', '');
    formik.setFieldValue('desa', '');
    if (e.target.value) {
      fetchListKecamatan(e.target.value);
    }
  };

  const handleKecamatanChange = (e) => {
    formik.handleChange(e);
    formik.setFieldValue('desa', '');
    if (e.target.value) {
      fetchListDesa(e.target.value);
    }
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
      setOpen(false);
    },
    enableReinitialize: true,
  });

  return (
    <BaseModal
      open={open}
      setOpen={setOpen}
      label="UBAH IDENTITAS PETANI"
      isShowCloseIcon={true}
      className="max-w-5xl"
    >
      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm text-gray-700 mt-4"
      >
        {/* Row 1 */}
        <Select
          label="Status Keanggotaan"
          name="keanggotaan"
          value={formik.values.keanggotaan}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={statusKeanggotaan}
          isError={formik.touched.keanggotaan && formik.errors.keanggotaan}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <InputText
          label="Id Petani"
          name="id"
          value={formik.values.id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isError={formik.touched.id && formik.errors.id}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <InputText
          label="Nama Petani"
          name="nama"
          value={formik.values.nama}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isError={formik.touched.nama && formik.errors.nama}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />

        {/* Row 2 */}
        <Select
          label="Jenis Kelamin"
          name="jenis_kelamin"
          value={formik.values.jenis_kelamin}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={jenisKelamin}
          isError={formik.touched.jenis_kelamin && formik.errors.jenis_kelamin}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <Select
          label="Kelompok Tani"
          name="kelompok_tani"
          value={formik.values.kelompok_tani}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={kelompokTani}
          isError={formik.touched.kelompok_tani && formik.errors.kelompok_tani}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <InputText
          label="No. KTP"
          name="no_ktp"
          value={formik.values.no_ktp}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isError={formik.touched.no_ktp && formik.errors.no_ktp}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />

        {/* Row 3 */}
        <InputText
          label="No. KK"
          name="no_kk"
          value={formik.values.no_kk}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isError={formik.touched.no_kk && formik.errors.no_kk}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <Select
          label="Status Pernikahan"
          name="status_pernikahan"
          value={formik.values.status_pernikahan}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={statusPerkawinan}
          isError={
            formik.touched.status_pernikahan && formik.errors.status_pernikahan
          }
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <Select
          label="Provinsi"
          name="provinsi"
          value={formik.values.provinsi}
          onChange={handleProvinsiChange}
          onBlur={formik.handleBlur}
          options={listProvinsi}
          isError={formik.touched.provinsi && formik.errors.provinsi}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />

        {/* Row 4 */}
        <Select
          label="Kabupaten/Kota"
          name="kabupaten"
          value={formik.values.kabupaten}
          onChange={handleKotaChange}
          onBlur={formik.handleBlur}
          options={listKota}
          isError={formik.touched.kabupaten && formik.errors.kabupaten}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <Select
          label="Desa"
          name="desa"
          value={formik.values.desa}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={listDesa}
          isError={formik.touched.desa && formik.errors.desa}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <Select
          label="Kecamatan"
          name="kecamatan"
          value={formik.values.kecamatan}
          onChange={handleKecamatanChange}
          onBlur={formik.handleBlur}
          options={listKecamatan}
          isError={formik.touched.kecamatan && formik.errors.kecamatan}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />

        {/* Row 5 */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <TextArea
            label="Alamat"
            name="alamat"
            value={formik.values.alamat}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            hasError={formik.touched.alamat && formik.errors.alamat}
            helperText={
              formik.touched.alamat && formik.errors.alamat
                ? formik.errors.alamat
                : ''
            }
            isRequired
            maxChar={500}
            isFullWidth={true}
          />
        </div>

        {/* Row 6 */}
        <Select
          label="Pendidikan Terakhir"
          name="pendidikan_terakhir"
          value={formik.values.pendidikan_terakhir}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={pendidikanTerakhir}
          isError={
            formik.touched.pendidikan_terakhir && formik.errors.pendidikan_terakhir
          }
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <InputText
          label="No Whatsapp"
          name="no_whatsapp"
          value={formik.values.no_whatsapp}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isError={formik.touched.no_whatsapp && formik.errors.no_whatsapp}
          errors={formik.errors}
          touched={formik.touched}
        />
        <InputText
          label="Tempat Lahir"
          name="tempat_lahir"
          value={formik.values.tempat_lahir}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isError={formik.touched.tempat_lahir && formik.errors.tempat_lahir}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />

        {/* Row 7 */}
        <DatePicker
          label="Tanggal Lahir"
          name="tanggal_lahir"
          value={formik.values.tanggal_lahir}
          onChange={(e) =>
            formik.setFieldValue('tanggal_lahir', e.target.value)
          }
          onBlur={formik.handleBlur}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <InputText
          label="No. NIB"
          name="no_nib"
          value={formik.values.no_nib}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isError={formik.touched.no_nib && formik.errors.no_nib}
          errors={formik.errors}
          touched={formik.touched}
        />
        <DatePicker
          label="Tanggal Terbit SPPL"
          name="tanggal_terbit_sppl"
          value={formik.values.tanggal_terbit_sppl}
          onChange={(e) =>
            formik.setFieldValue('tanggal_terbit_sppl', e.target.value)
          }
          onBlur={formik.handleBlur}
          errors={formik.errors}
          touched={formik.touched}
        />

        {/* Row 8 */}
        <DatePicker
          label="Tanggal Bergabung"
          name="tanggal_bergabung"
          value={formik.values.tanggal_bergabung}
          onChange={(e) =>
            formik.setFieldValue('tanggal_bergabung', e.target.value)
          }
          onBlur={formik.handleBlur}
          errors={formik.errors}
          touched={formik.touched}
        />
        <DatePicker
          label="Tanggal Keluar"
          name="tanggal_keluar"
          value={formik.values.tanggal_keluar}
          onChange={(e) =>
            formik.setFieldValue('tanggal_keluar', e.target.value)
          }
          onBlur={formik.handleBlur}
          errors={formik.errors}
          touched={formik.touched}
        />
        <div className="hidden lg:block"></div> {/* Empty space for grid alignment */}

        {/* Action Buttons */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700"
          >
            Batalkan
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditPetaniModal;
