'use client';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import { getListPetani } from '@/services/pekebun';

// Dummy options - replace with actual data or hooks if available
const kelompokTaniOptions = [
  { label: 'Bepekaek Besamo', value: 'bepekaek_besamo' },
  { label: 'Kelompok Tani 2', value: 'kelompok_2' },
];

const rspoOptions = [
  { label: 'Sudah', value: 'sudah' },
  { label: 'Belum', value: 'belum' },
];

const ispoOptions = [
  { label: 'Sudah', value: 'sudah' },
  { label: 'Belum', value: 'belum' },
];

const jenisLegalitasOptions = [
  { label: 'SHM', value: 'shm' },
  { label: 'SKGR', value: 'skgr' },
  { label: 'Surat Keterangan', value: 'surat_keterangan' },
];

const DetailKebun = ({ idKebun, kebunData, onNext, onCancel, isSubmitting }) => {
  const [petaniOptions, setPetaniOptions] = useState([]);

  useEffect(() => {
    const fetchPetani = async () => {
      try {
        const response = await getListPetani();
        const options = response.data.data.results.map((item) => ({
          label: item.nama,
          value: item.id,
        }));
        setPetaniOptions(options);
      } catch (error) {
        console.error('Error fetching petani list:', error);
      }
    };
    fetchPetani();
  }, []);

  const validationSchema = Yup.object().shape({
    kelompok_tani: Yup.string().required('Kelompok Tani harus diisi'),
    petani_id: Yup.string().required('Nama Petani harus diisi'),
    lokasi_kebun: Yup.string().required('Lokasi Kebun harus diisi'),
    luas: Yup.number()
      .required('Luas Kebun harus diisi')
      .min(0, 'Luas kebun harus lebih dari 0'),
    waktu_tanam_month: Yup.string().required('Bulan tanam harus diisi'),
    waktu_tanam_year: Yup.string().required('Tahun tanam harus diisi'),
    jumlah_pokok: Yup.number()
      .required('Jumlah Pokok harus diisi')
      .min(0, 'Jumlah pokok harus lebih dari 0'),
    rspo: Yup.string().required('RSPO harus diisi'),
    ispo: Yup.string().required('ISPO harus diisi'),
    jenis_legalitas: Yup.string().required('Jenis Legalitas harus diisi'),
    no_legalitas: Yup.string().required('No. Legalitas harus diisi'),
    pemilik_legalitas: Yup.string().required('Pemilik Legalitas harus diisi'),
    stdb: Yup.string().required('STDB harus diisi'),
  });

  const formik = useFormik({
    initialValues: {
      kelompok_tani: kebunData?.kelompok_tani || 'bepekaek_besamo',
      petani_id: kebunData?.petani_id?.toString() || '',
      lokasi_kebun: kebunData?.lokasi_kebun || 'Gonis Rabu',
      luas: kebunData?.luas || '0.75',
      waktu_tanam_month: kebunData?.waktu_tanam ? kebunData.waktu_tanam.split('-')[1] : '09',
      waktu_tanam_year: kebunData?.waktu_tanam ? kebunData.waktu_tanam.split('-')[0] : '2020',
      jumlah_pokok: kebunData?.jumlah_pokok?.toString() || '300',
      rspo: kebunData?.is_rspo ? 'sudah' : 'belum',
      ispo: kebunData?.is_ispo ? 'sudah' : 'belum',
      jenis_legalitas: kebunData?.jenis_legalitas === '1' ? 'shm' : kebunData?.jenis_legalitas === '2' ? 'skgr' : 'surat_keterangan',
      no_legalitas: kebunData?.nomor_legalitas || '593.21/328/2012/VII/2020',
      pemilik_legalitas: kebunData?.pemiliki_legalitas || 'Agustinus Nery',
      stdb: kebunData?.nomor_stdb || '61.09-01.041',
    },
    validationSchema,
    onSubmit: async (values) => {
      await onNext(values);
    },
  });

  const handleSubmit = async () => {
    const isValid = await formik.validateForm();
    if (Object.keys(isValid).length === 0) {
      await onNext(formik.values);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-300 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">DETAIL KEBUN</h3>
        <div className="grid grid-cols-3 gap-6 border-b border-dashed border-gray-300 py-4">
          <InputText
            label="ID Kebun"
            name="id_kebun_display"
            placeholder="KBN001"
            value={idKebun || "KBN001"}
            disabled
          />
          <Select
            label="Kelompok Tani"
            name="kelompok_tani"
            placeholder="Pilih Kelompok Tani"
            options={kelompokTaniOptions}
            value={formik.values.kelompok_tani}
            onChange={formik.handleChange}
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
            label="Jumlah Pokok"
            name="jumlah_pokok"
            placeholder="Masukan Jumlah Pokok"
            type="number"
            value={formik.values.jumlah_pokok}
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
              options={[
                { label: '2020', value: '2020' },
                { label: '2021', value: '2021' },
                { label: '2022', value: '2022' },
                { label: '2023', value: '2023' },
                { label: '2024', value: '2024' },
              ]}
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
            options={jenisLegalitasOptions}
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
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailKebun;