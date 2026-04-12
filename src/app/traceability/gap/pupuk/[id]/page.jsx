'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import EditPupukModal from '@/components/molecules/EditPupukModal';
import SectionLoading from '@/components/molecules/SectionLoading';
import YearCard from '@/components/molecules/YearCard';
import { MONTH_OPTIONS } from '@/constants/months';
import {
  deletePupuk,
  getDetailPupukKebun,
  getListPupukKebun,
  updatePupuk,
} from '@/services/pupuk';

const formatNumber = (num) =>
  typeof num === 'number'
    ? num.toLocaleString('id-ID')
    : (Number(num) || 0).toLocaleString('id-ID');

// Convert month name to month number (1-12)
const monthNameToNumber = (monthName) => {
  const monthOption = MONTH_OPTIONS.find(
    (option) =>
      option.label.toLowerCase() === String(monthName || '').toLowerCase()
  );
  return monthOption?.value || 1;
};

const TraceabilityPupukDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editYearData, setEditYearData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [yearToDelete, setYearToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PUPUK', href: '/traceability/gap/pupuk' },
    { label: 'DETAIL PUPUK' },
  ];

  // Transform API pupuk usage data to expected format
  const transformPupukUsageData = (results) => {
    if (!results || !Array.isArray(results)) return [];

    // Group by year
    const yearMap = {};

    results.forEach((item) => {
      const tahun = item.tahun;
      if (!yearMap[tahun]) {
        yearMap[tahun] = {
          tahun,
          recordIds: [], // Store all record IDs for this year
          semester: {
            'Semester 1': {
              npk: { waktu: '-', jumlah: 0 },
              nitrogen: { waktu: '-', jumlah: 0 },
              pospat: { waktu: '-', jumlah: 0 },
              kalium: { waktu: '-', jumlah: 0 },
              boron: { waktu: '-', jumlah: 0 },
              magnesium: { waktu: '-', jumlah: 0 },
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
        };
      }

      // Map Semester 1 data
      if (item.s1_npk_waktu_label) {
        yearMap[tahun].semester['Semester 1'].npk.waktu =
          item.s1_npk_waktu_label;
      }
      if (item.s1_npk_jumlah) {
        yearMap[tahun].semester['Semester 1'].npk.jumlah = parseFloat(
          item.s1_npk_jumlah
        );
      }

      if (item.s1_natrium_waktu_label) {
        yearMap[tahun].semester['Semester 1'].nitrogen.waktu =
          item.s1_natrium_waktu_label;
      }
      if (item.s1_natrium_jumlah) {
        yearMap[tahun].semester['Semester 1'].nitrogen.jumlah = parseFloat(
          item.s1_natrium_jumlah
        );
      }

      if (item.s1_postat_waktu_label) {
        yearMap[tahun].semester['Semester 1'].pospat.waktu =
          item.s1_postat_waktu_label;
      }
      if (item.s1_postat_jumlah) {
        yearMap[tahun].semester['Semester 1'].pospat.jumlah = parseFloat(
          item.s1_postat_jumlah
        );
      }

      if (item.s1_kalium_waktu_label) {
        yearMap[tahun].semester['Semester 1'].kalium.waktu =
          item.s1_kalium_waktu_label;
      }
      if (item.s1_kalium_jumlah) {
        yearMap[tahun].semester['Semester 1'].kalium.jumlah = parseFloat(
          item.s1_kalium_jumlah
        );
      }

      if (item.s1_boron_waktu_label) {
        yearMap[tahun].semester['Semester 1'].boron.waktu =
          item.s1_boron_waktu_label;
      }
      if (item.s1_boron_jumlah) {
        yearMap[tahun].semester['Semester 1'].boron.jumlah = parseFloat(
          item.s1_boron_jumlah
        );
      }

      if (item.s1_magnesium_waktu_label) {
        yearMap[tahun].semester['Semester 1'].magnesium.waktu =
          item.s1_magnesium_waktu_label;
      }
      if (item.s1_magnesium_jumlah) {
        yearMap[tahun].semester['Semester 1'].magnesium.jumlah = parseFloat(
          item.s1_magnesium_jumlah
        );
      }

      // Map Semester 2 data
      if (item.s2_npk_waktu_label) {
        yearMap[tahun].semester['Semester 2'].npk.waktu =
          item.s2_npk_waktu_label;
      }
      if (item.s2_npk_jumlah) {
        yearMap[tahun].semester['Semester 2'].npk.jumlah = parseFloat(
          item.s2_npk_jumlah
        );
      }

      if (item.s2_natrium_waktu_label) {
        yearMap[tahun].semester['Semester 2'].nitrogen.waktu =
          item.s2_natrium_waktu_label;
      }
      if (item.s2_natrium_jumlah) {
        yearMap[tahun].semester['Semester 2'].nitrogen.jumlah = parseFloat(
          item.s2_natrium_jumlah
        );
      }

      if (item.s2_postat_waktu_label) {
        yearMap[tahun].semester['Semester 2'].pospat.waktu =
          item.s2_postat_waktu_label;
      }
      if (item.s2_postat_jumlah) {
        yearMap[tahun].semester['Semester 2'].pospat.jumlah = parseFloat(
          item.s2_postat_jumlah
        );
      }

      if (item.s2_kalium_waktu_label) {
        yearMap[tahun].semester['Semester 2'].kalium.waktu =
          item.s2_kalium_waktu_label;
      }
      if (item.s2_kalium_jumlah) {
        yearMap[tahun].semester['Semester 2'].kalium.jumlah = parseFloat(
          item.s2_kalium_jumlah
        );
      }

      if (item.s2_boron_waktu_label) {
        yearMap[tahun].semester['Semester 2'].boron.waktu =
          item.s2_boron_waktu_label;
      }
      if (item.s2_boron_jumlah) {
        yearMap[tahun].semester['Semester 2'].boron.jumlah = parseFloat(
          item.s2_boron_jumlah
        );
      }

      if (item.s2_magnesium_waktu_label) {
        yearMap[tahun].semester['Semester 2'].magnesium.waktu =
          item.s2_magnesium_waktu_label;
      }
      if (item.s2_magnesium_jumlah) {
        yearMap[tahun].semester['Semester 2'].magnesium.jumlah = parseFloat(
          item.s2_magnesium_jumlah
        );
      }

      // Store record ID for deletion
      if (item.id && !yearMap[tahun].recordIds.includes(item.id)) {
        yearMap[tahun].recordIds.push(item.id);
      }
    });

    // Convert to array and sort by year descending
    return Object.values(yearMap).sort((a, b) => b.tahun - a.tahun);
  };

  const umurTanamanText = useMemo(() => {
    if (!detail?.kebun?.tahun_tanam) return '-';
    const currentYear = new Date().getFullYear();
    return `${currentYear - detail.kebun.tahun_tanam} Tahun`;
  }, [detail]);

  const handleEditYear = (yearData) => {
    setEditYearData(yearData);
    setIsEditOpen(true);
  };

  const fetchDetail = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Fetch kebun details and pupuk usage list in parallel
      const [kebunResponse, pupukListResponse] = await Promise.all([
        getDetailPupukKebun(id),
        getListPupukKebun(id),
      ]);

      if (kebunResponse?.status === 200 && pupukListResponse?.status === 200) {
        const kebunData = kebunResponse?.data?.data;
        const pupukListData = pupukListResponse?.data?.data;

        // Transform kebun data
        const kebun = {
          id_kebun: kebunData?.id_kebun || '-',
          petani: kebunData?.nama_petani || '-',
          kelompok_tani: kebunData?.kelompok_tani || '-',
          luas_kebun_ha: kebunData?.luas_kebun
            ? parseFloat(kebunData.luas_kebun)
            : 0,
          tahun_tanam: kebunData?.tahun_tanam || '-',
          umur_tanaman: kebunData?.umur_tanaman
            ? `${kebunData.umur_tanaman} Tahun`
            : '-',
          jumlah_pokok: kebunData?.jumlah_pokok || 0,
          total_pupuk_kg: kebunData?.total_pupuk || 0,
        };

        // Transform pupuk usage data
        const penggunaan_tahunan = transformPupukUsageData(
          pupukListData?.results || []
        );

        setDetail({
          kebun,
          penggunaan_tahunan,
        });
      } else {
        toast.error('Gagal memuat data detail pupuk');
        setDetail(null);
      }
    } catch (error) {
      console.error('Error fetching pupuk detail:', error);
      toast.error(
        error?.response?.data?.message || 'Gagal memuat data detail pupuk'
      );
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleDeleteYear = (yearData) => {
    setYearToDelete(yearData);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (
      !yearToDelete ||
      !yearToDelete.recordIds ||
      yearToDelete.recordIds.length === 0
    ) {
      toast.error('Data tidak valid untuk dihapus');
      return;
    }

    setIsDeleting(true);
    try {
      // Delete all records for this year (in case there are multiple)
      const deletePromises = yearToDelete.recordIds.map((recordId) =>
        deletePupuk(recordId)
      );

      const responses = await Promise.all(deletePromises);

      // Check if all deletions were successful
      const allSuccess = responses.every(
        (response) =>
          response?.status === 200 ||
          response?.status === 204 ||
          response?.data?.status === 'success'
      );

      if (allSuccess) {
        toast.success('Data pupuk berhasil dihapus');
        setIsDeleteModalOpen(false);
        setYearToDelete(null);
        // Refresh the data
        await fetchDetail();
      } else {
        throw new Error('Gagal menghapus beberapa data');
      }
    } catch (error) {
      console.error('Error deleting pupuk:', error);
      toast.error(
        error?.response?.data?.message || 'Gagal menghapus data pupuk'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setYearToDelete(null);
  };

  const handleTambahTahun = () => {
    router.push(`/traceability/gap/pupuk/tambah?kebun=${id}`);
  };

  if (loading) {
    return <SectionLoading />;
  }

  if (!detail) {
    return (
      <div className="flex flex-col gap-8 w-full">
        <BreadcrumbDetail items={crumbs} />
        <div className="text-center py-8 text-gray-500">
          Data tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-[320px] max-w-full flex-col gap-6">
      <div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <BreadcrumbDetail items={crumbs} />
        <Button
          variant="primary"
          size="medium"
          onClick={handleTambahTahun}
          className="whitespace-nowrap text-xs sm:text-sm"
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

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 break-words text-sm text-gray-700 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
          onSave={async (updatedSemesters) => {
            if (
              !editYearData ||
              !editYearData.recordIds ||
              editYearData.recordIds.length === 0
            ) {
              toast.error('Data tidak valid untuk diupdate');
              return;
            }

            setIsUpdating(true);
            try {
              // Use the first record ID (typically there's one record per year)
              const recordId = editYearData.recordIds[0];

              // Map semester data to API request format
              const payload = {
                kebun: parseInt(id),
                tahun: editYearData.tahun,
                // Semester 1
                s1_npk_waktu_aplikasi: monthNameToNumber(
                  updatedSemesters['Semester 1']?.npk?.waktu
                ),
                s1_npk_jumlah: updatedSemesters['Semester 1']?.npk?.jumlah || 0,
                s1_natrium_waktu_aplikasi: monthNameToNumber(
                  updatedSemesters['Semester 1']?.nitrogen?.waktu
                ),
                s1_natrium_jumlah:
                  updatedSemesters['Semester 1']?.nitrogen?.jumlah || 0,
                s1_postat_waktu_aplikasi: monthNameToNumber(
                  updatedSemesters['Semester 1']?.pospat?.waktu
                ),
                s1_postat_jumlah:
                  updatedSemesters['Semester 1']?.pospat?.jumlah || 0,
                s1_kalium_waktu_aplikasi: monthNameToNumber(
                  updatedSemesters['Semester 1']?.kalium?.waktu
                ),
                s1_kalium_jumlah:
                  updatedSemesters['Semester 1']?.kalium?.jumlah || 0,
                s1_boron_waktu_aplikasi: monthNameToNumber(
                  updatedSemesters['Semester 1']?.boron?.waktu
                ),
                s1_boron_jumlah:
                  updatedSemesters['Semester 1']?.boron?.jumlah || 0,
                s1_magnesium_waktu_aplikasi: monthNameToNumber(
                  updatedSemesters['Semester 1']?.magnesium?.waktu
                ),
                s1_magnesium_jumlah:
                  updatedSemesters['Semester 1']?.magnesium?.jumlah || 0,
                // Semester 2
                s2_npk_waktu_aplikasi: monthNameToNumber(
                  updatedSemesters['Semester 2']?.npk?.waktu
                ),
                s2_npk_jumlah: updatedSemesters['Semester 2']?.npk?.jumlah || 0,
                s2_natrium_waktu_aplikasi: monthNameToNumber(
                  updatedSemesters['Semester 2']?.nitrogen?.waktu
                ),
                s2_natrium_jumlah:
                  updatedSemesters['Semester 2']?.nitrogen?.jumlah || 0,
                s2_postat_waktu_aplikasi: monthNameToNumber(
                  updatedSemesters['Semester 2']?.pospat?.waktu
                ),
                s2_postat_jumlah:
                  updatedSemesters['Semester 2']?.pospat?.jumlah || 0,
                s2_kalium_waktu_aplikasi: monthNameToNumber(
                  updatedSemesters['Semester 2']?.kalium?.waktu
                ),
                s2_kalium_jumlah:
                  updatedSemesters['Semester 2']?.kalium?.jumlah || 0,
                s2_boron_waktu_aplikasi: monthNameToNumber(
                  updatedSemesters['Semester 2']?.boron?.waktu
                ),
                s2_boron_jumlah:
                  updatedSemesters['Semester 2']?.boron?.jumlah || 0,
                s2_magnesium_waktu_aplikasi: monthNameToNumber(
                  updatedSemesters['Semester 2']?.magnesium?.waktu
                ),
                s2_magnesium_jumlah:
                  updatedSemesters['Semester 2']?.magnesium?.jumlah || 0,
              };

              const response = await updatePupuk(recordId, payload);

              if (
                response?.status === 200 ||
                response?.status === 201 ||
                response?.data?.status === 'success'
              ) {
                toast.success(
                  response?.data?.message || 'Data pupuk berhasil diupdate'
                );
                setIsEditOpen(false);
                // Refresh the data
                await fetchDetail();
              } else {
                toast.error('Gagal mengupdate data pupuk');
              }
            } catch (error) {
              console.error('Error updating pupuk:', error);
              toast.error(
                error?.response?.data?.message || 'Gagal mengupdate data pupuk'
              );
            } finally {
              setIsUpdating(false);
            }
          }}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          itemName={`data pupuk tahun ${yearToDelete?.tahun}`}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default TraceabilityPupukDetail;
