'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import moment from 'moment';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Accordion from '@/components/molecules/Accordion';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import DatePicker from '@/components/molecules/DatePicker';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import Upload from '@/components/molecules/Upload';

// Dummy options - replace with actual data or hooks if available
const kelompokTaniOptions = [
  { label: 'Bepekaek Besamo', value: 'bepekaek_besamo' },
  { label: 'Kelompok Tani 2', value: 'kelompok_2' },
];

const petaniOptions = [
  { label: 'Agustinus Nery', value: 'agustinus_nery' },
  { label: 'Petani 2', value: 'petani_2' },
];

const lokasiKebunOptions = [
  { label: 'Gonis Rabu', value: 'gonis_rabu' },
  { label: 'Lokasi 2', value: 'lokasi_2' },
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

const CreateKebunTraceability = () => {
  const router = useRouter();

  const crumbs = [
    { label: 'KEBUN', href: '/traceability/kebun' },
    { label: 'TAMBAH KEBUN' },
  ];

  const [petaFile, setPetaFile] = useState(null);
  const [legalitasFile, setLegalitasFile] = useState(null);
  const [stdbFile, setStdbFile] = useState(null);
  const [coordinates, setCoordinates] = useState([]);

  const schemaValidation = Yup.object().shape({
    kelompok_tani: Yup.string().required('Kelompok Tani harus diisi'),
    nama_petani: Yup.string().required('Nama Petani harus diisi'),
    lokasi_kebun: Yup.string().required('Lokasi Kebun harus diisi'),
    luas_kebun: Yup.number()
      .required('Luas Kebun harus diisi')
      .min(0, 'Luas kebun harus lebih dari 0'),
    luas_peta: Yup.number()
      .required('Luas Peta harus diisi')
      .min(0, 'Luas peta harus lebih dari 0'),
    waktu_tanam: Yup.string().required('Waktu Tanam harus diisi'),
    tahun_tanam: Yup.number()
      .required('Tahun Tanam harus diisi')
      .min(1900, 'Tahun tidak valid'),
    rspo: Yup.string().required('RSPO harus diisi'),
    ispo: Yup.string().required('ISPO harus diisi'),
    jenis_legalitas: Yup.string().required('Jenis Legalitas harus diisi'),
    no_legalitas: Yup.string().required('No. Legalitas harus diisi'),
    pemilik_legalitas: Yup.string().required('Pemilik Legalitas harus diisi'),
    stdb: Yup.string().required('STDB harus diisi'),
    latitude: Yup.number().nullable(),
    longitude: Yup.number().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      kelompok_tani: '',
      nama_petani: '',
      lokasi_kebun: '',
      luas_kebun: '',
      luas_peta: '',
      waktu_tanam: '',
      tahun_tanam: '',
      rspo: '',
      ispo: '',
      jenis_legalitas: '',
      no_legalitas: '',
      pemilik_legalitas: '',
      stdb: '',
      latitude: '',
      longitude: '',
    },
    validationSchema: schemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Prepare form data for submission including files
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
          if (value instanceof Date) {
            formData.append(key, moment(value).format('YYYY-MM-DD'));
          } else {
            formData.append(key, value);
          }
        });

        // Add coordinates data
        if (coordinates.length > 0) {
          formData.append('coordinates', JSON.stringify(coordinates));
        }

        if (petaFile) formData.append('file_peta', petaFile);
        if (legalitasFile) formData.append('file_legalitas', legalitasFile);
        if (stdbFile) formData.append('file_stdb', stdbFile);

        // TODO: Replace with actual API call
        // Example: await createKebun(formData);

        toast.success('Data kebun berhasil ditambahkan');
        router.push('/traceability/kebun');
      } catch (error) {
        console.error(error);
        toast.error('Gagal menyimpan data kebun');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const addCoordinate = () => {
    const { latitude, longitude } = formik.values;
    if (latitude && longitude) {
      const newCoordinate = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
      setCoordinates([...coordinates, newCoordinate]);
      formik.setFieldValue('latitude', '');
      formik.setFieldValue('longitude', '');
    }
  };

  const removeCoordinate = (index) => {
    setCoordinates(coordinates.filter((_, i) => i !== index));
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <BreadcrumbDetail items={crumbs} />

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Accordion defaultIsOpen title="DETAIL KEBUN">
          <>
            <div className="grid grid-cols-3 gap-6 border-b border-dashed border-gray-300 py-4">
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
                name="nama_petani"
                placeholder="Pilih Nama Petani"
                options={petaniOptions}
                value={formik.values.nama_petani}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <Select
                label="Lokasi Kebun"
                name="lokasi_kebun"
                placeholder="Pilih Lokasi Kebun"
                options={lokasiKebunOptions}
                value={formik.values.lokasi_kebun}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
            </div>

            <div className="grid grid-cols-3 gap-6 border-b border-dashed border-gray-300 py-4">
              <InputText
                label="Luas Kebun (Ha)"
                name="luas_kebun"
                placeholder="Masukan Luas Kebun"
                type="number"
                step="0.01"
                value={formik.values.luas_kebun}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <InputText
                label="Luas Peta (Ha)"
                name="luas_peta"
                placeholder="Masukan Luas Peta"
                type="number"
                step="0.01"
                value={formik.values.luas_peta}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <DatePicker
                label="Waktu Tanam"
                name="waktu_tanam"
                placeholder="Pilih Waktu Tanam"
                value={
                  formik?.values.waktu_tanam
                    ? moment(formik?.values.waktu_tanam, 'YYYY-MM-DD').format(
                        'DD-MM-YYYY'
                      )
                    : ''
                }
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                errors={formik?.errors}
                touched={formik?.touched}
              />
            </div>

            <div className="grid grid-cols-3 gap-6 border-b border-dashed border-gray-300 py-4">
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
            </div>

            <div className="grid grid-cols-3 gap-6 py-4">
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
          </>
        </Accordion>

        <Accordion defaultIsOpen title="PEMETAAN">
          <>
            <div className="grid grid-cols-2 gap-6 py-4">
              <InputText
                label="Latitude"
                name="latitude"
                placeholder="Masukan Latitude"
                type="number"
                step="any"
                value={formik.values.latitude}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
              />
              <InputText
                label="Longitude"
                name="longitude"
                placeholder="Masukan Longitude"
                type="number"
                step="any"
                value={formik.values.longitude}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
              />
            </div>

            <div className="flex justify-start py-2">
              <Button
                type="button"
                onClick={addCoordinate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Tambah Koordinat
              </Button>
            </div>

            {coordinates.length > 0 && (
              <div className="py-4">
                <h4 className="mb-2 font-medium">Daftar Koordinat:</h4>
                <div className="space-y-2">
                  {coordinates.map((coord, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded bg-gray-50 p-3"
                    >
                      <span>
                        {coord.latitude}, {coord.longitude}
                      </span>
                      <Button
                        type="button"
                        onClick={() => removeCoordinate(index)}
                        className="bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
                      >
                        Hapus
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        </Accordion>

        <Accordion defaultIsOpen title="LAMPIRAN KEBUN">
          <>
            <div className="grid grid-cols-3 gap-6 py-4">
              <Upload
                label="Peta"
                file={
                  petaFile
                    ? {
                        name: petaFile.name,
                        size: (petaFile.size / 1048576).toFixed(1),
                        uploadDate: new Date().toLocaleDateString('en-US'),
                        value: petaFile,
                      }
                    : null
                }
                onChangeValue={(data) => setPetaFile(data.value)}
                allowedFiles={['application/pdf']}
                maxSize={10}
                isRequired
                keyField="peta"
                name="file_peta"
              />
              <Upload
                label="Legalitas"
                file={
                  legalitasFile
                    ? {
                        name: legalitasFile.name,
                        size: (legalitasFile.size / 1048576).toFixed(1),
                        uploadDate: new Date().toLocaleDateString('en-US'),
                        value: legalitasFile,
                      }
                    : null
                }
                onChangeValue={(data) => setLegalitasFile(data.value)}
                allowedFiles={['application/pdf']}
                maxSize={10}
                isRequired
                keyField="legalitas"
                name="file_legalitas"
              />
              <Upload
                label="STDB"
                file={
                  stdbFile
                    ? {
                        name: stdbFile.name,
                        size: (stdbFile.size / 1048576).toFixed(1),
                        uploadDate: new Date().toLocaleDateString('en-US'),
                        value: stdbFile,
                      }
                    : null
                }
                onChangeValue={(data) => setStdbFile(data.value)}
                allowedFiles={['application/pdf']}
                maxSize={10}
                isRequired
                keyField="stdb"
                name="file_stdb"
              />
            </div>
          </>
        </Accordion>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700"
            onClick={() => router.back()}
            isLoading={formik.isSubmitting}
          >
            Batalkan
          </Button>
          <Button type="submit" isLoading={formik.isSubmitting}>
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateKebunTraceability;
