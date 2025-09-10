'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import Breadcrumb from '@/components/molecules/Breadcrumbs';

const mockPetaniData = {
  id: '001-APKS-001-001',
  nama: 'Agustinus Nery',
  jenis_kelamin: 'Laki - Laki',
  kelompok_tani: 'Bepekaek Besamo',
  alamat: 'Dusun Gonis Rabu Desa Gonis Tekam. Sekadau Hilir',
  no_ktp: '6109010805890003',
  tempat_lahir: 'Gonis Rabu',
  tanggal_lahir: '08-05-1989',
  no_kk: '610901171110021',
  status_pernikahan: 'Kawin',
  no_nib: '6109010805890003',
  tanggal_terbit_sppl: 'Sekadau, 29-10-2021',
  tanggal_bergabung: '19/10/2017',
  tanggal_keluar: '19/10/2024',
  no_whatsapp: '0822115918622',
  status_keanggotaan: 'Keluar',
  lampiran_identitas: [
    {
      label: 'KTP - Agustinus Nery.pdf',
      src: '/path/to/ktp-image.jpg',
    },
    {
      label: 'KK - Agustinus Nery.pdf',
      src: '/path/to/kk-image.jpg',
    },
    {
      label: 'NIB - Agustinus Nery.pdf',
      src: '/path/to/nib-image.jpg',
    },
  ],
};

const TraceabilityPetaniDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  const crumbs = [
    { name: 'Home', url: '/' },
    { name: 'Petani', url: '/traceability/petani' },
    { name: 'Detail Petani' },
  ];

  // Since integration is skipped, use mock data directly

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb crumbs={crumbs} />
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
          <div className="grid grid-cols-6 gap-x-6 gap-y-4 text-sm text-gray-700">
            <BorderBottomColData label="Id Petani" value={mockPetaniData.id} />
            <BorderBottomColData
              label="Nama Petani"
              value={mockPetaniData.nama}
            />
            <BorderBottomColData
              label="Jenis Kelamin"
              value={mockPetaniData.jenis_kelamin}
            />
            <BorderBottomColData
              label="Kelompok Tani"
              value={mockPetaniData.kelompok_tani}
            />
            <BorderBottomColData label="Alamat" value={mockPetaniData.alamat} />
            <BorderBottomColData
              label="No. KTP"
              value={mockPetaniData.no_ktp}
            />

            <BorderBottomColData
              label="Tempat Lahir"
              value={mockPetaniData.tempat_lahir}
            />
            <BorderBottomColData
              label="Tanggal Lahir"
              value={mockPetaniData.tanggal_lahir}
            />
            <BorderBottomColData label="No. KK" value={mockPetaniData.no_kk} />
            <BorderBottomColData
              label="Status Pernikahan"
              value={mockPetaniData.status_pernikahan}
            />
            <BorderBottomColData
              label="No. NIB"
              value={mockPetaniData.no_nib}
            />
            <BorderBottomColData
              label="Tanggal Terbit SPPL"
              value={mockPetaniData.tanggal_terbit_sppl}
            />

            <BorderBottomColData
              label="Tanggal Bergabung"
              value={mockPetaniData.tanggal_bergabung}
            />
            <BorderBottomColData
              label="Tanggal Keluar"
              value={mockPetaniData.tanggal_keluar}
            />
            <BorderBottomColData
              label="No. Whatsapp"
              value={mockPetaniData.no_whatsapp}
            />
            <BorderBottomColData
              label="Status Keanggotaan"
              value={
                <span
                  className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                    mockPetaniData.status_keanggotaan === 'Keluar'
                      ? 'bg-red-200 text-red-800'
                      : 'bg-green-200 text-green-800'
                  }`}
                >
                  {mockPetaniData.status_keanggotaan}
                </span>
              }
            />
          </div>
        </section>

        <section className="rounded border border-gray-300 bg-white p-6">
          <h3 className="mb-4 font-semibold">LAMPIRAN IDENTITAS</h3>
          <div className="grid grid-cols-3 gap-4">
            {mockPetaniData.lampiran_identitas.map((item, index) => (
              <div key={index} className="rounded border p-2">
                <div className="mb-2 text-sm font-semibold">{item.label}</div>
                <img
                  src={item.src}
                  alt={item.label}
                  className="h-auto w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TraceabilityPetaniDetail;
