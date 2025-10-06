'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import moment from 'moment';

import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import EditLampiranPetaniModal from '@/components/molecules/EditLampiranPetaniModal';
import EditPetaniModal from '@/components/molecules/EditPetaniModal';
import useReferences from '@/hooks/useReferences';

import {
  getDetailLampiranPetani,
  getDetailPetani,
  updateLampiranPetani,
  updatePetani,
} from '../../../../services/petani';

const formatJenisKelamin = (val) => {
  if (val === '1' || val === 1) return 'Laki - Laki';
  if (val === '2' || val === 2) return 'Perempuan';
  return '-';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return moment(dateStr).isValid()
    ? moment(dateStr).format('DD-MM-YYYY')
    : dateStr;
};

const TraceabilityPetaniDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const {
    jenisKelamin,
    statusPerkawinan,
    kelompokTani,
    fetchJenisKelamin,
    fetchStatusPerkawinan,
    fetchKelompokTani,
    loading: referencesLoading,
  } = useReferences();

  const [petani, setPetani] = useState(null);
  const [lampiran, setLampiran] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lampiranLoading, setLampiranLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lampiranError, setLampiranError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditLampiranModalOpen, setIsEditLampiranModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateLampiranLoading, setUpdateLampiranLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: '',
  });

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PETANI', href: '/traceability/petani' },
    { label: 'DETAIL PETANI' },
  ];

  useEffect(() => {
    fetchJenisKelamin();
    fetchStatusPerkawinan();
    fetchKelompokTani();
  }, [fetchJenisKelamin, fetchStatusPerkawinan, fetchKelompokTani]);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getDetailPetani(id);
        const data = res?.data?.data || res?.data;
        setPetani(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchLampiran = async () => {
      setLampiranLoading(true);
      setLampiranError(null);
      try {
        const res = await getDetailLampiranPetani(id);
        const data = res?.data?.data || res?.data;
        setLampiran(data);
      } catch (err) {
        setLampiranError(err);
      } finally {
        setLampiranLoading(false);
      }
    };

    if (id) {
      fetchDetail();
      fetchLampiran();
    }
  }, [id]);

  const handleUpdateLampiran = async (formData) => {
    setUpdateLampiranLoading(true);
    setNotification({ show: false, type: '', message: '' });
    try {
      await updateLampiranPetani(id, formData);
      const res = await getDetailLampiranPetani(id);
      const data = res?.data?.data || res?.data;
      setLampiran(data);

      setIsEditLampiranModalOpen(false);
      setNotification({
        show: true,
        type: 'success',
        message: 'Lampiran berhasil diperbarui!',
      });

      // Auto hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating lampiran:', error);
      setNotification({
        show: true,
        type: 'error',
        message:
          'Gagal memperbarui lampiran: ' +
          (error?.response?.data?.message || error.message),
      });

      // Auto hide error notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    } finally {
      setUpdateLampiranLoading(false);
    }
  };

  const handleUpdatePetani = async (formData) => {
    setUpdateLoading(true);
    setNotification({ show: false, type: '', message: '' });

    try {
      // Map form data to API format
      const updateData = {
        id_petani: formData.id,
        nama: formData.nama,
        nama_kelompok: formData.kelompok_tani,
        jns_kelamin: formData.jenis_kelamin,
        no_ktp: formData.no_ktp,
        tempat: formData.tempat_lahir,
        tanggal_lahir: formData.tanggal_lahir,
        alamat: formData.alamat,
        no_kk: formData.no_kk,
        status_perkawinan: formData.status_pernikahan,
        no_nib: formData.no_nib,
        tgl_terbit_sppl: formData.tanggal_terbit_sppl,
        no_wa: formData.no_whatsapp,
        keanggotaan: formData.keanggotaan === 'true',
        tanggal_bergabung: formData.tanggal_bergabung,
        tanggal_keluar: formData.tanggal_keluar || null,
      };

      await updatePetani(id, updateData);

      // Refresh data after successful update
      const res = await getDetailPetani(id);
      const data = res?.data?.data || res?.data;
      setPetani(data);

      setIsEditModalOpen(false);
      setNotification({
        show: true,
        type: 'success',
        message: 'Data petani berhasil diperbarui!',
      });

      // Auto hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating petani:', error);
      setNotification({
        show: true,
        type: 'error',
        message:
          'Gagal memperbarui data petani: ' +
          (error?.response?.data?.message || error.message),
      });

      // Auto hide error notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    } finally {
      setUpdateLoading(false);
    }
  };

  const renderLampiranItem = (label, fileUrl) => {
    if (!fileUrl) return null;

    const getFileExtension = (url) => {
      return url.split('.').pop().toLowerCase();
    };

    const fileExtension = getFileExtension(fileUrl);
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(
      fileExtension
    );
    const isPDF = fileExtension === 'pdf';

    return (
      <div
        key={label}
        className="min-w-0 flex-1 rounded-lg border border-gray-200 p-3 sm:p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <h4 className="truncate text-sm font-medium text-gray-700">
            {label}
          </h4>
        </div>

        <div className="w-full">
          {isImage ? (
            <div className="relative">
              <Image
                src={fileUrl}
                alt={label}
                width={400}
                height={300}
                className="h-auto w-full max-w-full rounded border border-gray-300 sm:max-w-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector(
                    '.fallback-content'
                  ).style.display = 'block';
                }}
              />
            </div>
          ) : isPDF ? (
            <div className="relative">
              <iframe
                src={fileUrl}
                className="h-64 w-full rounded border border-gray-300 sm:h-96"
                title={label}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector(
                    '.fallback-content'
                  ).style.display = 'block';
                }}
              />
            </div>
          ) : (
            <div className="flex h-32 w-full items-center justify-center rounded border border-gray-300 bg-gray-50">
              <div className="px-2 text-center">
                <p className="mb-2 text-xs text-gray-600 sm:text-sm">
                  File tidak dapat ditampilkan
                </p>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 underline hover:text-blue-800 sm:text-sm"
                >
                  Unduh File
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 px-4 sm:gap-6 sm:px-6 lg:gap-8 lg:px-0">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed right-2 top-4 z-50 max-w-xs rounded-lg p-3 shadow-lg sm:right-4 sm:max-w-sm sm:p-4 ${
            notification.type === 'success'
              ? 'border border-green-400 bg-green-100 text-green-700'
              : 'border border-red-400 bg-red-100 text-red-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="pr-2 text-xs font-medium sm:text-sm">
              {notification.message}
            </span>
            <button
              onClick={() =>
                setNotification({ show: false, type: '', message: '' })
              }
              className="ml-2 flex-shrink-0 text-lg font-bold hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <BreadcrumbDetail items={crumbs} />
      <div className="flex flex-col gap-4 sm:gap-6">
        <section className="rounded border border-gray-300 bg-white p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-semibold">IDENTITAS</h3>
            <button
              onClick={() => setIsEditLampiranModalOpen(true)}
              className="self-start text-sm text-blue-600 underline hover:text-blue-800 sm:self-auto"
              disabled={updateLampiranLoading}
            >
              Ubah Data
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="medium" />
            </div>
          )}
          {error && (
            <div className="text-sm text-red-600">
              Gagal memuat data:{' '}
              {error?.response?.data?.message || error.message}
            </div>
          )}

          {!loading && !error && petani && (
            <div className="grid grid-cols-1 gap-x-3 gap-y-4 text-sm text-gray-700 sm:grid-cols-2 sm:gap-x-4 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 xl:grid-cols-6">
              <BorderBottomColData
                label="Id Petani"
                value={petani?.id_petani || petani?.id || '-'}
              />
              <BorderBottomColData
                label="Nama Petani"
                value={petani?.nama || '-'}
              />
              <BorderBottomColData
                label="Jenis Kelamin"
                value={formatJenisKelamin(petani?.jns_kelamin)}
              />
              <BorderBottomColData
                label="Kelompok Tani"
                value={petani?.nama_kelompok || '-'}
              />
              <BorderBottomColData
                label="Alamat"
                value={petani?.alamat || '-'}
              />
              <BorderBottomColData
                label="No. KTP"
                value={petani?.no_ktp || '-'}
              />
              <BorderBottomColData
                label="Tempat Lahir"
                value={petani?.tempat || '-'}
              />
              <BorderBottomColData
                label="Tanggal Lahir"
                value={formatDate(petani?.tanggal_lahir)}
              />
              <BorderBottomColData
                label="No. KK"
                value={petani?.no_kk || '-'}
              />
              <BorderBottomColData
                label="Status Pernikahan"
                value={
                  petani?.status_perkawinan == '1' ? 'Belum Kawin' : 'Kawin'
                }
              />
              <BorderBottomColData
                label="No. NIB"
                value={petani?.no_nib || '-'}
              />
              <BorderBottomColData
                label="Tanggal Terbit SPPL"
                value={formatDate(petani?.tgl_terbit_sppl)}
              />
              <BorderBottomColData
                label="Tanggal Bergabung"
                value={formatDate(petani?.tanggal_bergabung)}
              />
              <BorderBottomColData
                label="Tanggal Keluar"
                value={formatDate(petani?.tanggal_keluar)}
              />
              <BorderBottomColData
                label="No. Whatsapp"
                value={petani?.no_wa || '-'}
              />
              <BorderBottomColData
                label="Status Keanggotaan"
                value={
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                      petani?.keanggotaan === true
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {petani?.keanggotaan === true
                      ? 'Aktif'
                      : petani?.keanggotaan === false
                      ? 'Tidak Aktif'
                      : petani?.keanggotaan || 'Tidak Diketahui'}
                  </span>
                }
              />
            </div>
          )}
        </section>

        <section className="rounded border border-gray-300 bg-white p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="mb-2 font-semibold sm:mb-4">LAMPIRAN IDENTITAS</h3>
            <button
              onClick={() => setIsEditLampiranModalOpen(true)}
              className="self-start text-sm text-blue-600 underline hover:text-blue-800 sm:self-auto"
              disabled={updateLampiranLoading}
            >
              Ubah Data
            </button>
          </div>

          {lampiranLoading && <LoadingSpinner />}

          {lampiranError && (
            <div className="text-sm text-red-600">
              Gagal memuat lampiran:{' '}
              {lampiranError?.response?.data?.message || lampiranError.message}
            </div>
          )}

          {!lampiranLoading && !lampiranError && lampiran && (
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 md:gap-6">
              {renderLampiranItem('KTP ', lampiran.file_ktp)}
              {renderLampiranItem('KK', lampiran.file_kk)}
              {renderLampiranItem('NIB ', lampiran.file_nib)}

              {!lampiran.file_ktp &&
                !lampiran.file_kk &&
                !lampiran.file_nib && (
                  <div className="text-sm text-gray-600">
                    Belum ada data lampiran.
                  </div>
                )}
            </div>
          )}

          {!lampiranLoading && !lampiranError && !lampiran && (
            <div className="text-sm text-gray-600">
              Belum ada data lampiran.
            </div>
          )}
        </section>
      </div>

      {/* Edit Petani Modal */}
      {petani && (
        <EditPetaniModal
          open={isEditModalOpen}
          setOpen={setIsEditModalOpen}
          jenisKelamin={jenisKelamin}
          statusPerkawinan={statusPerkawinan}
          kelompokTani={kelompokTani}
          initialValues={{
            id: petani?.id_petani || petani?.id || '',
            nama: petani?.nama || '',
            jenis_kelamin: petani?.jns_kelamin || '',
            kelompok_tani: petani?.nama_kelompok || '',
            alamat: petani?.alamat || '',
            no_ktp: petani?.no_ktp || '',
            tempat_lahir: petani?.tempat || '',
            tanggal_lahir: petani?.tanggal_lahir || '',
            no_kk: petani?.no_kk || '',
            status_pernikahan: petani?.status_perkawinan || '',
            no_nib: petani?.no_nib || '',
            tanggal_terbit_sppl: petani?.tgl_terbit_sppl || '',
            no_whatsapp: petani?.no_wa || '',
            tanggal_bergabung: petani?.tanggal_bergabung || '',
            tanggal_keluar: petani?.tanggal_keluar || null,
            keanggotaan: petani?.keanggotaan ? 'true' : 'false',
          }}
          onSave={handleUpdatePetani}
        />
      )}

      {/* Edit Lampiran Petani Modal */}
      {lampiran && (
        <EditLampiranPetaniModal
          open={isEditLampiranModalOpen}
          setOpen={setIsEditLampiranModalOpen}
          initialValues={{
            file_ktp: lampiran?.file_ktp || null,
            file_kk: lampiran?.file_kk || null,
            file_nib: lampiran?.file_nib || null,
          }}
          onSave={handleUpdateLampiran}
          loading={updateLampiranLoading}
        />
      )}
    </div>
  );
};

export default TraceabilityPetaniDetail;
