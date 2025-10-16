'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import moment from 'moment';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import PekerjaService from '@/services/pekerja';

// Mock data for pekerja detail - replace with actual API call
const mockPekerjaData = {
  identitas_pemilik: {
    id_petani: 'P-001-APKS-001-001',
    nama: 'Agustinus Nery',
    jenis_kelamin: 'Laki - Laki',
    alamat: 'Dusun Gonis Rabu Desa Rangkang Sungkung',
    no_ktp: '6109010805890003',
    tempat_lahir: 'Sanggau',
    tanggal_lahir: '1989-05-08',
    no_kk: '6109011711110021',
    status_perkawinan: 'Kawin',
    luas_kebun: '0.78',
    jumlah_pekerja: 3,
  },
  identitas_pekerja: [
    {
      id: 1,
      nama: 'Agustinus Nery',
      jenis_kelamin: 'Laki - Laki',
      alamat: 'Dusun Gonis Rabu Desa Rangkang Sungkung',
      no_ktp: '6109010805890003',
      tempat_lahir: 'Sanggau',
      tanggal_lahir: '1989-05-08',
      no_kk: '6109011711110021',
      status_perkawinan: 'Kawin',
      ktp_file: '/images/sample-ktp.jpg',
      kk_file: '/images/sample-kk.jpg',
    },
    {
      id: 2,
      nama: 'Agustinus Nery',
      jenis_kelamin: 'Laki - Laki',
      alamat: 'Dusun Gonis Rabu Desa Rangkang Sungkung',
      no_ktp: '6109010805890003',
      tempat_lahir: 'Sanggau',
      tanggal_lahir: '1989-05-08',
      no_kk: '6109011711110021',
      status_perkawinan: 'Kawin',
      ktp_file: '/images/sample-ktp.jpg',
      kk_file: '/images/sample-kk.jpg',
    },
  ],
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return moment(dateStr).isValid()
    ? moment(dateStr).format('DD-MM-YYYY')
    : dateStr;
};

const TraceabilityPekerjaDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  const [pekerjaData, setPekerjaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PEKERJA', href: '/traceability/pekerja' },
    { label: 'DETAIL PEKERJA' },
  ];

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await PekerjaService.getPekerjaById(id);

        if (response?.data?.status === 'success') {
          setPekerjaData(response.data.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching pekerja detail:', err);
        toast.error('Gagal memuat data pekerja');
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  const renderDocumentViewer = (label, fileUrl, title) => {
    if (!fileUrl) return null;

    return (
      <div className="flex-1">
        <div className="mb-2 text-sm font-medium text-gray-700">{title}</div>
        <div className="relative">
          <div className="aspect-[4/3] w-full overflow-hidden rounded border border-gray-300 bg-gray-50">
            {fileUrl ? (
              <Image
                src={fileUrl}
                alt={label}
                fill
                className="object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector(
                    '.fallback-content'
                  ).style.display = 'flex';
                }}
              />
            ) : null}
            <div className="fallback-content hidden h-full w-full items-center justify-center">
              <div className="text-center">
                <p className="mb-2 text-sm text-gray-600">
                  Dokumen tidak tersedia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderIdentitasPekerjaSection = (pekerja, index) => {
    return (
      <section
        key={pekerja.id}
        className="rounded border border-gray-300 bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">IDENTITAS PEKERJA</h3>
          <Link
            href="#"
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            Ubah Data
          </Link>
        </div>

        <div className="grid grid-cols-6 gap-x-6 gap-y-4 text-sm text-gray-700">
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
            label="Status Perkawinan"
            value={pekerja?.status_perkawinan || '-'}
          />
        </div>

        {/* Document Viewer Section */}
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:gap-6">
          {renderDocumentViewer(
            'KTP',
            pekerja?.ktp_file,
            `KTP - ${pekerja?.nama || 'Agustinus Nery'}.pdf`
          )}
          {renderDocumentViewer(
            'KK',
            pekerja?.kk_file,
            `KK - ${pekerja?.nama || 'Agustinus Nery'}.pdf`
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex justify-between">
        <BreadcrumbDetail items={crumbs} />
        <Button
          variant="primary"
          size="medium"
          onClick={() => router.push('/traceability/pekerja/tambah')}
          className="whitespace-nowrap"
        >
          Tambah Pekerja
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {/* IDENTITAS PEMILIK Section */}
        <section className="rounded border border-gray-300 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">IDENTITAS PEMILIK</h3>
            <Link
              href="#"
              className="text-sm text-blue-600 underline hover:text-blue-800"
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

          {!loading && !error && pekerjaData?.identitas_pemilik && (
            <div className="grid grid-cols-6 gap-x-6 gap-y-4 text-sm text-gray-700">
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
                value={formatDate(pekerjaData.identitas_pemilik?.tanggal_lahir)}
              />
              <BorderBottomColData
                label="No. KK"
                value={pekerjaData.identitas_pemilik?.no_kk || '-'}
              />
              <BorderBottomColData
                label="Status Perkawinan"
                value={pekerjaData.identitas_pemilik?.status_perkawinan || '-'}
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

        {/* IDENTITAS PEKERJA Sections */}
        {!loading &&
          !error &&
          pekerjaData?.identitas_pekerja &&
          pekerjaData.identitas_pekerja.map((pekerja, index) =>
            renderIdentitasPekerjaSection(pekerja, index)
          )}
      </div>
    </div>
  );
};

export default TraceabilityPekerjaDetail;
