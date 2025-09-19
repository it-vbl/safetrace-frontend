'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';

const mockKebunData = {
  id_kebun: 'GR-001-002-002',
  petani: 'Akeng Rupinus',
  kelompok_tani: 'Bepekaek Besamo',
  lokasi_kebun: 'Dusun Gonis Rabu',
  luas_kebun: '0.78',
  luas_peta: '0.78',
  waktu_tanam: 'Agustus, 2002',
  rspo: 'Sudah',
  ispo: 'Sudah',
  jenis_legalitas: 'SHM',
  no_legalitas: '593.21/328/2012/VII/2020',
  pemilik_legalitas: 'Agustinus Nery',
  stdb: '61.09-01.041',
  peta_kebun: {
    src: '/path/to/map-image.jpg',
    alt: 'Peta Kebun',
  },
  lampiran_dokumen: [
    {
      label: 'Peta - Agustinus Nery 0,78 Ha.pdf',
      src: '/path/to/peta-document.jpg',
      type: 'peta',
    },
    {
      label: 'Legalitas - Agustinus SHM Nery 1.60 Ha.pdf',
      src: '/path/to/legalitas-document.jpg',
      type: 'legalitas',
    },
    {
      label: 'STDB - Agustinus Nery.pdf',
      src: '/path/to/stdb-document.jpg',
      type: 'stdb',
    },
  ],
};

const DetailKebunPage = () => {
  const { id } = useParams();
  const router = useRouter();

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
            <BorderBottomColData
              label="Id Kebun"
              value={mockKebunData.id_kebun}
            />
            <BorderBottomColData label="Petani" value={mockKebunData.petani} />
            <BorderBottomColData
              label="Kelompok Tani"
              value={mockKebunData.kelompok_tani}
            />
            <BorderBottomColData
              label="Lokasi Kebun"
              value={mockKebunData.lokasi_kebun}
            />
            <BorderBottomColData
              label="Luas Kebun (Ha)"
              value={mockKebunData.luas_kebun}
            />

            {/* Row 2 */}
            <BorderBottomColData
              label="Luas Peta (Ha)"
              value={mockKebunData.luas_peta}
            />
            <BorderBottomColData
              label="Waktu Tanam"
              value={mockKebunData.waktu_tanam}
            />
            <BorderBottomColData
              label="RSPO"
              value={getStatusBadge(mockKebunData.rspo)}
            />
            <BorderBottomColData
              label="ISPO"
              value={getStatusBadge(mockKebunData.ispo)}
            />
            <BorderBottomColData
              label="Jenis Legalitas"
              value={mockKebunData.jenis_legalitas}
            />

            {/* Row 3 */}
            <BorderBottomColData
              label="No. Legalitas"
              value={mockKebunData.no_legalitas}
            />
            <BorderBottomColData
              label="Pemilik Legalitas"
              value={mockKebunData.pemilik_legalitas}
            />
            <BorderBottomColData label="STDB" value={mockKebunData.stdb} />
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
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600">Map Visual Here</p>
              </div>
            </div>
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
            {mockKebunData.lampiran_dokumen.map((item, index) => (
              <div key={index} className="rounded-lg border bg-gray-50 p-4">
                <div className="mb-3">
                  <h4 className="mb-2 text-sm font-semibold text-gray-800">
                    {item.label}
                  </h4>
                </div>

                <div className="flex h-48 items-center justify-center overflow-hidden rounded border bg-white p-2">
                  {item.type === 'peta' && (
                    <div className="flex h-full w-full items-center justify-center rounded border border-green-200 bg-green-50">
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded border border-red-400">
                          <span className="text-xs text-red-500">Peta</span>
                        </div>
                        <p className="text-xs text-gray-500">Peta Kebun</p>
                      </div>
                    </div>
                  )}

                  {item.type === 'legalitas' && (
                    <div className="flex h-full w-full items-center justify-center rounded border border-blue-200 bg-blue-50">
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded border border-gray-300 bg-white">
                          <span className="text-xs font-bold">SERTIFIKAT</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Sertifikat Legalitas
                        </p>
                      </div>
                    </div>
                  )}

                  {item.type === 'stdb' && (
                    <div className="flex h-full w-full items-center justify-center rounded border border-orange-200 bg-orange-50">
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded border border-gray-300 bg-white">
                          <span className="text-xs font-bold">STDB</span>
                        </div>
                        <p className="text-xs text-gray-500">Dokumen STDB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DetailKebunPage;
