'use client';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import useReferences from '@/hooks/useReferences';
import { getListPetani } from '@/services/petani';
import getYearOptions from '@/utils/getYearOptions';

const rspoOptions = [
  { label: 'Sudah', value: 'sudah' },
  { label: 'Belum', value: 'belum' },
];

const ispoOptions = [
  { label: 'Sudah', value: 'sudah' },
  { label: 'Belum', value: 'belum' },
];

const DetailKebun = ({
  idKebun,
  kebunData,
  onNext,
  onCancel,
  isSubmitting,
}) => {
  const [petaniOptions, setPetaniOptions] = useState([]);
  const {
    kelompokTani,
    jenisLegalitas,
    fetchKelompokTani,
    fetchJenisLegalitas,
  } = useReferences();

  // Fetch kelompok tani and jenis legalitas options on component mount
  useEffect(() => {
    if (kelompokTani.length === 0) {
      fetchKelompokTani();
    }
    if (jenisLegalitas.length === 0) {
      fetchJenisLegalitas();
    }
  }, [
    kelompokTani.length,
    jenisLegalitas.length,
    fetchKelompokTani,
    fetchJenisLegalitas,
  ]);

  // Fetch petani options when kebunData is loaded (for editing existing kebun)
  useEffect(() => {
    if (kebunData && kebunData.kelompok_tani) {
      fetchPetaniByKelompok(kebunData.kelompok_tani);
    }
  }, [kebunData]);

  // Function to fetch petani based on kelompok tani
  const fetchPetaniByKelompok = async (kelompokTaniValue) => {
    if (kelompokTaniValue) {
      try {
        const response = await getListPetani({ kelompok: kelompokTaniValue });
        const options = response.data.data.results.map((item) => ({
          label: item.nama,
          value: item.id,
        }));
        setPetaniOptions(options);
        // Clear petani validation error once options are loaded
        if (formik.errors.petani_id) {
          formik.setFieldError('petani_id', '');
        }
      } catch (error) {
        console.error('Error fetching petani list:', error);
        setPetaniOptions([]);
      }
    } else {
      setPetaniOptions([]);
    }
  };

  const validationSchema = Yup.object().shape({
    id_kebun: Yup.string().required('ID Kebun harus diisi'),
    kelompok_tani: Yup.string().required('Kelompok Tani harus diisi'),
    petani_id: Yup.string().required('Nama Petani harus diisi'),
    lokasi_kebun: Yup.string().required('Lokasi Kebun harus diisi'),
    luas: Yup.string()
      .required('Luas Kebun harus diisi')
      .test('is-number', 'Luas kebun harus berupa angka', (value) => {
        if (!value) return false;
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0;
      }),
    luas_peta: Yup.string()
      .required('Luas Peta harus diisi')
      .test('is-number', 'Luas peta harus berupa angka', (value) => {
        if (!value) return false;
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0;
      }),
    waktu_tanam_month: Yup.string().required('Bulan tanam harus diisi'),
    waktu_tanam_year: Yup.string().required('Tahun tanam harus diisi'),
    rspo: Yup.string().required('RSPO harus diisi'),
    ispo: Yup.string().required('ISPO harus diisi'),
    jenis_legalitas: Yup.string().required('Jenis Legalitas harus diisi'),
    no_legalitas: Yup.string().required('No. Legalitas harus diisi'),
    pemilik_legalitas: Yup.string().required('Pemilik Legalitas harus diisi'),
    stdb: Yup.string().required('STDB harus diisi'),
  });

  const formik = useFormik({
    initialValues: {
      id_kebun: kebunData?.id_kebun || '',
      kelompok_tani: kebunData?.kelompok_tani || kebunData?.kelompok || null,
      petani_id: kebunData?.petani_id?.toString() || '',
      lokasi_kebun: kebunData?.lokasi_kebun || '',
      luas: kebunData?.luas?.toString() || '',
      luas_peta: kebunData?.luas_peta?.toString() || '',
      waktu_tanam_month: kebunData?.waktu_tanam
        ? kebunData.waktu_tanam.split('-')[1]
        : '',
      waktu_tanam_year: kebunData?.waktu_tanam
        ? kebunData.waktu_tanam.split('-')[0]
        : '',
      rspo: kebunData?.is_rspo ? 'sudah' : 'belum',
      ispo: kebunData?.is_ispo ? 'sudah' : 'belum',
      jenis_legalitas: kebunData?.jenis_legalitas || '',
      no_legalitas: kebunData?.nomor_legalitas || '',
      pemilik_legalitas: kebunData?.pemiliki_legalitas || '',
      stdb: kebunData?.nomor_stdb || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('CHECK BEFORE ON NEXT', values);
      await onNext(values);
    },
  });

  // Update form values when kebunData changes
  useEffect(() => {
    if (kebunData) {
      console.log('Updating form with kebunData:', kebunData);
      formik.setValues({
        id_kebun: kebunData.id_kebun || '',
        kelompok_tani: kebunData.kelompok_tani || kebunData.kelompok || '-',
        petani_id: kebunData.petani_id?.toString() || '',
        lokasi_kebun: kebunData.lokasi_kebun || '',
        luas: kebunData.luas?.toString() || '',
        luas_peta: kebunData.luas_peta?.toString() || '',
        waktu_tanam_month: kebunData.waktu_tanam
          ? kebunData.waktu_tanam.split('-')[1]
          : '',
        waktu_tanam_year: kebunData.waktu_tanam
          ? kebunData.waktu_tanam.split('-')[0]
          : '',
        rspo: kebunData.is_rspo ? 'sudah' : 'belum',
        ispo: kebunData.is_ispo ? 'sudah' : 'belum',
        jenis_legalitas: kebunData.jenis_legalitas || '',
        no_legalitas: kebunData.nomor_legalitas || '',
        pemilik_legalitas: kebunData.pemiliki_legalitas || '',
        stdb: kebunData.nomor_stdb || '',
      });
    }
  }, [kebunData]);

  // Handle kelompok tani change
  const handleKelompokTaniChange = (e) => {
    const value = e.target.value;

    // Use setFieldValue to ensure the value is properly set
    formik.setFieldValue('kelompok_tani', value);
    formik.setFieldTouched('kelompok_tani', false);

    console.log('Current formik values:', formik.values);

    // Reset petani selection and fetch new petani options
    formik.setFieldValue('petani_id', '');

    fetchPetaniByKelompok(value);
  };

  const handleSubmit = async () => {
    // Custom validation for petani field
    const errors = await formik.validateForm();

    // If kelompok tani is selected but no petani options are loaded yet, wait a bit
    if (formik.values.kelompok_tani && petaniOptions.length === 0) {
      return; // Don't submit yet, wait for options to load
    }

    // If kelompok tani is selected and petani options are available but no petani selected
    if (
      formik.values.kelompok_tani &&
      petaniOptions.length > 0 &&
      !formik.values.petani_id
    ) {
      formik.setFieldError('petani_id', 'Nama Petani harus diisi');
      return;
    }

    if (Object.keys(errors).length === 0) {
      await onNext(formik.values);
    } else {
      console.log('Validation failed:', errors);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-300 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">DETAIL KEBUN</h3>
        <div className="grid grid-cols-3 gap-6 border-b border-dashed border-gray-300 py-4">
          <InputText
            label="ID Kebun"
            name="id_kebun"
            placeholder="KBN001"
            value={formik.values.id_kebun}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
          <Select
            label="Kelompok Tani"
            name="kelompok_tani"
            placeholder="Pilih Kelompok Tani"
            options={kelompokTani}
            value={formik.values.kelompok_tani}
            onChange={handleKelompokTaniChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
          <Select
            label="Nama Petani"
            name="petani_id"
            placeholder="Pilih Nama Petani"
            options={petaniOptions}
            value={formik.values.petani_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
        </div>

        <div className="grid grid-cols-3 gap-6 border-b border-dashed border-gray-300 py-4">
          <InputText
            label="Lokasi Kebun"
            name="lokasi_kebun"
            placeholder="Masukan Lokasi Kebun"
            value={formik.values.lokasi_kebun}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
          <InputText
            label="Luas Kebun (Ha)"
            name="luas"
            placeholder="Masukan Luas Kebun"
            type="number"
            step="0.01"
            value={formik.values.luas}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
          <InputText
            label="Luas Kebun (Ha)"
            name="luas_peta"
            placeholder="Masukan Luas Kebun"
            type="number"
            step="0.01"
            value={formik.values.luas_peta}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
        </div>

        <div className="grid grid-cols-3 gap-6 border-b border-dashed border-gray-300 py-4">
          <div className="flex flex-row gap-2 items-end">
            <Select
              label="Waktu Tanam"
              name="waktu_tanam_month"
              placeholder="Bulan"
              options={[
                { label: 'Januari', value: '01' },
                { label: 'Februari', value: '02' },
                { label: 'Maret', value: '03' },
                { label: 'April', value: '04' },
                { label: 'Mei', value: '05' },
                { label: 'Juni', value: '06' },
                { label: 'Juli', value: '07' },
                { label: 'Agustus', value: '08' },
                { label: 'September', value: '09' },
                { label: 'Oktober', value: '10' },
                { label: 'November', value: '11' },
                { label: 'Desember', value: '12' },
              ]}
              value={formik.values.waktu_tanam_month}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errors={formik.errors}
              touched={formik.touched}
              isRequired
            />
            <Select
              label=""
              name="waktu_tanam_year"
              placeholder="Tahun"
              options={getYearOptions(2000).reverse()}
              value={formik.values.waktu_tanam_year}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errors={formik.errors}
              touched={formik.touched}
              isRequired
            />
          </div>
          <Select
            label="RSPO"
            name="rspo"
            placeholder="Pilih Status RSPO"
            options={rspoOptions}
            value={formik.values.rspo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
          <Select
            label="ISPO"
            name="ispo"
            placeholder="Pilih Status ISPO"
            options={ispoOptions}
            value={formik.values.ispo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
        </div>

        <div className="grid grid-cols-3 gap-6 border-b border-dashed border-gray-300 py-4">
          <Select
            label="Jenis Legalitas"
            name="jenis_legalitas"
            placeholder="Pilih Jenis Legalitas"
            options={jenisLegalitas}
            value={formik.values.jenis_legalitas}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
          <InputText
            label="No. Legalitas"
            name="no_legalitas"
            placeholder="Masukan No. Legalitas"
            value={formik.values.no_legalitas}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
          <InputText
            label="Pemilik Legalitas"
            name="pemilik_legalitas"
            placeholder="Masukan Pemilik Legalitas"
            value={formik.values.pemilik_legalitas}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
        </div>

        <div className="grid grid-cols-3 gap-6 py-4">
          <InputText
            label="STDB"
            name="stdb"
            placeholder="Masukan STDB"
            value={formik.values.stdb}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
        </div>

        <div className="mt-4 flex justify-between gap-2">
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Batalkan
          </Button>
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailKebun;
