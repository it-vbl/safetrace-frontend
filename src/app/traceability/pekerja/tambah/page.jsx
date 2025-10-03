'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Accordion from '@/components/molecules/Accordion';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import DatePicker from '@/components/molecules/DatePicker';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import Upload from '@/components/molecules/Upload';

const validationSchema = Yup.object({
  nama: Yup.string().required('Nama wajib diisi'),
  jenisKelamin: Yup.string().required('Jenis kelamin wajib dipilih'),
  kelompokTani: Yup.string().required('Kelompok tani wajib dipilih'),
  alamat: Yup.string().required('Alamat wajib diisi'),
  noKTP: Yup.string().required('No. KTP wajib diisi'),
  tempatLahir: Yup.string().required('Tempat lahir wajib diisi'),
  tanggalLahir: Yup.string().required('Tanggal lahir wajib diisi'),
  noKK: Yup.string().required('No. KK wajib diisi'),
  statusPekerja: Yup.string().required('Status pekerja wajib dipilih'),
});

const jenisKelaminOptions = [
  { value: 'laki-laki', label: 'Laki - Laki' },
  { value: 'perempuan', label: 'Perempuan' },
];

const kelompokTaniOptions = [
  { value: 'bepekaek-besamo', label: 'Bepekaek Besamo' },
  { value: 'kelompok-a', label: 'Kelompok A' },
  { value: 'kelompok-b', label: 'Kelompok B' },
];

const statusPekerjaOptions = [
  { value: 'family', label: 'Family' },
  { value: 'buruh', label: 'Buruh' },
  { value: 'kontrak', label: 'Kontrak' },
];

export default function TambahPekerjaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [ktpFile, setKtpFile] = useState(null);
  const [kkFile, setKkFile] = useState(null);

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PEKERJA', href: '/traceability/pekerja' },
    { label: 'TAMBAH PEKERJA' },
  ];

  const formik = useFormik({
    initialValues: {
      nama: '',
      jenisKelamin: '',
      kelompokTani: '',
      alamat: '',
      noKTP: '',
      tempatLahir: '',
      tanggalLahir: '',
      noKK: '',
      statusPekerja: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // TODO: Implement API call to save worker data
        console.log('Form values:', values);
        console.log('KTP File:', ktpFile);
        console.log('KK File:', kkFile);

        toast.success('Data pekerja berhasil disimpan');
        router.push('/traceability/pekerja');
      } catch (error) {
        toast.error('Gagal menyimpan data pekerja');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleCancel = () => {
    router.push('/traceability/pekerja');
  };

  const handleKtpFileChange = (fileData) => {
    setKtpFile(fileData);
  };

  const handleKkFileChange = (fileData) => {
    setKkFile(fileData);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <BreadcrumbDetail items={crumbs} />
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Accordion defaultIsOpen title="IDENTITAS">
          <>
            <div className="grid grid-cols-3 gap-6 border-b border-dashed border-gray-300 py-4">
              <InputText
                label="Nama"
                name="nama"
                placeholder="Agustinus Nery"
                value={formik.values.nama}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <Select
                label="Jenis Kelamin"
                name="jenisKelamin"
                placeholder="Laki - Laki"
                options={jenisKelaminOptions}
                value={formik.values.jenisKelamin}
                onChange={(value) =>
                  formik.setFieldValue('jenisKelamin', value)
                }
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <Select
                label="Kelompok Tani"
                name="kelompokTani"
                placeholder="Bepekaek Besamo"
                options={kelompokTaniOptions}
                value={formik.values.kelompokTani}
                onChange={(value) =>
                  formik.setFieldValue('kelompokTani', value)
                }
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
                placeholder="Dusun Gonis Rabu Desa Gonis Tekam. Sekadau"
                value={formik.values.alamat}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <InputText
                label="No. KTP"
                name="noKTP"
                placeholder="6109010805890003."
                value={formik.values.noKTP}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <InputText
                label="Tempat Lahir"
                name="tempatLahir"
                placeholder="Gonis Rabu"
                value={formik.values.tempatLahir}
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
                name="tanggalLahir"
                placeholder="08/05/1989"
                value={formik.values.tanggalLahir}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <InputText
                label="No. KK"
                name="noKK"
                placeholder="6109011711100021."
                value={formik.values.noKK}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <Select
                label="Status Pekerja"
                name="statusPekerja"
                placeholder="Family"
                options={statusPekerjaOptions}
                value={formik.values.statusPekerja}
                onChange={(value) =>
                  formik.setFieldValue('statusPekerja', value)
                }
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
            </div>
          </>
        </Accordion>

        <Accordion defaultIsOpen title="LAMPIRAN">
          <>
            <div className="grid grid-cols-2 gap-12 py-4">
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
            </div>
          </>
        </Accordion>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Batalkan
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}
