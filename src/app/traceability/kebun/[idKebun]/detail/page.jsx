'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';

import { getDetailKebun, getLampiranKebun } from '@/services/pekebun';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';

const DetailKebunPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [kebunData, setKebunData] = useState(null);
  const [lampiranData, setLampiranData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic import for MapView component
  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/organisms/MapView'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  // Fetch kebun detail and lampiran data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch both kebun detail and lampiran data in parallel
        const [kebunResponse, lampiranResponse] = await Promise.all([
          getDetailKebun(id),
          getLampiranKebun(id).catch(() => null), // Lampiran might not exist, so catch errors
        ]);

        // Process kebun detail
        if (kebunResponse?.data?.status === 'success') {
          const kebun = kebunResponse.data.data;

          // Map API response to component structure
          const mappedData = {
            id_kebun: kebun.id_kebun,
            petani: '-', // Petani name not included in this endpoint
            kelompok_tani: '-', // Kelompok not included in this endpoint
            lokasi_kebun: kebun.lokasi_kebun,
            luas_kebun: kebun.luas,
            luas_peta: kebun.luas, // Using same value as luas_kebun
            waktu_tanam: new Date(kebun.waktu_tanam).toLocaleDateString(
              'id-ID',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            ),
            rspo: kebun.is_rspo ? 'Sudah' : 'Belum',
            ispo: kebun.is_ispo ? 'Sudah' : 'Belum',
            jenis_legalitas: kebun.jenis_legalitas,
            no_legalitas: kebun.nomor_legalitas,
            pemilik_legalitas: kebun.pemiliki_legalitas,
            stdb: kebun.nomor_stdb,
            // Map geometry data for the map
            geom: kebun.geom,
            titik_koordinat: kebun.titik_koordinat,
          };

          setKebunData(mappedData);
        } else {
          throw new Error('Invalid kebun response format');
        }

        // Process lampiran data
        if (lampiranResponse?.data?.status === 'success') {
          setLampiranData(lampiranResponse.data.data);
        } else {
          setLampiranData(null); // No lampiran data available
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Gagal memuat data kebun');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const crumbs = [
    { label: 'KEBUN', href: '/traceability/kebun' },
    { label: 'DETAIL KEBUN' },
  ];

  const getStatusBadge = (status) => {
    return (
      <span
        className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
          status === 'Sudah'
            ? 'bg-green-200 text-green-800'
            : 'bg-red-200 text-red-800'
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <BreadcrumbDetail items={crumbs} />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="text-gray-600">Memuat data kebun...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!kebunData) {
    return (
      <div className="flex flex-col gap-8">
        <BreadcrumbDetail items={crumbs} />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600">Data kebun tidak ditemukan</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <BreadcrumbDetail items={crumbs} />

      <div className="flex flex-col gap-6">
        {/* === DETAIL SECTION === */}
        <section className="rounded border border-gray-300 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">DETAIL KEBUN</h3>
            <Link
              href={`/kebun/${id}/edit`}
              className="text-sm font-medium text-blue-700 underline hover:text-blue-800"
            >
              Ubah Data
            </Link>
          </div>

          {/* === GRID LAYOUT FOR KEBUN DETAIL === */}
          <div className="grid grid-cols-5 gap-x-6 gap-y-4 text-sm text-gray-700">
            {/* Row 1 */}
            <BorderBottomColData label="Id Kebun" value={kebunData.id_kebun} />
            <BorderBottomColData label="Petani" value={kebunData.petani} />
            <BorderBottomColData
              label="Kelompok Tani"
              value={kebunData.kelompok_tani}
            />
            <BorderBottomColData
              label="Lokasi Kebun"
              value={kebunData.lokasi_kebun}
            />
            <BorderBottomColData
              label="Luas Kebun (Ha)"
              value={kebunData.luas_kebun}
            />

            {/* Row 2 */}
            <BorderBottomColData
              label="Luas Peta (Ha)"
              value={kebunData.luas_peta}
            />
            <BorderBottomColData
              label="Waktu Tanam"
              value={kebunData.waktu_tanam}
            />
            <BorderBottomColData
              label="RSPO"
              value={getStatusBadge(kebunData.rspo)}
            />
            <BorderBottomColData
              label="ISPO"
              value={getStatusBadge(kebunData.ispo)}
            />
            <BorderBottomColData
              label="Jenis Legalitas"
              value={kebunData.jenis_legalitas}
            />

            {/* Row 3 */}
            <BorderBottomColData
              label="No. Legalitas"
              value={kebunData.no_legalitas}
            />
            <BorderBottomColData
              label="Pemilik Legalitas"
              value={kebunData.pemilik_legalitas}
            />
            <BorderBottomColData label="STDB" value={kebunData.stdb} />
          </div>
        </section>

        {/* === MAP SECTION === */}
        <section className="rounded border border-gray-300 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">PETA</h3>
            <div className="flex gap-3">
              <Link
                href={`/kebun/${id}/unduh-shp`}
                className="text-sm font-medium text-green-700 underline hover:text-green-800"
              >
                Unduh SHP
              </Link>
              <Link
                href={`/kebun/${id}/ubah-peta`}
                className="text-sm font-medium text-blue-700 underline hover:text-blue-800"
              >
                Ubah Data
              </Link>
            </div>
          </div>

          <div className="h-96 w-full overflow-hidden rounded border bg-gray-100">
            <Map
              mapClassName="h-full w-full"
              highlightedPolygon={kebunData?.geom?.coordinates?.[0]}
              position={kebunData?.titik_koordinat?.coordinates}
              data={[
                {
                  id: kebunData.id_kebun,
                  peta: {
                    geom: kebunData.geom,
                    titik_koordinat: kebunData.titik_koordinat,
                  },
                  lahan: {
                    status_lahan_label: 'Milik Sendiri',
                    luas_lahan: kebunData.luas_kebun,
                  },
                  komoditas_info: 'Kelapa Sawit',
                  pekebun: {
                    nama: kebunData.petani,
                  },
                },
              ]}
              showPolygonPopup={true}
              zoom={15}
            />
          </div>
        </section>

        {/* === LAMPIRAN SECTION === */}
        <section className="rounded border border-gray-300 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">LAMPIRAN</h3>
            <Link
              href={`/kebun/${id}/ubah-lampiran`}
              className="text-sm font-medium text-blue-700 underline hover:text-blue-800"
            >
              Ubah Data
            </Link>
          </div>

          {/* === GRID DOCUMENT === */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Legalitas Document */}
            {lampiranData?.file_legalitas && (
              <div className="rounded-lg border bg-gray-50 p-4">
                <div className="mb-3">
                  <h4 className="mb-2 text-sm font-semibold text-gray-800">
                    Dokumen Legalitas
                  </h4>
                </div>
                <div className="flex h-48 items-center justify-center overflow-hidden rounded border bg-white p-2">
                  <div className="flex h-full w-full items-center justify-center rounded border border-blue-200 bg-blue-50">
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded border border-gray-300 bg-white">
                        <span className="text-xs font-bold">SERTIFIKAT</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Sertifikat Legalitas
                      </p>
                      <a
                        href={lampiranData.file_legalitas}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-800"
                      >
                        Lihat Dokumen
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STDB Document */}
            {lampiranData?.file_stdb && (
              <div className="rounded-lg border bg-gray-50 p-4">
                <div className="mb-3">
                  <h4 className="mb-2 text-sm font-semibold text-gray-800">
                    Dokumen STDB
                  </h4>
                </div>
                <div className="flex h-48 items-center justify-center overflow-hidden rounded border bg-white p-2">
                  <div className="flex h-full w-full items-center justify-center rounded border border-orange-200 bg-orange-50">
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded border border-gray-300 bg-white">
                        <span className="text-xs font-bold">STDB</span>
                      </div>
                      <p className="text-xs text-gray-500">Dokumen STDB</p>
                      <a
                        href={lampiranData.file_stdb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-800"
                      >
                        Lihat Dokumen
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RSPO Document */}
            {lampiranData?.file_rspo && (
              <div className="rounded-lg border bg-gray-50 p-4">
                <div className="mb-3">
                  <h4 className="mb-2 text-sm font-semibold text-gray-800">
                    Dokumen RSPO
                  </h4>
                </div>
                <div className="flex h-48 items-center justify-center overflow-hidden rounded border bg-white p-2">
                  <div className="flex h-full w-full items-center justify-center rounded border border-green-200 bg-green-50">
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded border border-gray-300 bg-white">
                        <span className="text-xs font-bold">RSPO</span>
                      </div>
                      <p className="text-xs text-gray-500">Dokumen RSPO</p>
                      <a
                        href={lampiranData.file_rspo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-800"
                      >
                        Lihat Dokumen
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ISPO Document */}
            {lampiranData?.file_ispo && (
              <div className="rounded-lg border bg-gray-50 p-4">
                <div className="mb-3">
                  <h4 className="mb-2 text-sm font-semibold text-gray-800">
                    Dokumen ISPO
                  </h4>
                </div>
                <div className="flex h-48 items-center justify-center overflow-hidden rounded border bg-white p-2">
                  <div className="flex h-full w-full items-center justify-center rounded border border-purple-200 bg-purple-50">
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded border border-gray-300 bg-white">
                        <span className="text-xs font-bold">ISPO</span>
                      </div>
                      <p className="text-xs text-gray-500">Dokumen ISPO</p>
                      <a
                        href={lampiranData.file_ispo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-800"
                      >
                        Lihat Dokumen
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No documents message */}
            {!lampiranData?.file_legalitas &&
              !lampiranData?.file_stdb &&
              !lampiranData?.file_rspo &&
              !lampiranData?.file_ispo && (
                <div className="col-span-full flex items-center justify-center py-12">
                  <div className="text-center">
                    <p className="text-gray-500">Tidak ada lampiran dokumen</p>
                  </div>
                </div>
              )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DetailKebunPage;
