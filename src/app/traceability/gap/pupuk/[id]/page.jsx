'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Button from '@/components/atoms/Button';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import EditPupukModal from '@/components/molecules/EditPupukModal';
import YearCard from '@/components/molecules/YearCard';

const formatNumber = (num) =>
  typeof num === 'number'
    ? num.toLocaleString('id-ID')
    : (Number(num) || 0).toLocaleString('id-ID');

const mockPupukDetail = {
  kebun: {
    id_kebun: 'GR-001-002-002',
    petani: 'Akeng Rupinus',
    kelompok_tani: 'Bepekaek Besamo',
    luas_kebun_ha: 0.78,
    tahun_tanam: 2002,
    umur_tanaman: '21 Tahun',
    jumlah_pokok: 100,
    total_pupuk_kg: 500,
  },
  penggunaan_tahunan: [
    {
      tahun: 2025,
      semester: {
        'Semester 1': {
          npk: { waktu: 'Maret', jumlah: 200 },
          nitrogen: { waktu: '-', jumlah: 200 },
          pospat: { waktu: 'Maret', jumlah: 200 },
          kalium: { waktu: '-', jumlah: 200 },
          boron: { waktu: 'Maret', jumlah: 100 },
          magnesium: { waktu: '-', jumlah: 200 },
        },
        'Semester 2': {
          npk: { waktu: '-', jumlah: 0 },
          nitrogen: { waktu: '-', jumlah: 0 },
          pospat: { waktu: '-', jumlah: 0 },
          kalium: { waktu: '-', jumlah: 0 },
          boron: { waktu: '-', jumlah: 0 },
          magnesium: { waktu: '-', jumlah: 0 },
        },
      },
    },
    {
      tahun: 2024,
      semester: {
        'Semester 1': {
          npk: { waktu: 'Maret', jumlah: 200 },
          nitrogen: { waktu: '-', jumlah: 200 },
          pospat: { waktu: 'Maret', jumlah: 200 },
          kalium: { waktu: '-', jumlah: 200 },
          boron: { waktu: 'Maret', jumlah: 100 },
          magnesium: { waktu: '-', jumlah: 200 },
        },
        'Semester 2': {
          npk: { waktu: '-', jumlah: 0 },
          nitrogen: { waktu: '-', jumlah: 0 },
          pospat: { waktu: '-', jumlah: 0 },
          kalium: { waktu: '-', jumlah: 0 },
          boron: { waktu: '-', jumlah: 0 },
          magnesium: { waktu: '-', jumlah: 0 },
        },
      },
    },
  ],
};

const TraceabilityPupukDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  const [detail, setDetail] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editYearData, setEditYearData] = useState(null);

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PUPUK', href: '/traceability/gap/pupuk' },
    { label: 'DETAIL PUPUK' },
  ];

  useEffect(() => {
    setDetail(mockPupukDetail);
  }, [id]);

  const umurTanamanText = useMemo(() => {
    if (!detail?.kebun?.tahun_tanam) return '-';
    const currentYear = new Date().getFullYear();
    return `${currentYear - detail.kebun.tahun_tanam} Tahun`;
  }, [detail]);

  const handleEditYear = (yearData) => {
    setEditYearData(yearData);
    setIsEditOpen(true);
  };

  const handleDeleteYear = (yearData) => {
    console.log('Delete year data:', yearData);
    // In real implementation, show confirmation dialog and delete
  };

  const handleTambahTahun = () => {
    router.push(`/traceability/gap/pupuk/${id}/tambah-tahun-pupuk`);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <BreadcrumbDetail items={crumbs} />
        <Button
          variant="primary"
          size="medium"
          onClick={handleTambahTahun}
          className="whitespace-nowrap"
        >
          Tambah Tahun Pupuk
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {/* DETAIL KEBUN Card */}
        {detail?.kebun && (
          <section className="rounded border border-gray-300 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">DETAIL KEBUN</h3>
            </div>

            <div className="grid grid-cols-5 gap-x-6 gap-y-4 text-sm text-gray-700">
              <BorderBottomColData
                label="Id Kebun"
                value={detail.kebun.id_kebun ?? '-'}
              />
              <BorderBottomColData
                label="Petani"
                value={detail.kebun.petani ?? '-'}
              />
              <BorderBottomColData
                label="Kelompok Tani"
                value={detail.kebun.kelompok_tani ?? '-'}
              />
              <BorderBottomColData
                label="Luas Kebun (Ha)"
                value={detail.kebun.luas_kebun_ha ?? '-'}
              />
              <BorderBottomColData
                label="Tahun Tanam"
                value={detail.kebun.tahun_tanam ?? '-'}
              />
              <BorderBottomColData
                label="Umur Tanaman"
                value={detail.kebun.umur_tanaman ?? umurTanamanText}
              />
              <BorderBottomColData
                label="Jumlah Pokok"
                value={`${formatNumber(detail.kebun.jumlah_pokok)} Pohon`}
              />
              <BorderBottomColData
                label="Total Pupuk"
                value={`${formatNumber(detail.kebun.total_pupuk_kg)} Kg`}
              />
            </div>
          </section>
        )}

        {/* Tahun Sections */}
        {detail?.penggunaan_tahunan?.map((yearData) => (
          <YearCard
            key={yearData.tahun}
            yearData={yearData}
            onEdit={handleEditYear}
            onDelete={handleDeleteYear}
            title="Penggunaan Pupuk"
            dataFields={[
              { key: 'npk', label: '(NPK)', unit: 'Kg' },
              { key: 'nitrogen', label: '(Nitrogen)', unit: 'Kg' },
              { key: 'pospat', label: '(Pospat)', unit: 'Kg' },
              { key: 'kalium', label: '(Kalium)', unit: 'Kg' },
              { key: 'boron', label: '(Boron)', unit: 'Kg' },
              { key: 'magnesium', label: '(Magnesium)', unit: 'Kg' },
            ]}
          />
        ))}

        {/* Edit Modal */}
        <EditPupukModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          yearData={editYearData}
          onSave={(updatedSemesters) => {
            setDetail((prev) => {
              if (!prev) return prev;
              const updated = prev.penggunaan_tahunan.map((y) =>
                y.tahun === editYearData?.tahun
                  ? { ...y, semester: { ...updatedSemesters } }
                  : y
              );
              return { ...prev, penggunaan_tahunan: updated };
            });
            setIsEditOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default TraceabilityPupukDetail;
