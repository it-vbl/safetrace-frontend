'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import SelectMultiple from '@/components/molecules/SelectMultiple';
import Upload from '@/components/molecules/Upload';
import useReferences from '@/hooks/useReferences';
import { getPekerjaById, updatePekerja } from '@/services/pekerja';

const validationSchema = Yup.object({
  nama: Yup.string().required('Nama wajib diisi'),
  jenisKelamin: Yup.string().required('Jenis kelamin wajib dipilih'),
  alamat: Yup.string().required('Alamat wajib diisi'),
  noKTP: Yup.string().required('No. KTP wajib diisi'),
  tempatLahir: Yup.string().required('Tempat lahir wajib diisi'),
  tanggalLahir: Yup.string().required('Tanggal lahir wajib diisi'),
  noKK: Yup.string().required('No. KK wajib diisi'),
  statusPekerja: Yup.string().required('Status pekerja wajib dipilih'),
  noWA: Yup.string(),
  jenisPekerjaan: Yup.array().of(Yup.string()),
  jenisApd: Yup.array().of(Yup.string()),
});

export default function UbahPekerjaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex w-full justify-center py-10 text-sm text-neutral-500">
          Memuat data...
        </div>
      }
    >
      <UbahPekerjaContent />
    </Suspense>
  );
}

function UbahPekerjaContent() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // State for files
  const [ktpFile, setKtpFile] = useState(null);
  const [kkFile, setKkFile] = useState(null);

  // State for existing file URLs
  const [existingKtpUrl, setExistingKtpUrl] = useState(null);
  const [existingKkUrl, setExistingKkUrl] = useState(null);

  const {
    jenisKelamin,
    fetchJenisKelamin,
    statusPekerja,
    fetchStatusPekerja,
    jenisPekerjaan,
    fetchJenisPekerjaan,
    jenisApd,
    fetchJenisApd,
  } = useReferences();

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PEKERJA', href: '/traceability/pekerja' },
    { label: 'UBAH PEKERJA' },
  ];

  const formik = useFormik({
    initialValues: {
      nama: '',
      jenisKelamin: '',
      alamat: '',
      noKTP: '',
      tempatLahir: '',
      tanggalLahir: '',
      noKK: '',
      statusPekerja: '',
      noWA: '',
      petaniId: '',
      jenisPekerjaan: [],
      jenisApd: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const dataPayload = new FormData();
        dataPayload.append('petani_id', values.petaniId);
        dataPayload.append('nama', values.nama);
        dataPayload.append('jns_kelamin', values.jenisKelamin);
        dataPayload.append('alamat', values.alamat);
        dataPayload.append('no_ktp', values.noKTP);
        dataPayload.append('tempat_lahir', values.tempatLahir);
        dataPayload.append('tanggal_lahir', moment(values.tanggalLahir).format('YYYY-MM-DD'));
        dataPayload.append('no_kk', values.noKK);
        if (values.noWA) {
          dataPayload.append('no_wa', values.noWA);
        }
        dataPayload.append('status_pekerja', values.statusPekerja);

        // Only append files if they are new/changed
        // If ktpFile is not null, it means user selected a new file
        if (ktpFile) {
          dataPayload.append('file_ktp', ktpFile);
        }

        if (kkFile) {
          dataPayload.append('file_kk', kkFile);
        }

        // Add multi-value fields:
        if (values.jenisPekerjaan && values.jenisPekerjaan.length > 0) {
          values.jenisPekerjaan.forEach((item) => {
            dataPayload.append('jenis_pekerjaan', item);
          });
        }
        if (values.jenisApd && values.jenisApd.length > 0) {
          values.jenisApd.forEach((item) => {
            dataPayload.append('jenis_apd', item);
          });
        }

        const response = await updatePekerja(id, dataPayload);

        if (response?.data?.status === 'success') {
          toast.success('Data pekerja berhasil diperbarui');
          router.push('/traceability/pekerja');
        } else {
          toast.error(
            response?.data?.message || 'Gagal memperbarui data pekerja'
          );
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || 'Gagal memperbarui data pekerja'
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    fetchJenisKelamin();
    fetchStatusPekerja();
    fetchJenisPekerjaan();
    fetchJenisApd();
  }, [fetchJenisKelamin, fetchStatusPekerja, fetchJenisPekerjaan, fetchJenisApd]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsFetching(true);
      try {
        const response = await getPekerjaById(id);
        if (response?.data?.status === 'success') {
          const data = response.data.data;

          formik.setValues({
            nama: data.nama || '',
            jenisKelamin: data.jns_kelamin || '',
            alamat: data.alamat || '',
            noKTP: data.no_ktp || '',
            tempatLahir: data.tempat_lahir || '',
            tanggalLahir: data.tanggal_lahir || '',
            noKK: data.no_kk || '',
            statusPekerja: data.status_pekerja || '',
            noWA: data.no_wa || '',
            petaniId: data.petani || '',
            jenisPekerjaan: data.jenis_pekerjaan || [],
            jenisApd: data.jenis_apd || [],
          });

          // Set existing file URLs
          if (data.file_ktp) setExistingKtpUrl(data.file_ktp);
          if (data.file_kk) setExistingKkUrl(data.file_kk);
        }
      } catch (error) {
        toast.error('Gagal memuat data pekerja');
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancel = () => {
    router.back();
  };

  if (isFetching) {
    return (
      <div className="flex w-full items-center justify-center py-20">
        <div className="text-neutral-500">Memuat data pekerja...</div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <BreadcrumbDetail items={crumbs} />
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Accordion defaultIsOpen title="IDENTITAS">
          <>
            <div className="grid grid-cols-3 gap-6 border-b border-dashed border-neutral-300 py-4">
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
                options={jenisKelamin}
                value={formik.values.jenisKelamin}
                onChange={(e) =>
                  formik.setFieldValue('jenisKelamin', e.target.value)
                }
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
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
            </div>
            <div className="grid grid-cols-3 gap-6 border-b border-dashed border-neutral-300 py-4">
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
            </div>
            <div className="grid grid-cols-3 gap-6 border-b border-dashed border-neutral-300 py-4">
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
                options={statusPekerja}
                value={formik.values.statusPekerja}
                onChange={(e) =>
                  formik.setFieldValue('statusPekerja', e.target.value)
                }
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
              />
              <InputText
                label="No. WA"
                name="noWA"
                placeholder="08123456789"
                value={formik.values.noWA}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-dashed border-neutral-300 py-4">
              <SelectMultiple
                label="Jenis Pekerjaan"
                name="jenisPekerjaan"
                placeholder="Pilih Jenis Pekerjaan"
                options={jenisPekerjaan}
                value={formik.values.jenisPekerjaan}
                onChange={(e) =>
                  formik.setFieldValue('jenisPekerjaan', e.target.value)
                }
                onBlur={formik.handleBlur}
                isError={formik.touched.jenisPekerjaan && Boolean(formik.errors.jenisPekerjaan)}
                helperText={formik.touched.jenisPekerjaan && formik.errors.jenisPekerjaan}
              />
              <SelectMultiple
                label="Jenis APD"
                name="jenisApd"
                placeholder="Pilih Jenis APD"
                options={jenisApd}
                value={formik.values.jenisApd}
                onChange={(e) =>
                  formik.setFieldValue('jenisApd', e.target.value)
                }
                onBlur={formik.handleBlur}
                isError={formik.touched.jenisApd && Boolean(formik.errors.jenisApd)}
                helperText={formik.touched.jenisApd && formik.errors.jenisApd}
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
                    : existingKtpUrl
                      ? {
                        name: 'Dokumen KTP Tersimpan',
                        value: new Blob(), // Dummy blob to satisfy prop types/logic if needed
                        // But actually we are relying on 'url' prop
                      }
                      : null
                }
                url={ktpFile ? null : existingKtpUrl}
                onChangeValue={(data) => setKtpFile(data.value)}
                allowedFiles={['application/pdf', 'image/jpeg', 'image/png', 'image/webp']}
                maxSize={10}
                // Required only if not already existing
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
                    : existingKkUrl
                      ? {
                        name: 'Dokumen KK Tersimpan',
                        value: new Blob(),
                      }
                      : null
                }
                url={kkFile ? null : existingKkUrl}
                onChangeValue={(data) => setKkFile(data.value)}
                allowedFiles={['application/pdf', 'image/jpeg', 'image/png', 'image/webp']}
                maxSize={10}

                keyField="kk"
                name="file_kk"
              />
            </div>
          </>
        </Accordion>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            className="bg-tertiary hover:bg-tertiary/90"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Batalkan
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}