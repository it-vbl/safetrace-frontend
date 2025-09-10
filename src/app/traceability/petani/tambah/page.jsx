'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import DatePicker from '@/components/molecules/DatePicker';
import Accordion from '@/components/molecules/Accordion';
import Breadcrumb from '@/components/molecules/Breadcrumbs';
import Upload from '@/components/molecules/Upload';

// Dummy options - replace with actual data or hooks if available
const jenisKelaminOptions = [
  { label: 'Laki - Laki', value: 'L' },
  { label: 'Perempuan', value: 'P' },
];

const kelompokTaniOptions = [
  { label: 'Bepekaek Besamo', value: 'bepekaek_besamo' },
  { label: 'Kelompok Tani 2', value: 'kelompok_2' },
];

const statusKeanggotaanOptions = [
  { label: 'Aktif', value: 'aktif' },
  { label: 'Tidak Aktif', value: 'tidak_aktif' },
];

const statusPernikahanOptions = [
  { label: 'Kawin', value: 'kawin' },
  { label: 'Belum Kawin', value: 'belum_kawin' },
  { label: 'Cerai', value: 'cerai' },
];

const CreatePetaniTraceability = () => {
  const router = useRouter();

  const crumbs = [
    { name: 'Home', url: '/' },
    { name: 'Petani', url: '/traceability/petani' },
    { name: 'Tambah Petani' },
  ];

  const [ktpFile, setKtpFile] = useState(null);
  const [kkFile, setKkFile] = useState(null);
  const [nibFile, setNibFile] = useState(null);

  const schemaValidation = Yup.object().shape({
    nama_petani: Yup.string().required('Nama Petani harus diisi'),
    jenis_kelamin: Yup.string().required('Jenis Kelamin harus diisi'),
    kelompok_tani: Yup.string().required('Kelompok Tani harus diisi'),
    alamat: Yup.string().required('Alamat harus diisi'),
    no_ktp: Yup.string().required('No. KTP harus diisi'),
    tempat_lahir: Yup.string().required('Tempat Lahir harus diisi'),
    tanggal_lahir: Yup.date().required('Tanggal Lahir harus diisi'),
    no_kk: Yup.string().required('No. KK harus diisi'),
    status_pernikahan: Yup.string().required('Status Pernikahan harus diisi'),
    no_nib: Yup.string().required('No. NIB harus diisi'),
    tanggal_terbit_sppl: Yup.date().required('Tanggal Terbit SPPL harus diisi'),
    tanggal_bergabung: Yup.date().required('Tanggal Bergabung harus diisi'),
    tanggal_keluar: Yup.date().nullable(),
    no_whatsapp: Yup.string().required('No. Whatsapp harus diisi'),
    status_keanggotaan: Yup.string().required('Status Keanggotaan harus diisi'),
    // File validations can be added if needed
  });

  const formik = useFormik({
    initialValues: {
      nama_petani: '',
      jenis_kelamin: '',
      kelompok_tani: '',
      alamat: '',
      no_ktp: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      no_kk: '',
      status_pernikahan: '',
      no_nib: '',
      tanggal_terbit_sppl: '',
      tanggal_bergabung: '',
      tanggal_keluar: '',
      no_whatsapp: '',
      status_keanggotaan: '',
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
        if (ktpFile) formData.append('file_ktp', ktpFile);
        if (kkFile) formData.append('file_kk', kkFile);
        if (nibFile) formData.append('file_nib', nibFile);

        // TODO: Replace with actual API call
        // Example: await createPetani(formData);

        toast.success('Data petani berhasil ditambahkan');
        router.push('/traceability/petani');
      } catch (error) {
        console.error(error);
        toast.error('Gagal menyimpan data petani');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex w-full flex-col gap-6">
      <Breadcrumb crumbs={crumbs} />
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Accordion defaultIsOpen title="IDENTITAS">
          <>
            <div className="grid grid-cols-3 gap-6 border-b border-dashed border-gray-300 py-4">
              <InputText
                label="Nama Petani"
                name="nama_petani"
                placeholder="Masukan Nama Petani"
                value={formik.values.nama_petani}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <Select
                label="Jenis Kelamin"
                name="jenis_kelamin"
                placeholder="Pilih Jenis Kelamin"
                options={jenisKelaminOptions}
                value={formik.values.jenis_kelamin}
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
                options={kelompokTaniOptions}
                value={formik.values.kelompok_tani}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
            </div>
            <div className="grid grid-cols-3 gap-6 border-b border-dashed border-gray-300 py-4">
              <InputText
                label="Alamat"
                name="alamat"
                placeholder="Masukan Alamat"
                value={formik.values.alamat}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <InputText
                label="No. KTP"
                name="no_ktp"
                placeholder="Masukan No. KTP"
                value={formik.values.no_ktp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <InputText
                label="Tempat Lahir"
                name="tempat_lahir"
                placeholder="Masukan Tempat Lahir"
                value={formik.values.tempat_lahir}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
            </div>
            <div className="grid grid-cols-3 gap-6 border-b border-dashed border-gray-300 py-4">
              <DatePicker
                label="Tanggal Lahir"
                name="tanggal_lahir"
                placeholder="Masukan Tanggal Lahir"
                value={
                  formik.values.tanggal_lahir
                    ? moment(formik.values.tanggal_lahir).format('DD/MM/YYYY')
                    : ''
                }
                onChange={(e) => formik.setFieldValue('tanggal_lahir', e)}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <InputText
                label="No. KK"
                name="no_kk"
                placeholder="Masukan No. KK"
                value={formik.values.no_kk}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <Select
                label="Status Pernikahan"
                name="status_pernikahan"
                placeholder="Pilih Status Pernikahan"
                options={statusPernikahanOptions}
                value={formik.values.status_pernikahan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
            </div>
            <div className="grid grid-cols-3 gap-6 border-b border-dashed border-gray-300 py-4">
              <InputText
                label="No. NIB"
                name="no_nib"
                placeholder="Masukan No. NIB"
                value={formik.values.no_nib}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <DatePicker
                label="Tanggal Terbit SPPL"
                name="tanggal_terbit_sppl"
                placeholder="Masukan Tanggal Terbit SPPL"
                value={
                  formik.values.tanggal_terbit_sppl
                    ? moment(formik.values.tanggal_terbit_sppl).format(
                        'DD/MM/YYYY'
                      )
                    : ''
                }
                onChange={(e) => formik.setFieldValue('tanggal_terbit_sppl', e)}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <DatePicker
                label="Tanggal Bergabung"
                name="tanggal_bergabung"
                placeholder="Masukan Tanggal Bergabung"
                value={
                  formik.values.tanggal_bergabung
                    ? moment(formik.values.tanggal_bergabung).format(
                        'DD/MM/YYYY'
                      )
                    : ''
                }
                onChange={(e) => formik.setFieldValue('tanggal_bergabung', e)}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
            </div>
            <div className="grid grid-cols-3 gap-6 py-4">
              <DatePicker
                label="Tanggal Keluar"
                name="tanggal_keluar"
                placeholder="Masukan Tanggal Keluar"
                value={
                  formik.values.tanggal_keluar
                    ? moment(formik.values.tanggal_keluar).format('DD/MM/YYYY')
                    : ''
                }
                onChange={(e) => formik.setFieldValue('tanggal_keluar', e)}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
              />
              <InputText
                label="No. Whatsapp"
                name="no_whatsapp"
                placeholder="Masukan No. Whatsapp"
                value={formik.values.no_whatsapp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <Select
                label="Status Keanggotaan"
                name="status_keanggotaan"
                placeholder="Pilih Status Keanggotaan"
                options={statusKeanggotaanOptions}
                value={formik.values.status_keanggotaan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
            </div>
          </>
        </Accordion>

        <Accordion defaultIsOpen title="LAMPIRAN IDENTITAS">
          <>
            <div className="grid grid-cols-3 gap-6 py-4">
              <Upload
                label="KTP"
                file={
                  ktpFile
                    ? {
                        name: ktpFile.name,
                        size: (ktpFile.size / 1048576).toFixed(1),
                        uploadDate: new Date().toLocaleDateString('en-US'),
                        value: ktpFile,
                      }
                    : null
                }
                onChangeValue={(data) => setKtpFile(data.value)}
                allowedFiles={['application/pdf']}
                maxSize={10}
                isRequired
                keyField="ktp"
                name="file_ktp"
              />

              <Upload
                label="Kartu Keluarga (KK)"
                file={
                  kkFile
                    ? {
                        name: kkFile.name,
                        size: (kkFile.size / 1048576).toFixed(1),
                        uploadDate: new Date().toLocaleDateString('en-US'),
                        value: kkFile,
                      }
                    : null
                }
                onChangeValue={(data) => setKkFile(data.value)}
                allowedFiles={['application/pdf']}
                maxSize={10}
                isRequired
                keyField="kk"
                name="file_kk"
              />

              <Upload
                label="NIB"
                file={
                  nibFile
                    ? {
                        name: nibFile.name,
                        size: (nibFile.size / 1048576).toFixed(1),
                        uploadDate: new Date().toLocaleDateString('en-US'),
                        value: nibFile,
                      }
                    : null
                }
                onChangeValue={(data) => setNibFile(data.value)}
                allowedFiles={['application/pdf']}
                maxSize={10}
                isRequired
                keyField="nib"
                name="file_nib"
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

export default CreatePetaniTraceability;
