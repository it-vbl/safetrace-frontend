'use client';

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import BaseModal from '@/components/molecules/Modal';
import Select from '@/components/molecules/Select';
import useReferences from '@/hooks/useReferences';
import { updateKebun } from '@/services/kebun';

const ModalEditKebun = ({ isOpen, onClose, kebunData, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Get references for dropdown options
  const { jenisLegalitas, fetchJenisLegalitas } = useReferences();

  // Month options for waktu_tanam
  const monthOptions = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  // Year options (last 20 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  // RSPO/ISPO options
  const statusOptions = [
    { value: 'sudah', label: 'Sudah' },
    { value: 'belum', label: 'Belum' },
  ];

  // Fetch jenis legalitas options when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchJenisLegalitas();
    }
  }, [isOpen, fetchJenisLegalitas]);

  // Parse existing data for form initialization
  const parseExistingData = (data) => {
    if (!data) return {};

    // Parse waktu_tanam date
    let waktuTanamMonth = '';
    let waktuTanamYear = '';
    if (data.waktu_tanam) {
      const date = new Date(data.waktu_tanam);
      waktuTanamMonth = (date.getMonth() + 1).toString().padStart(2, '0');
      waktuTanamYear = date.getFullYear().toString();
    }

    return {
      id_kebun: data.id_kebun || '',
      nama_petani: data.nama_petani || '',
      kelompok_tani: data.kelompok_tani || '',
      lokasi_kebun: data.lokasi_kebun || '',
      luas_kebun: data.luas_kebun || '',
      luas_peta: data.luas_peta || '',
      waktu_tanam_month: waktuTanamMonth,
      waktu_tanam_year: waktuTanamYear,
      is_rspo: data.is_rspo ? 'sudah' : 'belum',
      is_ispo: data.is_ispo ? 'sudah' : 'belum',
      jenis_legalitas: data.jenis_legalitas || '',
      nomor_legalitas: data.nomor_legalitas || '',
      pemiliki_legalitas: data.pemiliki_legalitas || '',
      nomor_stdb: data.nomor_stdb || '',
      jumlah_pokok: data.jumlah_pokok || '',
    };
  };

  const validationSchema = Yup.object({
    id_kebun: Yup.string().required('Id Kebun wajib diisi'),
    nama_petani: Yup.string().required('Nama Petani wajib diisi'),
    lokasi_kebun: Yup.string().required('Lokasi Kebun wajib diisi'),
    luas_kebun: Yup.string().required('Luas Kebun wajib diisi'),
    luas_peta: Yup.string().required('Luas Peta wajib diisi'),
    waktu_tanam_month: Yup.string().required('Bulan tanam wajib dipilih'),
    waktu_tanam_year: Yup.string().required('Tahun tanam wajib dipilih'),
    is_rspo: Yup.string().required('Status RSPO wajib dipilih'),
    is_ispo: Yup.string().required('Status ISPO wajib dipilih'),
    jenis_legalitas: Yup.string().required('Jenis Legalitas wajib dipilih'),
    nomor_legalitas: Yup.string().required('Nomor Legalitas wajib diisi'),
    pemiliki_legalitas: Yup.string().required('Pemilik Legalitas wajib diisi'),
    nomor_stdb: Yup.string().required('Nomor STDB wajib diisi'),
    jumlah_pokok: Yup.number()
      .required('Jumlah Pokok wajib diisi')
      .min(1, 'Jumlah pokok harus lebih dari 0'),
  });

  const formik = useFormik({
    initialValues: parseExistingData(kebunData),
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        // Format waktu_tanam as YYYY-MM-DD
        const waktuTanam = `${values.waktu_tanam_year}-${values.waktu_tanam_month}-01`;

        // Prepare API payload
        const payload = {
          id_kebun: values.id_kebun,
          nama_petani: values.nama_petani,
          lokasi_kebun: values.lokasi_kebun,
          luas: values.luas_kebun,
          waktu_tanam: waktuTanam,
          jumlah_pokok: parseInt(values.jumlah_pokok),
          is_rspo: values.is_rspo === 'sudah',
          is_ispo: values.is_ispo === 'sudah',
          jenis_legalitas: values.jenis_legalitas,
          nomor_legalitas: values.nomor_legalitas,
          pemiliki_legalitas: values.pemiliki_legalitas,
          nomor_stdb: values.nomor_stdb,
        };

        // Call API
        const response = await updateKebun(kebunData?.id_kebun, payload);

        if (response?.data?.status === 'success') {
          toast.success('Data kebun berhasil diperbarui');
          onSuccess?.();
          onClose();
        } else {
          throw new Error(
            response?.data?.message || 'Gagal memperbarui data kebun'
          );
        }
      } catch (error) {
        console.error('Error updating kebun:', error);
        toast.error(error.message || 'Gagal memperbarui data kebun');
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && kebunData) {
      formik.setValues(parseExistingData(kebunData));
    }
  }, [isOpen, kebunData, formik]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <BaseModal
      open={isOpen}
      setOpen={handleClose}
      label="UBAH KEBUN"
      className="max-w-4xl"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Form Fields Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Id Kebun */}
            <InputText
              label="Id Kebun"
              name="id_kebun"
              value={formik.values.id_kebun}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isError={formik.touched.id_kebun && formik.errors.id_kebun}
              errors={formik.errors}
              touched={formik.touched}
            />

            {/* Nama Petani */}
            <InputText
              label="Nama Petani"
              name="nama_petani"
              value={formik.values.nama_petani}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isError={formik.touched.nama_petani && formik.errors.nama_petani}
              errors={formik.errors}
              touched={formik.touched}
            />

            {/* Luas Kebun */}
            <InputText
              label="Luas Kebun (Ha)"
              name="luas_kebun"
              type="number"
              value={formik.values.luas_kebun}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="0.00"
              isError={formik.touched.luas_kebun && formik.errors.luas_kebun}
              errors={formik.errors}
              touched={formik.touched}
            />

            {/* Waktu Tanam */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Waktu Tanam
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  name="waktu_tanam_month"
                  value={formik.values.waktu_tanam_month}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={monthOptions}
                  placeholder="Bulan"
                  isError={
                    formik.touched.waktu_tanam_month &&
                    formik.errors.waktu_tanam_month
                  }
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <Select
                  name="waktu_tanam_year"
                  value={formik.values.waktu_tanam_year}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={yearOptions}
                  placeholder="Tahun"
                  isError={
                    formik.touched.waktu_tanam_year &&
                    formik.errors.waktu_tanam_year
                  }
                  errors={formik.errors}
                  touched={formik.touched}
                />
              </div>
            </div>

            {/* ISPO */}
            <Select
              label="ISPO"
              name="is_ispo"
              value={formik.values.is_ispo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={statusOptions}
              placeholder="Pilih Status"
              isError={formik.touched.is_ispo && formik.errors.is_ispo}
              errors={formik.errors}
              touched={formik.touched}
            />

            {/* No. Legalitas */}
            <InputText
              label="No. Legalitas"
              name="nomor_legalitas"
              value={formik.values.nomor_legalitas}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isError={
                formik.touched.nomor_legalitas && formik.errors.nomor_legalitas
              }
              errors={formik.errors}
              touched={formik.touched}
            />

            {/* STDB */}
            <InputText
              label="STDB"
              name="nomor_stdb"
              value={formik.values.nomor_stdb}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isError={formik.touched.nomor_stdb && formik.errors.nomor_stdb}
              errors={formik.errors}
              touched={formik.touched}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Kelompok Tani */}
            <InputText
              label="Kelompok Tani"
              name="kelompok_tani"
              value={formik.values.kelompok_tani}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isError={
                formik.touched.kelompok_tani && formik.errors.kelompok_tani
              }
              errors={formik.errors}
              touched={formik.touched}
            />

            {/* Lokasi Kebun */}
            <InputText
              label="Lokasi Kebun"
              name="lokasi_kebun"
              value={formik.values.lokasi_kebun}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isError={
                formik.touched.lokasi_kebun && formik.errors.lokasi_kebun
              }
              errors={formik.errors}
              touched={formik.touched}
            />

            {/* Luas Peta */}
            <InputText
              label="Luas Peta (Ha)"
              name="luas_peta"
              type="number"
              value={formik.values.luas_peta}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="0.00"
              isError={formik.touched.luas_peta && formik.errors.luas_peta}
              errors={formik.errors}
              touched={formik.touched}
            />

            {/* RSPO */}
            <Select
              label="RSPO"
              name="is_rspo"
              value={formik.values.is_rspo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={statusOptions}
              placeholder="Pilih Status"
              isError={formik.touched.is_rspo && formik.errors.is_rspo}
              errors={formik.errors}
              touched={formik.touched}
            />

            {/* Jenis Legalitas */}
            <Select
              label="Jenis Legalitas"
              name="jenis_legalitas"
              value={formik.values.jenis_legalitas}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={jenisLegalitas}
              placeholder="Pilih Jenis"
              isError={
                formik.touched.jenis_legalitas && formik.errors.jenis_legalitas
              }
              errors={formik.errors}
              touched={formik.touched}
            />

            {/* Pemilik Legalitas */}
            <InputText
              label="Pemilik Legalitas"
              name="pemiliki_legalitas"
              value={formik.values.pemiliki_legalitas}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isError={
                formik.touched.pemiliki_legalitas &&
                formik.errors.pemiliki_legalitas
              }
              errors={formik.errors}
              touched={formik.touched}
            />

            {/* Jumlah Pokok */}
            <InputText
              label="Jumlah Pokok"
              name="jumlah_pokok"
              type="number"
              value={formik.values.jumlah_pokok}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="0"
              isError={
                formik.touched.jumlah_pokok && formik.errors.jumlah_pokok
              }
              errors={formik.errors}
              touched={formik.touched}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="danger"
            onClick={handleClose}
            disabled={isLoading}
          >
            Batalkan
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            Simpan
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default ModalEditKebun;
