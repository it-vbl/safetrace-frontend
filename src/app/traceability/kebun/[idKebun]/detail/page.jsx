'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

import AttachmentViewer from '@/components/molecules/AttachmentViewer';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import ModalEditKebun from '@/components/molecules/ModalEditKebun';
import ModalEditLampiran from '@/components/molecules/ModalEditLampiran';
import ModalEditPeta from '@/components/molecules/ModalEditPeta';
import { downloadSHPKebun } from '@/services/kebun';
import { getDetailKebun, getLampiranKebun } from '@/services/pekebun';

const DOCUMENT_CONFIGS = [
  {
    id: 'peta',
    label: 'File Peta',
    badge: 'PETA',
    fileKey: 'file_gambar_peta',
    thumbKey: 'thumb_gambar_peta',
    accentBorder: 'border-yellow-200',
    accentBackground: 'bg-yellow-50',
  },
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

const Map = dynamic(() => import('@/components/organisms/MapView'), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

const DetailKebunPage = () => {
  const { idKebun: id } = useParams();
  const [kebunData, setKebunData] = useState(null);
  const [lampiranData, setLampiranData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditPetaModal, setShowEditPetaModal] = useState(false);
  const [showEditLampiranModal, setShowEditLampiranModal] = useState(false);

  const fetchKebun = async () => {
    try {
      const kebunResponse = await getDetailKebun(id);
      if (kebunResponse?.data?.status === 'success') {
        const kebun = kebunResponse.data.data;
        const mappedData = {
          ...kebun,
          waktu_tanam: new Date(kebun.waktu_tanam).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          rspo: kebun.is_rspo ? 'Sudah' : 'Belum',
          ispo: kebun.is_ispo ? 'Sudah' : 'Belum',
        };
        setKebunData(mappedData);
      } else {
        throw new Error('Invalid kebun response format');
      }
    } catch (error) {
      console.error('Error fetching kebun data:', error);
      toast.error('Gagal memuat data kebun');
    }
  };

  const fetchLampiran = async () => {
    try {
      const lampiranResponse = await getLampiranKebun(id).catch(() => null);
      if (lampiranResponse?.data?.status === 'success') {
        setLampiranData(lampiranResponse.data.data);
      } else {
        setLampiranData(null);
      }
    } catch (error) {
      console.error('Error fetching lampiran data:', error);
      setLampiranData(null);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchKebun(), fetchLampiran()]);
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchAllData();
    }
  }, [id]);

  // Handle edit modal success
  const handleEditSuccess = () => {
    fetchKebun();
  };

  // Handle edit peta modal success
  const handleEditPetaSuccess = () => {
    fetchKebun();
  };

  // Handle edit lampiran modal success
  const handleEditLampiranSuccess = () => {
    fetchLampiran();
  };

  const handleDownloadPeta = async () => {
    try {
      const toastId = toast.loading('Mengunduh SHP...', { autoClose: false });
      const res = await downloadSHPKebun(kebunData?.id);

      const contentDisposition = res.headers['content-disposition'];
      let filename = 'peta.zip';

      if (contentDisposition) {
        const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
        if (matches != null && matches[1]) filename = matches[1];
      }

      const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.update(toastId, {
        render: 'File SHP berhasil diunduh',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error(err?.response?.data?.message || 'Gagal mengunduh SHP');
    }
  };

  const crumbs = [
    { label: 'KEBUN', href: '/traceability/kebun' },
    { label: 'DETAIL KEBUN' },
  ];

  const getStatusBadge = (status) => {
    return (
      <span
        className={`inline-block rounded px-2 py-1 text-xs font-semibold ${status === 'Sudah'
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
      <div className="flex w-full min-w-[320px] max-w-full flex-col gap-4 px-4 sm:gap-6 sm:px-6 lg:gap-8 lg:px-0">
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
      <div className="flex w-full min-w-[320px] max-w-full flex-col gap-4 px-4 sm:gap-6 sm:px-6 lg:gap-8 lg:px-0">
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
    <div className="flex w-full min-w-[320px] max-w-full flex-col gap-4 px-4 sm:gap-6 sm:px-6 lg:gap-8 lg:px-0">
      <BreadcrumbDetail items={crumbs} />

      <div className="flex flex-col gap-4 sm:gap-6">
        {/* === DETAIL SECTION === */}
        <section className="rounded border border-gray-300 bg-white p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base font-semibold sm:text-lg">DETAIL KEBUN</h3>
            <button
              onClick={() => setShowEditModal(true)}
              className="self-start text-sm font-medium text-blue-700 underline hover:text-blue-800 sm:self-auto"
            >
              Ubah Data
            </button>
          </div>

          {/* === GRID LAYOUT FOR KEBUN DETAIL === */}
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 text-sm text-gray-700 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {/* Row 1: Identitas Dasar */}
            <BorderBottomColData label="Id Kebun" value={kebunData.id_kebun || '-'} />
            <BorderBottomColData label="Petani" value={kebunData.nama_petani || '-'} />
            <BorderBottomColData label="Kelompok Tani" value={kebunData.kelompok_tani || '-'} />
            <BorderBottomColData label="Kelurahan" value={kebunData.desa_nama || '-'} />
            <BorderBottomColData label="Lokasi Kebun" value={kebunData.lokasi_kebun || '-'} />
            <BorderBottomColData label="Luas Kebun (Ha)" value={kebunData.luas || '-'} />

            {/* Row 2: Lokasi & Luas */}
            <BorderBottomColData label="Luas Peta (Ha)" value={kebunData.luas_peta || '-'} />
            <BorderBottomColData label="Waktu Tanam" value={kebunData.waktu_tanam || '-'} />
            <BorderBottomColData label="RSPO" value={getStatusBadge(kebunData.rspo)} />
            <BorderBottomColData label="ISPO" value={getStatusBadge(kebunData.ispo)} />
            <BorderBottomColData label="Jenis Legalitas" value={kebunData.jenis_legalitas_label || '-'} />
            <BorderBottomColData label="No. Legalitas" value={kebunData.nomor_legalitas || '-'} />

            {/* Row 3: Spesifikasi Lahan & Tanam */}
            <BorderBottomColData label="Pemilik Legalitas" value={kebunData.pemilik_legalitas || '-'} />
            <BorderBottomColData label="No. STDB" value={kebunData.nomor_stdb || '-'} />
            <BorderBottomColData label="Komoditas" value={kebunData.komoditas_label || '-'} />
            <BorderBottomColData label="Total Produksi 1 Tahun (Kg)" value={kebunData.total_prod_per_tahun ? `${kebunData.total_prod_per_tahun} Kg` : '-'} />
            <BorderBottomColData label="Tahun Peremajaan" value={kebunData.tahun_peremajaan || '-'} />
            <BorderBottomColData label="Jumlah Pohon" value={kebunData.jumlah_pohon || kebunData.jumlah_pokok || '-'} />

            {/* Row 4: Waktu Tanam & Produksi */}
            <BorderBottomColData label="Pola Tanam" value={kebunData.pola_tanam_label || '-'} />
            <BorderBottomColData label="Jenis Lahan" value={kebunData.jenis_lahan_label || '-'} />
            <BorderBottomColData label="Asal Benih" value={kebunData.asal_benih_label || '-'} />
            <BorderBottomColData label="Jenis Pupuk" value={kebunData.jenis_pupuk_label || '-'} />
            <BorderBottomColData label="Mitra Penjualan" value={kebunData.mitra_penjualan || '-'} />
          </div>
        </section>

        {/* === MAP SECTION === */}
        <section className="rounded border border-gray-300 bg-white p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base font-semibold sm:text-lg">PETA</h3>
            {kebunData?.geom && (
              <div className="flex gap-3 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleDownloadPeta}
                  className="text-sm font-medium text-green-700 underline hover:text-green-800"
                >
                  Unduh SHP
                </button>
                <button
                  onClick={() => setShowEditPetaModal(true)}
                  className="text-sm font-medium text-blue-700 underline hover:text-blue-800"
                >
                  Ubah Data
                </button>
              </div>
            )}
            {!kebunData?.geom && (
              <button
                onClick={() => setShowEditPetaModal(true)}
                className="self-start text-sm font-medium text-blue-700 underline hover:text-blue-800 sm:self-auto"
              >
                Tambah Data
              </button>
            )}
          </div>

          {kebunData?.geom ? (
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
          ) : (
            <div className="flex h-96 w-full items-center justify-center rounded border bg-gray-50">
              <div className="text-center">
                <p className="text-gray-500">Kebun belum memiliki data peta</p>
              </div>
            </div>
          )}
        </section>

        {/* === LAMPIRAN SECTION === */}
        <section className="rounded border border-gray-300 bg-white p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="mb-2 text-base font-semibold sm:mb-4 sm:text-lg">LAMPIRAN</h3>
            {lampiranData ? (
              <button
                onClick={() => setShowEditLampiranModal(true)}
                className="self-start text-sm text-blue-600 underline hover:text-blue-800 sm:self-auto"
              >
                Ubah Data
              </button>
            ) : (
              // If lampiranData is undefined/null, but there might still be "Ubah Data" needed... typically they should click Add Data but "Ubah Data" is here in previous.
              <button
                onClick={() => setShowEditLampiranModal(true)}
                className="self-start text-sm text-blue-600 underline hover:text-blue-800 sm:self-auto"
              >
                Ubah Data
              </button>
            )}
          </div>

          {lampiranData && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:gap-6">
              {DOCUMENT_CONFIGS.map((doc) => (
                <AttachmentViewer
                  key={doc.id}
                  label={doc.label}
                  fileUrl={lampiranData?.[doc.fileKey]}
                  thumbUrl={lampiranData?.[doc.thumbKey]}
                />
              ))}

              {!lampiranData?.file_legalitas &&
                !lampiranData?.file_stdb &&
                !lampiranData?.file_rspo &&
                !lampiranData?.file_ispo &&
                !lampiranData?.file_gambar_peta && (
                  <div className="text-sm text-gray-600">
                    Belum ada data lampiran.
                  </div>
                )}
            </div>
          )}

          {!lampiranData && (
            <div className="text-sm text-gray-600">
              Belum ada data lampiran.
            </div>
          )}
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
