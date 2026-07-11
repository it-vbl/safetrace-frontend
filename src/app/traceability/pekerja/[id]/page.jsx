'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import moment from 'moment';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import AttachmentViewer from '@/components/molecules/AttachmentViewer';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import { getCurrentUserRoles, isViewOnlyRole } from '@/libs/permissions';
import { deletePekerja, getPekerjaByPetani } from '@/services/pekerja';
import { getDetailPetani } from '@/services/petani';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return moment(dateStr).isValid()
    ? moment(dateStr).format('DD-MM-YYYY')
    : dateStr;
};

const TraceabilityPekerjaDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  // Determine if the current user is view-only (Disbunak Kalbar / Disbunak Sekadau)
  const isViewOnly = isViewOnlyRole(getCurrentUserRoles());

  const [pekerjaData, setPekerjaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for delete functionality
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pekerjaToDelete, setPekerjaToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PEKERJA', href: '/traceability/pekerja' },
    { label: 'DETAIL PEKERJA' },
  ];

  // Extracted fetch function to allow soft-reload
  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pekerjaRes, petaniRes] = await Promise.all([
        getPekerjaByPetani(id),
        getDetailPetani(id),
      ]);

      if (
        pekerjaRes?.data?.status === 'success' &&
        petaniRes?.data?.status === 'success'
      ) {
        const pekerjaList = pekerjaRes.data.data.results || [];
        const petaniDetail = petaniRes.data.data;

        setPekerjaData({
          identitas_pemilik: {
            id_petani: petaniDetail.id_petani,
            nama: petaniDetail.nama,
            jenis_kelamin: petaniDetail.jns_kelamin_label,
            alamat: petaniDetail.alamat,
            no_ktp: petaniDetail.no_ktp,
            tempat_lahir: petaniDetail.tempat,
            tanggal_lahir: petaniDetail.tanggal_lahir,
            no_kk: petaniDetail.no_kk,
            status_perkawinan: petaniDetail.status_perkawinan_label,
            luas_kebun: petaniDetail.luas_kebun,
            jumlah_pekerja: pekerjaList.length,
          },
          identitas_pekerja: pekerjaList.map((worker) => ({
            id: worker.id,
            nama: worker.nama,
            jenis_kelamin: worker.jenis_kelamin_label,
            alamat: worker.alamat,
            no_ktp: worker.no_ktp,
            tempat_lahir: worker.tempat_lahir,
            tanggal_lahir: worker.tanggal_lahir,
            no_kk: worker.no_kk,
            status_pekerja: worker.status_pekerja_label,
            umur: worker.umur,
            jenis_pekerjaan: worker.jenis_pekerjaan_label,
            jenis_apd: worker.jenis_apd_label,
            ktp_file: worker.file_ktp,
            kk_file: worker.file_kk,
            ktp_thumb: worker.thumb_ktp,
            kk_thumb: worker.thumb_kk,
          })),
        });
      } else {
        throw new Error('Gagal memuat data pekerja atau petani');
      }
    } catch (err) {
      console.error('Error fetching details:', err);
      if (err?.response?.status === 401) {
        toast.error('Sesi anda telah berakhir, silahkan login kembali');
      } else {
        toast.error(err?.response?.data?.message || 'Gagal memuat data');
      }
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id, fetchDetail]);

  const handleDeleteClick = (pekerja) => {
    setPekerjaToDelete(pekerja);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pekerjaToDelete) return;

    setIsDeleting(true);
    try {
      await deletePekerja(pekerjaToDelete.id);
      toast.success(`Data pekerja ${pekerjaToDelete.nama} berhasil dihapus`);
      setIsDeleteModalOpen(false);
      setPekerjaToDelete(null);
      await fetchDetail();
    } catch (err) {
      console.error('Error deleting pekerja:', err);
      toast.error(err?.response?.data?.message || 'Gagal menghapus data pekerja');
    } finally {
      setIsDeleting(false);
    }
  };




  const renderIdentitasPekerjaSection = (pekerja, index) => {
    return (
      <section
        key={pekerja.id}
        className="rounded border border-neutral-300 bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">IDENTITAS PEKERJA</h3>
          {!isViewOnly && (
            <div className="flex gap-4">
              <button
                onClick={() => handleDeleteClick(pekerja)}
                className="text-sm font-medium text-tertiary underline hover:text-tertiary"
              >
                Hapus Data
              </button>
              <Link
                href={`/traceability/pekerja/ubah/${pekerja.id}`}
                className="text-sm font-medium text-primary underline hover:text-primary"
              >
                Ubah Data
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-4 text-sm text-neutral-700">
          <BorderBottomColData label="Nama" value={pekerja?.nama || '-'} />
          <BorderBottomColData
            label="Jenis Kelamin"
            value={pekerja?.jenis_kelamin || '-'}
          />
          <BorderBottomColData label="Alamat" value={pekerja?.alamat || '-'} />
          <BorderBottomColData label="No. KTP" value={pekerja?.no_ktp || '-'} />
          <BorderBottomColData
            label="Tempat Lahir"
            value={pekerja?.tempat_lahir || '-'}
          />
          <BorderBottomColData
            label="Tanggal Lahir"
            value={formatDate(pekerja?.tanggal_lahir)}
          />
          <BorderBottomColData label="No. KK" value={pekerja?.no_kk || '-'} />
          <BorderBottomColData
            label="Status Pekerja"
            value={pekerja?.status_pekerja || '-'}
          />
          <BorderBottomColData
            label="Umur"
            value={pekerja?.umur ? `${pekerja.umur} Tahun` : '-'}
          />
          <BorderBottomColData
            label="Jenis Pekerjaan"
            value={pekerja?.jenis_pekerjaan || '-'}
          />
          <BorderBottomColData
            label="Jenis APD"
            value={pekerja?.jenis_apd || '-'}
          />
        </div>

        {/* Document Viewer Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <AttachmentViewer
            label="File KTP"
            fileUrl={pekerja?.ktp_file}
            thumbUrl={pekerja?.ktp_thumb}
          />
          <AttachmentViewer
            label="File KK"
            fileUrl={pekerja?.kk_file}
            thumbUrl={pekerja?.kk_thumb}
          />
        </div>
      </section>
    );
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <BreadcrumbDetail items={crumbs} />
        {!isViewOnly && (
          <Button
            variant="primary"
            size="medium"
            onClick={() =>
              router.push(`/traceability/pekerja/tambah?petani=${id}`)
            }
            className="whitespace-nowrap"
          >
            Tambah Pekerja
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {/* IDENTITAS PEMILIK Section */}
        {pekerjaData?.identitas_pemilik ? (
          <section className="rounded border border-neutral-300 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">IDENTITAS PEMILIK</h3>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="medium" />
              </div>
            )}

            {error && (
              <div className="text-sm text-tertiary">
                Gagal memuat data:{' '}
                {error?.response?.data?.message || error.message}
              </div>
            )}

            {!loading && !error && pekerjaData?.identitas_pemilik && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-4 text-sm text-neutral-700">
                <BorderBottomColData
                  label="Id Petani"
                  value={pekerjaData.identitas_pemilik?.id_petani || '-'}
                />
                <BorderBottomColData
                  label="Nama Petani"
                  value={pekerjaData.identitas_pemilik?.nama || '-'}
                />
                <BorderBottomColData
                  label="Jenis Kelamin"
                  value={pekerjaData.identitas_pemilik?.jenis_kelamin || '-'}
                />
                <BorderBottomColData
                  label="Alamat"
                  value={pekerjaData.identitas_pemilik?.alamat || '-'}
                />
                <BorderBottomColData
                  label="No. KTP"
                  value={pekerjaData.identitas_pemilik?.no_ktp || '-'}
                />
                <BorderBottomColData
                  label="Tempat Lahir"
                  value={pekerjaData.identitas_pemilik?.tempat_lahir || '-'}
                />
                <BorderBottomColData
                  label="Tanggal Lahir"
                  value={formatDate(
                    pekerjaData.identitas_pemilik?.tanggal_lahir
                  )}
                />
                <BorderBottomColData
                  label="No. KK"
                  value={pekerjaData.identitas_pemilik?.no_kk || '-'}
                />
                <BorderBottomColData
                  label="Status Perkawinan"
                  value={
                    pekerjaData.identitas_pemilik?.status_perkawinan || '-'
                  }
                />
                <BorderBottomColData
                  label="Luas Kebun"
                  value={
                    pekerjaData.identitas_pemilik?.luas_kebun
                      ? `${pekerjaData.identitas_pemilik.luas_kebun} Ha`
                      : '-'
                  }
                />
                <BorderBottomColData
                  label="Jumlah Pekerja"
                  value={pekerjaData.identitas_pemilik?.jumlah_pekerja || '-'}
                />
              </div>
            )}
          </section>
        ) : (
          !loading &&
          !error && (
            <section className="flex flex-col items-center justify-center rounded border border-neutral-300 bg-white p-8 text-center">
              <p className="mb-4 text-neutral-500">
                Data petani tidak ditemukan atau belum lengkap.
              </p>
            </section>
          )
        )}

        {/* IDENTITAS PEKERJA Sections */}
        {!loading && !error && pekerjaData?.identitas_pekerja && (
          <>
            {pekerjaData.identitas_pekerja.length > 0 ? (
              pekerjaData.identitas_pekerja.map((pekerja, index) =>
                renderIdentitasPekerjaSection(pekerja, index)
              )
            ) : (
              <section className="flex flex-col items-center justify-center rounded border border-neutral-300 bg-white p-8 text-center">
                <p className="mb-4 text-neutral-500">
                  Belum ada data pekerja yang terdaftar untuk petani ini.
                </p>
                {!isViewOnly && (
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={() =>
                      router.push(`/traceability/pekerja/tambah?petani=${id}`)
                    }
                  >
                    Tambah Pekerja
                  </Button>
                )}
              </section>
            )}
          </>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Pekerja"
        itemName={pekerjaToDelete?.nama}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TraceabilityPekerjaDetail;
