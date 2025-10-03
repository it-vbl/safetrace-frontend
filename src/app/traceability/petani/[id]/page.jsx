'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import moment from 'moment';

import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';

import {
  getDetailLampiranPetani,
  getDetailPetani,
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

  const [petani, setPetani] = useState(null);
  const [lampiran, setLampiran] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lampiranLoading, setLampiranLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lampiranError, setLampiranError] = useState(null);

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PETANI', href: '/traceability/petani' },
    { label: 'DETAIL PETANI' },
  ];

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
      <div key={label} className="flex-1 rounded-lg border border-gray-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">{label}</h4>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            Ubah Data
          </a>
        </div>

        <div className="w-full">
          {isImage ? (
            <div className="relative">
              <Image
                src={fileUrl}
                alt={label}
                width={400}
                height={300}
                className="h-auto w-full max-w-md rounded border border-gray-300"
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
                className="h-96 w-full rounded border border-gray-300"
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
              <div className="text-center">
                <p className="mb-2 text-sm text-gray-600">
                  File tidak dapat ditampilkan
                </p>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline hover:text-blue-800"
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
    <div className="flex flex-col gap-8">
      <BreadcrumbDetail items={crumbs} />
      <div className=" flex flex-col gap-6">
        <section className="rounded border border-gray-300 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">IDENTITAS</h3>
            <Link
              href={`/traceability/petani/${id}/edit`}
              className="text-blue-600 underline"
            >
              Ubah Data
            </Link>
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
            <div className="grid grid-cols-6 gap-x-6 gap-y-4 text-sm text-gray-700">
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
                      petani?.status_keanggotaan === 'Keluar' ||
                      petani?.status_keanggotaan === '0'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-green-200 text-green-800'
                    }`}
                  >
                    {petani?.status_keanggotaan === '0'
                      ? 'Keluar'
                      : petani?.status_keanggotaan === '1'
                      ? 'Aktif'
                      : petani?.status_keanggotaan || 'Tidak Diketahui'}
                  </span>
                }
              />
            </div>
          )}
        </section>

        <section className="rounded border border-gray-300 bg-white p-6">
          <h3 className="mb-4 font-semibold">LAMPIRAN IDENTITAS</h3>

          {lampiranLoading && <LoadingSpinner />}

          {lampiranError && (
            <div className="text-sm text-red-600">
              Gagal memuat lampiran:{' '}
              {lampiranError?.response?.data?.message || lampiranError.message}
            </div>
          )}

          {!lampiranLoading && !lampiranError && lampiran && (
            <div className="flex flex-col gap-4 md:flex-row md:gap-6">
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
    </div>
  );
};

export default TraceabilityPetaniDetail;
