'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import EditWasteDataModal from '@/components/molecules/EditWasteDataModal';

const LB3DetailPage = ({ params }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [kebunData, setKebunData] = useState({});
  const [tahunData, setTahunData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTahun, setSelectedTahun] = useState(null);
  const [selectedWasteData, setSelectedWasteData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch LB3 detail data
  const fetchLB3Detail = useCallback(async (id) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data for demonstration
      const mockKebunData = {
        idKebun: 'GR-001-002-002',
        petani: 'Akeng Rupinus',
        kelompokTani: 'Bepekaek Besamo',
        luasKebun: '0.78',
        tahunTanam: '2002',
        umurTanaman: '21 Tahun',
        totalLb3: '3 Kg',
      };

      const mockTahunData = [
        {
          tahun: 2025,
          wasteData: [
            { type: 'Limbah Botol', quantity: '1 Kg' },
            { type: 'Limbah Jeriken', quantity: '1 Kg' },
            { type: 'Limbah Karung Pupuk', quantity: '1 Kg' },
          ],
        },
        {
          tahun: 2024,
          wasteData: [
            { type: 'Limbah Botol', quantity: '1 Kg' },
            { type: 'Limbah Jeriken', quantity: '1 Kg' },
            { type: 'Limbah Karung Pupuk', quantity: '1 Kg' },
          ],
        },
      ];

      // Mock response
      setKebunData(mockKebunData);
      setTahunData(mockTahunData);
    } catch (error) {
      console.error('Error fetching LB3 detail:', error);
      toast.error('Gagal memuat detail LB3');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (params?.id) {
      fetchLB3Detail(params.id);
    }
  }, [params?.id, fetchLB3Detail]);

  const handleTambahTahun = () => {
    router.push(`/traceability/gap/lb3/${params.id}/tambah-tahun-lb3`);
  };

  const handleEditTahun = (tahun) => {
    const tahunDataItem = tahunData.find((item) => item.tahun === tahun);
    if (tahunDataItem) {
      setSelectedTahun(tahun);
      setSelectedWasteData(tahunDataItem.wasteData);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTahun(null);
    setSelectedWasteData([]);
  };

  const handleSaveWasteData = (tahun, updatedWasteData) => {
    setIsSaving(true);
    try {
      // Update the tahunData state
      setTahunData((prevData) =>
        prevData.map((item) =>
          item.tahun === tahun ? { ...item, wasteData: updatedWasteData } : item
        )
      );

      toast.success(`Data tahun ${tahun} berhasil diperbarui`);
      handleCloseEditModal();
    } catch (error) {
      console.error('Error saving waste data:', error);
      toast.error('Gagal menyimpan data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTahun = (tahun) => {
    toast.info(`Hapus data tahun ${tahun} clicked`);
    // In real implementation, you would show confirmation dialog
    // and call delete API
  };

  const crumbs = [
    { label: 'LB3', href: '/traceability/gap/lb3' },
    { label: 'DETAIL LB3' },
  ];

  if (loading) {
    return (
      <div className="flex w-full flex-col gap-8">
        <BreadcrumbDetail items={crumbs} />
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Memuat detail LB3...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex items-center justify-between">
        <BreadcrumbDetail items={crumbs} />
        <Button
          onClick={handleTambahTahun}
          className="whitespace-nowrap text-xs sm:text-sm"
        >
          Tambah Tahun LB3
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {/* DETAIL KEBUN Section */}
        <section className="rounded border border-gray-300 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">DETAIL KEBUN</h3>
          </div>

          <div className="grid grid-cols-5 gap-x-6 gap-y-4 text-sm text-gray-700">
            <BorderBottomColData
              label="Id Kebun"
              value={kebunData.idKebun || '-'}
            />
            <BorderBottomColData
              label="Petani"
              value={kebunData.petani || '-'}
            />
            <BorderBottomColData
              label="Kelompok Tani"
              value={kebunData.kelompokTani || '-'}
            />
            <BorderBottomColData
              label="Luas Kebun (Ha)"
              value={kebunData.luasKebun || '-'}
            />
            <BorderBottomColData
              label="Tahun Tanam"
              value={kebunData.tahunTanam || '-'}
            />
            <BorderBottomColData
              label="Umur Tanaman"
              value={kebunData.umurTanaman || '-'}
            />
            <BorderBottomColData
              label="Total LB3"
              value={kebunData.totalLb3 || '-'}
            />
          </div>
        </section>

        {/* TAHUN Sections */}
        {tahunData.map((tahun, index) => (
          <section
            key={`tahun-${tahun.tahun}-${index}`}
            className="rounded border border-gray-300 bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">TAHUN {tahun.tahun}</h3>
              <div className="flex gap-4">
                <button
                  className="text-sm font-medium text-red-600 underline hover:text-red-800"
                  onClick={() => handleDeleteTahun(tahun.tahun)}
                >
                  Hapus
                </button>
                <button
                  className="text-sm font-medium text-blue-700 underline hover:text-blue-800"
                  onClick={() => handleEditTahun(tahun.tahun)}
                >
                  Ubah Data
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-x-6 gap-y-4 text-sm text-gray-700">
              {tahun.wasteData.map((waste, wasteIndex) => (
                <BorderBottomColData
                  key={`waste-${waste.type}-${wasteIndex}`}
                  label={waste.type}
                  value={waste.quantity}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Edit Modal */}
      <EditWasteDataModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveWasteData}
        tahun={selectedTahun}
        wasteData={selectedWasteData}
        isLoading={isSaving}
      />
    </div>
  );
};

LB3DetailPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default LB3DetailPage;
