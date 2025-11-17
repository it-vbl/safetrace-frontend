'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import ModalEditKebun from '@/components/molecules/ModalEditKebun';
import ModalEditLampiran from '@/components/molecules/ModalEditLampiran';
import ModalEditPeta from '@/components/molecules/ModalEditPeta';
import { getDetailKebun, getLampiranKebun } from '@/services/pekebun';

const DOCUMENT_CONFIGS = [
  {
    id: 'legalitas',
    label: 'Dokumen Legalitas',
    badge: 'SERTIFIKAT',
    fileKey: 'file_legalitas',
    thumbKey: 'thumb_legalitas',
    accentBorder: 'border-blue-200',
    accentBackground: 'bg-blue-50',
  },
  {
    id: 'stdb',
    label: 'Dokumen STDB',
    badge: 'STDB',
    fileKey: 'file_stdb',
    thumbKey: 'thumb_stdb',
    accentBorder: 'border-orange-200',
    accentBackground: 'bg-orange-50',
  },
  {
    id: 'rspo',
    label: 'Dokumen RSPO',
    badge: 'RSPO',
    fileKey: 'file_rspo',
    thumbKey: 'thumb_rspo',
    accentBorder: 'border-green-200',
    accentBackground: 'bg-green-50',
  },
  {
    id: 'ispo',
    label: 'Dokumen ISPO',
    badge: 'ISPO',
    fileKey: 'file_ispo',
    thumbKey: 'thumb_ispo',
    accentBorder: 'border-purple-200',
    accentBackground: 'bg-purple-50',
  },
];

const DetailKebunPage = () => {
  const { idKebun: id } = useParams();
  const router = useRouter();
  const [kebunData, setKebunData] = useState(null);
  const [lampiranData, setLampiranData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditPetaModal, setShowEditPetaModal] = useState(false);
  const [showEditLampiranModal, setShowEditLampiranModal] = useState(false);

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
            ...kebun,
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
          };
          console.log('MAPPED DATA', mappedData);
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

  // Handle edit modal success
  const handleEditSuccess = () => {
    // Refresh the page data
    window.location.reload();
  };

  // Handle edit peta modal success
  const handleEditPetaSuccess = () => {
    // Refresh the page data
    window.location.reload();
  };

  // Handle edit lampiran modal success
  const handleEditLampiranSuccess = () => {
    // Refresh the page data
    window.location.reload();
  };

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
    <div className="flex w-full flex-col gap-8">
      <BreadcrumbDetail items={crumbs} />

      <div className="flex flex-col gap-6">
        {/* === DETAIL SECTION === */}
        <section className="rounded border border-gray-300 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">DETAIL KEBUN</h3>
            <button
              onClick={() => setShowEditModal(true)}
              className="text-sm font-medium text-blue-700 underline hover:text-blue-800"
            >
              Ubah Data
            </button>
          </div>

          {/* === GRID LAYOUT FOR KEBUN DETAIL === */}
          <div className="grid grid-cols-5 gap-x-6 gap-y-4 text-sm text-gray-700">
            {/* Row 1 */}
            <BorderBottomColData label="Id Kebun" value={kebunData.id_kebun} />
            <BorderBottomColData label="Petani" value={kebunData.nama_petani} />
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
              <button
                onClick={() => setShowEditPetaModal(true)}
                className="text-sm font-medium text-blue-700 underline hover:text-blue-800"
              >
                Ubah Data
              </button>
            </div>
          </div>

          <div className="h-96 w-full overflow-hidden rounded border bg-gray-100">
            <Map
              mapClassName="h-full w-full"
              polygons={kebunData?.geom}
              position={[
                kebunData?.titik_koordinat?.coordinates[1],
                kebunData?.titik_koordinat?.coordinates[0],
              ]}
              highlightedPolygon={kebunData?.geom?.coordinates?.[0]?.map(
                (coord) => [coord[1], coord[0]]
              )}
              data={[
                {
                  id: kebunData.id_kebun,
                  peta: {
                    geom: {
                      coordinates: [
                        kebunData?.geom?.coordinates?.[0]?.map((coord) => [
                          coord[1],
                          coord[0],
                        ]),
                      ],
                    },
                    titik_koordinat: kebunData.titik_koordinat,
                  },
                  lahan: {
                    status_lahan_label: 'Milik Sendiri',
                    luas_lahan: kebunData.luas_kebun,
                  },
                  komoditas_info: 'Kelapa Sawit',
                  pekebun: {
                    nama: kebunData.nama_petani,
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
            <button
              onClick={() => setShowEditLampiranModal(true)}
              className="text-sm font-medium text-blue-700 underline hover:text-blue-800"
            >
              Ubah Data
            </button>
          </div>

          {/* === GRID DOCUMENT === */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {DOCUMENT_CONFIGS.filter((doc) => lampiranData?.[doc.fileKey]).map(
              (doc) => {
                const fileUrl = lampiranData?.[doc.fileKey];
                const thumbUrl =
                  lampiranData?.[doc.thumbKey] || lampiranData?.[doc.fileKey];

                return (
                  <div
                    key={doc.id}
                    className="rounded-lg border bg-gray-50 p-4"
                  >
                    <div className="mb-3">
                      <h4 className="mb-2 text-sm font-semibold text-gray-800">
                        {doc.label}
                      </h4>
                    </div>
                    <div className="flex h-48 items-center justify-center overflow-hidden rounded border bg-white p-2">
                      <div
                        className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded border`}
                      >
                        {thumbUrl ? (
                          <Image
                            src={thumbUrl}
                            alt={doc.label}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded border border-gray-300 bg-white">
                              <span className="text-xs font-bold">
                                {doc.badge}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{doc.label}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Lihat Dokumen
                      </a>
                    </div>
                  </div>
                );
              }
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

      {/* Edit Modal */}
      <ModalEditKebun
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        kebunData={kebunData}
        onSuccess={handleEditSuccess}
      />

      {/* Edit Peta Modal */}
      <ModalEditPeta
        isOpen={showEditPetaModal}
        onClose={() => setShowEditPetaModal(false)}
        kebunData={{
          ...kebunData,
          peta: {
            geom: kebunData?.geom,
            titik_koordinat: kebunData?.titik_koordinat,
          },
        }}
        onSuccess={handleEditPetaSuccess}
      />

      {/* Edit Lampiran Modal */}
      <ModalEditLampiran
        isOpen={showEditLampiranModal}
        onClose={() => setShowEditLampiranModal(false)}
        kebunData={kebunData}
        lampiranData={lampiranData}
        onSuccess={handleEditLampiranSuccess}
      />
    </div>
  );
};

export default DetailKebunPage;
