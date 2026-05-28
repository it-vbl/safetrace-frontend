'use client';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import EditWasteDataModal from '@/components/molecules/EditWasteDataModal';
import {
  deleteLB3,
  getDetailLB3Kebun,
  getListLB3Kebun,
  updateLB3,
} from '@/services/lb3';
import { getCurrentUserRoles, isViewOnlyRole } from '@/libs/permissions';

const LB3DetailPage = () => {
  const router = useRouter();
  const params = useParams();

  // Determine if the current user is view-only (Disbunak Kalbar / Disbunak Sekadau)
  const isViewOnly = isViewOnlyRole(getCurrentUserRoles());

  const [loading, setLoading] = useState(true);
  const [kebunData, setKebunData] = useState({});
  const [tahunData, setTahunData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTahun, setSelectedTahun] = useState(null);
  const [selectedWasteData, setSelectedWasteData] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Transform waste data from API to component format
  const transformWasteData = useCallback((item) => {
    const wasteData = [];

    // Always include all three waste types, even if value is 0
    wasteData.push({
      type: 'Limbah Botol',
      quantity: `${item?.limbah_bobot || 0} Kg`,
    });

    wasteData.push({
      type: 'Limbah Jeriken',
      quantity: `${item?.limbah_jeriken || 0} Kg`,
    });

    wasteData.push({
      type: 'Limbah Karung Pupuk',
      quantity: `${item?.limbah_karung_pupuk || 0} Kg`,
    });

    return wasteData;
  }, []);

  // Fetch LB3 detail data
  const fetchLB3Detail = useCallback(async (id) => {
    setLoading(true);
    try {
      // Fetch kebun details and LB3 list in parallel
      const [kebunResponse, lb3ListResponse] = await Promise.all([
        getDetailLB3Kebun(id),
        getListLB3Kebun(id),
      ]);

      if (kebunResponse?.status === 200 && lb3ListResponse?.status === 200) {
        const kebunDataApi = kebunResponse?.data?.data;
        const lb3ListData = lb3ListResponse?.data?.data;

        // Transform kebun data
        const kebun = {
          idKebun: kebunDataApi?.id_kebun || '-',
          petani: kebunDataApi?.nama_petani || '-',
          kelompokTani: kebunDataApi?.kelompok_tani || '-',
          luasKebun: kebunDataApi?.luas_kebun || '-',
          tahunTanam: kebunDataApi?.tahun_tanam || '-',
          umurTanaman: kebunDataApi?.umur_tanaman
            ? `${kebunDataApi.umur_tanaman} Tahun`
            : '-',
          totalLb3: kebunDataApi?.total_lb3
            ? `${kebunDataApi.total_lb3} Kg`
            : '-',
        };

        // Transform LB3 list data to tahunData format
        const tahunDataTransformed = (lb3ListData?.results || [])
          .map((item) => ({
            id: item?.id,
            tahun: item?.tahun,
            wasteData: transformWasteData(item),
          }))
          .sort((a, b) => b.tahun - a.tahun); // Sort by year descending

        setKebunData(kebun);
        setTahunData(tahunDataTransformed);
      } else {
        toast.error('Gagal memuat detail LB3');
        setKebunData({});
        setTahunData([]);
      }
    } catch (error) {
      console.error('Error fetching LB3 detail:', error);
      toast.error(
        error?.response?.data?.message || 'Gagal memuat detail LB3'
      );
      setKebunData({});
      setTahunData([]);
    } finally {
      setLoading(false);
    }
  }, [transformWasteData]);

  useEffect(() => {
    if (params?.id) {
      fetchLB3Detail(params.id);
    }
  }, [params?.id, fetchLB3Detail]);

  const handleTambahTahun = () => {
    router.push(`/traceability/gap/lb3/tambah?kebun=${params.id}`);
  };

  const handleEditTahun = (tahun) => {
    const tahunDataItem = tahunData.find((item) => item.tahun === tahun);
    if (tahunDataItem) {
      setSelectedTahun(tahun);
      setSelectedWasteData(tahunDataItem.wasteData);
      setSelectedItemId(tahunDataItem.id);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTahun(null);
    setSelectedWasteData([]);
    setSelectedItemId(null);
  };

  const handleSaveWasteData = async (tahun, updatedWasteData) => {
    if (!selectedItemId) {
      toast.error('Data tidak valid untuk diperbarui');
      return;
    }

    setIsSaving(true);
    try {
      // Map waste data from component format to API format
      const limbahBotol = updatedWasteData.find(
        (w) => w.type === 'Limbah Botol'
      );
      const limbahJeriken = updatedWasteData.find(
        (w) => w.type === 'Limbah Jeriken'
      );
      const limbahKarungPupuk = updatedWasteData.find(
        (w) => w.type === 'Limbah Karung Pupuk'
      );

      // Extract numeric values from "X Kg" format
      const extractNumericValue = (quantity) => {
        if (!quantity) return 0;
        const numericStr = quantity.toString().replace(' Kg', '').trim();
        return parseInt(numericStr) || 0;
      };

      const payload = {
        kebun: parseInt(params.id),
        tahun: parseInt(tahun),
        limbah_bobot: extractNumericValue(limbahBotol?.quantity || '0'),
        limbah_jeriken: extractNumericValue(limbahJeriken?.quantity || '0'),
        limbah_karung_pupuk: extractNumericValue(
          limbahKarungPupuk?.quantity || '0'
        ),
      };

      const response = await updateLB3(selectedItemId, payload);

      if (response?.status === 200 || response?.status === 201) {
        toast.success(
          response?.data?.message ||
          `Data tahun ${tahun} berhasil diperbarui`
        );
        handleCloseEditModal();
        // Refresh the data
        await fetchLB3Detail(params.id);
      } else {
        toast.error('Gagal memperbarui data');
      }
    } catch (error) {
      console.error('Error saving waste data:', error);
      toast.error(
        error?.response?.data?.message || 'Gagal memperbarui data'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTahun = (tahun) => {
    const tahunDataItem = tahunData.find((item) => item.tahun === tahun);
    if (tahunDataItem) {
      setItemToDelete(tahunDataItem);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !itemToDelete.id) {
      toast.error('Data tidak valid untuk dihapus');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteLB3(itemToDelete.id);

      if (
        response?.status === 200 ||
        response?.status === 204 ||
        response?.data?.status === 'success'
      ) {
        toast.success(
          response?.data?.message || 'Data LB3 berhasil dihapus'
        );
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        // Refresh the data
        await fetchLB3Detail(params.id);
      } else {
        throw new Error('Gagal menghapus data');
      }
    } catch (error) {
      console.error('Error deleting LB3:', error);
      toast.error(
        error?.response?.data?.message || 'Gagal menghapus data LB3'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const crumbs = [
    { label: 'HOME', href: '/' },
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
    <div className="flex w-full min-w-[320px] max-w-full flex-col gap-6">
      <div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <BreadcrumbDetail items={crumbs} />
        {!isViewOnly && (
          <Button
            onClick={handleTambahTahun}
            className="whitespace-nowrap text-xs sm:text-sm"
          >
            Tambah Tahun LB3
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {/* DETAIL KEBUN Section */}
        <section className="rounded border border-gray-300 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">DETAIL KEBUN</h3>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-4 break-words text-sm text-gray-700 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
            <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h3 className="text-lg font-semibold">TAHUN {tahun.tahun}</h3>
              {!isViewOnly && (
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
              )}
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 break-words text-sm text-gray-700 sm:grid-cols-3">
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={`data tahun ${itemToDelete?.tahun}`}
        isLoading={isDeleting}
      />
    </div>
  );
};

LB3DetailPage.propTypes = {};

export default LB3DetailPage;
