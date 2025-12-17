'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import debounce from 'lodash/debounce';
import { DownloadCloudIcon } from 'lucide-react';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/molecules/Select';
import Pagination from '@/components/organisms/Pagination';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import {
  getListKebun,
  exportKebunToExcel,
  deleteKebun,
} from '@/services/pekebun';
import useReferences from '@/hooks/useReferences';
import convertCoordToDMS from '@/libs/utils/convertCoordToDMS';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// Helper function to format date as "Month, Year"
const formatWaktuTanam = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const month = date.toLocaleDateString('id-ID', { month: 'long' });
  const year = date.getFullYear();
  return `${month.charAt(0).toUpperCase() + month.slice(1)}, ${year}`;
};

// Helper function to format date as "HH:mm DD-MM-YYYY"
const formatLastModified = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}-${month}-${year}`;
};

const rspoOptions = [
  { label: 'Sudah', value: 'sudah' },
  { label: 'Belum', value: 'belum' },
];

const ispoOptions = [
  { label: 'Sudah', value: 'sudah' },
  { label: 'Belum', value: 'belum' },
];

const KebunPage = () => {
  const router = useRouter();
  const { kelompokTani, fetchKelompokTani } = useReferences();
  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState(null);
  const [selectedRSPO, setSelectedRSPO] = useState(null);
  const [selectedISPO, setSelectedISPO] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [kebunData, setKebunData] = useState([]);
  const [totalKebun, setTotalKebun] = useState(0);
  const [showModalConfirmDeleteKebun, setShowModalConfirmDeleteKebun] =
    useState(false);
  const [selectedKebunToDelete, setSelectedKebunToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchKelompokTani();
  }, [fetchKelompokTani]);

  const kelompokOptions = useMemo(() => {
    return (
      kelompokTani?.map((item) => ({
        label: item.label,
        value: item.value,
      })) || []
    );
  }, [kelompokTani]);

  // Fetch kebun data function
  const fetchKebunData = async ({
    page,
    page_size,
    search,
    kelompok,
    rspo,
    ispo,
  }) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page,
        page_size,
      });

      if (search) params.append('search', search);
      if (kelompok) params.append('kelompok_tani', kelompok);
      if (rspo) params.append('rspo', rspo === 'sudah' ? 'true' : 'false');
      if (ispo) params.append('ispo', ispo === 'sudah' ? 'true' : 'false');

      const response = await getListKebun(params.toString());

      if (response?.data?.status === 'success') {
        // Map API response to table format
        const mappedData = response.data.data.results.map((kebun) => {
          // Format coordinates
          let titikKoordinat = '-';
          if (
            kebun.titik_koordinat?.coordinates &&
            Array.isArray(kebun.titik_koordinat.coordinates)
          ) {
            const [lng, lat] = kebun.titik_koordinat.coordinates;
            titikKoordinat = convertCoordToDMS(lat, lng);
          }

          return {
            id: kebun.id,
            titik_koordinat: titikKoordinat,
            id_kebun: kebun.id_kebun || '-',
            nama_petani: kebun.nama_petani || '-',
            kelompok: kebun.kelompok_tani || '-',
            lokasi: kebun.lokasi_kebun || '-',
            luas_kebun: kebun.luas_kebun || 0,
            waktu_tanam: formatWaktuTanam(kebun.waktu_tanam),
            rspo: kebun.is_rspo ? 'Sudah' : 'Belum',
            ispo: kebun.is_ispo ? 'Sudah' : 'Belum',
            legalitas: kebun.jenis_legalitas_label || '-',
            no_legalitas: kebun.nomor_legalitas || '-',
            pemilik_legalitas: kebun.pemilik_legalitas || '-',
            stdb: kebun.nomor_stdb || '-',
            terakhir_diubah: formatLastModified(kebun.updated_at),
          };
        });

        setKebunData(mappedData);
        setTotalKebun(response.data.data.count);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching kebun data:', error);
      toast.error('Gagal memuat data kebun');
      setKebunData([]);
      setTotalKebun(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKebunData({
      page: currentPage,
      page_size: pageSize,
      search,
      kelompok: selectedKelompok,
      rspo: selectedRSPO,
      ispo: selectedISPO,
    });
  }, [
    currentPage,
    pageSize,
    search,
    selectedKelompok,
    selectedRSPO,
    selectedISPO,
  ]);

  const handleSearchTextChange = useCallback(
    debounce((e) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleKelompokChange = (e) => {
    setSelectedKelompok(e.target.value);
    setCurrentPage(1);
  };

  const handleRSPOChange = (e) => {
    setSelectedRSPO(e.target.value);
    setCurrentPage(1);
  };

  const handleISPOChange = (e) => {
    setSelectedISPO(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleExportExcel = async () => {
    try {
      setLoading(true);

      // Build query parameters (same as fetchKebunData but without page/page_size)
      const params = new URLSearchParams();

      if (search) params.append('search', search);
      if (selectedKelompok) params.append('kelompok_tani', selectedKelompok);
      if (selectedRSPO)
        params.append('rspo', selectedRSPO === 'sudah' ? 'true' : 'false');
      if (selectedISPO)
        params.append('ispo', selectedISPO === 'sudah' ? 'true' : 'false');

      const response = await exportKebunToExcel(params.toString());

      // Create blob and download
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `kebun_${new Date().toISOString().split('T')[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Data berhasil diekspor ke Excel');
    } catch (error) {
      console.error('Error exporting kebun data:', error);
      toast.error(error?.response?.data?.message || 'Gagal mengekspor data');
    } finally {
      setLoading(false);
    }
  };

  const handleLihatClicked = (data) => {
    router.push(`/traceability/kebun/${data?.id}/detail`);
  };

  const handleDeleteClicked = (data) => {
    setSelectedKebunToDelete(data);
    setShowModalConfirmDeleteKebun(true);
  };

  const handleDeleteKebun = async () => {
    if (!selectedKebunToDelete?.id) {
      toast.error('ID kebun tidak ditemukan');
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteKebun(selectedKebunToDelete.id);
      if (
        res?.data?.status === 'success' ||
        res?.status === 200 ||
        res?.status === 204
      ) {
        toast.success('Data kebun berhasil dihapus');
        setShowModalConfirmDeleteKebun(false);
        setSelectedKebunToDelete(null);
        fetchKebunData({
          page: currentPage,
          page_size: pageSize,
          search,
          kelompok: selectedKelompok,
          rspo: selectedRSPO,
          ispo: selectedISPO,
        });
      } else {
        toast.error(res?.data?.message || 'Data kebun gagal dihapus');
      }
    } catch (error) {
      console.error('Error deleting kebun:', error);
      toast.error(error?.response?.data?.message || 'Data kebun gagal dihapus');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowModalConfirmDeleteKebun(false);
    setSelectedKebunToDelete(null);
  };

  const ActionsCellRenderer = useCallback((e) => {
    return (
      <div className="flex h-full w-full flex-row items-center justify-center gap-1 sm:gap-2">
        <div
          className="cursor-pointer text-[10px] font-bold uppercase text-primary underline hover:text-primary/80 sm:text-[12px]"
          onClick={() => handleLihatClicked(e.data)}
        >
          LIHAT
        </div>
        <div className="text-gray-400">|</div>
        <div
          className="cursor-pointer text-[10px] font-bold uppercase text-red-600 underline hover:text-red-700 sm:text-[12px]"
          onClick={() => handleDeleteClicked(e.data)}
        >
          HAPUS
        </div>
      </div>
    );
  }, []);

  const StatusCellRenderer = useCallback((params) => {
    const status = params.value;
    const isSuccess = status === 'Sudah';

    return (
      <span
        className={`text-xs font-medium ${
          isSuccess ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {status}
      </span>
    );
  }, []);

  const colDefs = useMemo(
    () => [
      {
        field: 'actions',
        headerName: '',
        cellRenderer: ActionsCellRenderer,
        width: 120,
        minWidth: 100,
        maxWidth: 150,
        suppressSizeToFit: false,
        pinned: 'left',
      },
      {
        field: 'titik_koordinat',
        headerName: 'Titik Koordinat',
        flex: 1,
        minWidth: 180,
      },
      {
        field: 'id_kebun',
        headerName: 'Id Kebun',
        flex: 1,
        minWidth: 164,
      },
      {
        field: 'nama_petani',
        headerName: 'Petani',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'kelompok',
        headerName: 'Kelompok',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'lokasi',
        headerName: 'Lokasi',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'luas_kebun',
        headerName: 'Luas Kebun (Ha)',
        flex: 1,
        minWidth: 120,
        cellRenderer: (params) => {
          return params.value ? params.value.toLocaleString('id-ID') : '-';
        },
      },
      {
        field: 'waktu_tanam',
        headerName: 'Waktu Tanam',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'rspo',
        headerName: 'RSPO',
        flex: 0.8,
        minWidth: 100,
        cellRenderer: StatusCellRenderer,
      },
      {
        field: 'ispo',
        headerName: 'ISPO',
        flex: 0.8,
        minWidth: 100,
        cellRenderer: StatusCellRenderer,
      },
      {
        field: 'legalitas',
        headerName: 'Legalitas',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'no_legalitas',
        headerName: 'No Legalitas',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'pemilik_legalitas',
        headerName: 'Pemilik Legalitas',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'stdb',
        headerName: 'STDB',
        flex: 1,
        minWidth: 156,
      },
      {
        field: 'terakhir_diubah',
        headerName: 'Terakhir Diubah',
        flex: 1,
        minWidth: 160,
      },
    ],
    [ActionsCellRenderer, StatusCellRenderer]
  );

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 py-3 sm:gap-4 sm:py-4">
          {/* === HEADER === */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <Heading
              className=" flex flex-1 uppercase tracking-[2px]"
              level={3}
            >
              DATA KEBUN
            </Heading>

            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              {/* === SEARCH FILTER === */}
              <div className="grid w-full grid-cols-1 items-center gap-2 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-row">
                <SearchBar
                  onChange={handleSearchTextChange}
                  onClear={() => setSearch('')}
                  placeholder="Cari..."
                  className="w-full sm:w-auto lg:w-[200px]"
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[150px]"
                  placeholder="Kelompok"
                  options={kelompokOptions}
                  value={selectedKelompok}
                  onChange={handleKelompokChange}
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[120px]"
                  placeholder="RSPO"
                  options={rspoOptions}
                  value={selectedRSPO}
                  onChange={handleRSPOChange}
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[120px]"
                  placeholder="ISPO"
                  options={ispoOptions}
                  value={selectedISPO}
                  onChange={handleISPOChange}
                />
              </div>

              {/* === ACTION BUTTON === */}
              <div className="flex flex-row items-center justify-end gap-2">
                <Button
                  className="!px-2 sm:!px-3"
                  icon={<DownloadCloudIcon size={18} />}
                  title="Export Excel"
                  onClick={handleExportExcel}
                />
                <Button
                  onClick={() => router.push('/traceability/kebun/tambah')}
                  className="whitespace-nowrap text-xs sm:text-sm"
                >
                  Tambah Kebun
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* === TABLE CONTAINER === */}
        <div className="relative w-full flex-1">
          <AgGridReact
            loading={loading}
            overlayLoadingTemplate="."
            autoSizeStrategy={autoSizeStrategy}
            rowData={kebunData}
            columnDefs={colDefs}
          />
        </div>

        <div className="flex justify-center sm:justify-end">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalKebun}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showRowsPerPage={true}
            labels={{
              rowsPerPage: 'Baris Per Halaman',
              showing: 'Menampilkan',
              of: 'dari',
            }}
            className="text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showModalConfirmDeleteKebun}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteKebun}
        title="HAPUS DATA KEBUN"
        itemName={selectedKebunToDelete?.id_kebun || 'kebun'}
        message={`Apakah Anda yakin ingin menghapus data kebun dengan ID ${selectedKebunToDelete?.id_kebun}?`}
        confirmText="Ya, Hapus"
        cancelText="Batalkan"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default KebunPage;
