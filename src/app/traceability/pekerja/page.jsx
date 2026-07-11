'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';
import { DownloadCloudIcon } from 'lucide-react';
import moment from 'moment/moment';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import DeleteConfirmationWithInputModal from '@/components/molecules/DeleteConfirmationWithInputModal';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/molecules/Select';
import StatCard from '@/components/molecules/StatCard';
import Pagination from '@/components/organisms/Pagination';
import useReferences from '@/hooks/useReferences';
import { getCurrentUserRoles, hasPermission,isViewOnlyRole } from '@/libs/permissions';
import { deletePekerja, downloadListPekerja, getListPekerja, getStatistikPekerja } from '@/services/pekerja';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const PekerjaPage = () => {
  const router = useRouter();
  const { kelompokTani, fetchKelompokTani } = useReferences();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if the current user is view-only (Disbunak Kalbar / Disbunak Sekadau)
  const isViewOnly = mounted ? isViewOnlyRole(getCurrentUserRoles()) : false;
  const canDownload = mounted ? hasPermission(getCurrentUserRoles(), 'pekerja.download') : false;

  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [pekerjaData, setPekerjaData] = useState([]);
  const [totalPekerja, setTotalPekerja] = useState(0);

  const [statistik, setStatistik] = useState({
    total_pekerja: 0,
    total_pekerja_pria: 0,
    total_pekerja_wanita: 0,
    total_status_pekerja_keluarga: 0,
    total_status_pekerja_buruh_tetap: 0,
    total_status_pekerja_buruh_harian_lepas: 0,
  });

  const [showModalConfirmDeletePekerja, setShowModalConfirmDeletePekerja] = useState(false);
  const [selectedPekerjaToDelete, setSelectedPekerjaToDelete] = useState(null);

  // Fetch pekerja data function
  const fetchPekerjaData = async ({ page, page_size, search, kelompok }) => {
    setLoading(true);
    try {
      const params = {
        page,
        page_size,
        ...(search && { search }),
        ...(kelompok && { kelompok_tani: kelompok }),
      };

      const response = await getListPekerja(params);

      if (response?.status === 200) {
        const data = response?.data?.data;
        const results = data?.results || [];

        const mappedData = results.map((pekerja) => ({
          id: pekerja.id,
          petani_id: pekerja.petani_id,
          pemilik_kebun: pekerja.pemilik_kebun || '-',
          kelompok: pekerja.kelompok_tani || '-',
          nama_pekerja: pekerja.nama_pekerja || '-',
          jenis_kelamin: pekerja.jenis_kelamin_label || '-',
          no_ktp: pekerja.no_ktp || '-',
          no_kk: pekerja.no_kk || '-',
          umur: pekerja.umur ? `${pekerja.umur} Tahun` : '-',
          status: pekerja.status_pekerja_label || '-',
        }));

        setPekerjaData(mappedData);
        setTotalPekerja(data.count || 0);
      } else {
        setPekerjaData([]);
        setTotalPekerja(0);
      }
    } catch (error) {
      console.error('Error fetching pekerja data:', error);
      toast.error('Gagal memuat data pekerja');
      setPekerjaData([]);
      setTotalPekerja(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch worker statistics function
  const fetchStatistikData = async (params = {}) => {
    try {
      const response = await getStatistikPekerja(params);
      if (response?.data?.status === 'success') {
        const data = response.data.data;
        setStatistik({
          total_pekerja: data?.total_pekerja || 0,
          total_pekerja_pria: data?.total_pekerja_pria || 0,
          total_pekerja_wanita: data?.total_pekerja_wanita || 0,
          total_status_pekerja_keluarga: data?.total_status_pekerja_keluarga || 0,
          total_status_pekerja_buruh_tetap: data?.total_status_pekerja_buruh_tetap || 0,
          total_status_pekerja_buruh_harian_lepas: data?.total_status_pekerja_buruh_harian_lepas || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching pekerja statistik:', error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const params = {
        ...(search && { search }),
        ...(selectedKelompok && { kelompok_tani: selectedKelompok }),
      };

      const response = await downloadListPekerja(params);
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'text/csv' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `data-pekerja-${moment().format('YYYY-MM-DD-HH-mm')}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      toast.error('Gagal mengunduh data');
    }
  };

  useEffect(() => {
    if (kelompokTani.length === 0) {
      fetchKelompokTani();
    }
  }, [kelompokTani.length, fetchKelompokTani]);

  // Auto-apply kelompok tani filter based on logged-in user
  const [isKetuaKelompokTani, setIsKetuaKelompokTani] = useState(false);
  const [isKelompokFilterInitialized, setIsKelompokFilterInitialized] =
    useState(false);

  useEffect(() => {
    const ketuaKelompokTani = Cookies.get('ketua_kelompok_tani');
    if (ketuaKelompokTani && kelompokTani && kelompokTani.length > 0) {
      const kelompokOption = kelompokTani.find(
        (kelompok) => kelompok.label === ketuaKelompokTani
      );
      if (kelompokOption) {
        setSelectedKelompok(kelompokOption.value);
        setIsKetuaKelompokTani(true);
        setTimeout(() => setIsKelompokFilterInitialized(true), 100);
      } else {
        setIsKelompokFilterInitialized(true);
      }
    } else {
      setIsKelompokFilterInitialized(true);
    }
  }, [kelompokTani]);

  // Fetch pekerja data when filters change
  useEffect(() => {
    if (isKelompokFilterInitialized) {
      fetchPekerjaData({
        page: currentPage,
        page_size: pageSize,
        search,
        kelompok: selectedKelompok,
      });
    }
  }, [
    isKelompokFilterInitialized,
    currentPage,
    pageSize,
    search,
    selectedKelompok,
  ]);

  // Fetch statistics when search or kelompok changes
  useEffect(() => {
    if (isKelompokFilterInitialized) {
      fetchStatistikData({
        ...(search && { search }),
        ...(selectedKelompok && { kelompok_tani: selectedKelompok }),
      });
    }
  }, [isKelompokFilterInitialized, search, selectedKelompok]);

  const debouncedSearch = useMemo(
    () =>
      debounce((val) => {
        setSearch(val);
        setCurrentPage(1);
      }, 300),
    []
  );

  const handleSearchTextChange = useCallback(
    (e) => {
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const handleKelompokChange = (e) => {
    setSelectedKelompok(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleLihatClicked = useCallback((data) => {
    router.push(`/traceability/pekerja/${data?.petani_id}`);
  }, [router]);

  const handleDeleteClicked = useCallback((data) => {
    setSelectedPekerjaToDelete(data);
    setShowModalConfirmDeletePekerja(true);
  }, []);

  const handleDeletePekerja = async () => {
    if (!selectedPekerjaToDelete?.id) {
      toast.error('ID pekerja tidak ditemukan');
      return;
    }

    setLoading(true);
    try {
      const res = await deletePekerja(selectedPekerjaToDelete.id);
      if (
        res?.data?.status === 'success' ||
        res?.status === 200 ||
        res?.status === 204
      ) {
        toast.success('Data pekerja berhasil dihapus');
        setShowModalConfirmDeletePekerja(false);
        fetchPekerjaData({
          page: currentPage,
          page_size: pageSize,
          search,
          kelompok: selectedKelompok,
        });
        fetchStatistikData({
          ...(search && { search }),
          ...(selectedKelompok && { kelompok_tani: selectedKelompok }),
        });
      } else {
        toast.error(res?.data?.message || 'Data pekerja gagal dihapus');
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Data pekerja gagal dihapus'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowModalConfirmDeletePekerja(false);
    setSelectedPekerjaToDelete(null);
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
        {!isViewOnly && (
          <div
            className="cursor-pointer text-[10px] font-bold uppercase text-tertiary underline hover:text-tertiary sm:text-[12px]"
            onClick={() => handleDeleteClicked(e.data)}
          >
            HAPUS
          </div>
        )}
      </div>
    );
  }, [handleLihatClicked, handleDeleteClicked, isViewOnly]);

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
        field: 'pemilik_kebun',
        headerName: 'Pemilik Kebun',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'kelompok',
        headerName: 'Kelompok',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'nama_pekerja',
        headerName: 'Nama Pekerja',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'jenis_kelamin',
        headerName: 'Jenis Kelamin',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'no_ktp',
        headerName: 'No. KTP',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'no_kk',
        headerName: 'No. KK',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'umur',
        headerName: 'Umur',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'status',
        headerName: 'Status Pekerja',
        flex: 1,
        minWidth: 160,
      },
    ],
    [ActionsCellRenderer]
  );

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      minWidth: 100,
      wrapText: true,
      autoHeight: true,
    }),
    []
  );

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          {/* === HEADER === */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <Heading
              className=" flex flex-1 uppercase tracking-[2px]"
              level={3}
            >
              PEKERJA
            </Heading>

            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              {/* === SEARCH FILTER === */}
              <div className="grid w-full grid-cols-1 items-center gap-2 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-row">
                <SearchBar
                  onChange={handleSearchTextChange}
                  placeholder="Cari..."
                  className="w-full sm:w-auto lg:w-[200px]"
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[150px]"
                  placeholder="Pemilik Kebun"
                  options={[
                    { label: 'Pemilik Kebun 1', value: '1' },
                    { label: 'Pemilik Kebun 2', value: '2' },
                  ]}
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[150px]"
                  placeholder="Kelompok"
                  options={kelompokTani}
                  value={selectedKelompok}
                  onChange={handleKelompokChange}
                  disabled={isKetuaKelompokTani}
                />
              </div>

              {/* === ACTION BUTTON === */}
              <div className="flex flex-row items-center justify-end gap-2">
                {canDownload && (
                  <Button
                    className="!px-2 sm:!px-3"
                    icon={<DownloadCloudIcon size={18} />}
                    title="Export Excel"
                    onClick={handleExportExcel}
                  />
                )}

                {!isViewOnly && (
                  <Button
                    onClick={() => router.push('/traceability/pekerja/tambah')}
                    className="whitespace-nowrap text-xs sm:text-sm flex-[2] sm:flex-none justify-center"
                  >
                    Tambah Pekerja
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 p-3 sm:p-4 !pt-0">
          <StatCard
            title="Total Pekerja"
            value={statistik.total_pekerja}
            isActive={false}
            onClick={() => { }}
          />
          <StatCard
            title="Laki - Laki"
            value={statistik.total_pekerja_pria}
            isActive={false}
            onClick={() => { }}
          />
          <StatCard
            title="Perempuan"
            value={statistik.total_pekerja_wanita}
            isActive={false}
            onClick={() => { }}
          />
          <StatCard
            title="Keluarga"
            value={statistik.total_status_pekerja_keluarga}
            isActive={false}
            onClick={() => { }}
          />
          <StatCard
            title="Buruh Tetap"
            value={statistik.total_status_pekerja_buruh_tetap}
            isActive={false}
            onClick={() => { }}
          />
          <StatCard
            title="Buruh Lepas"
            value={statistik.total_status_pekerja_buruh_harian_lepas}
            isActive={false}
            onClick={() => { }}
          />
        </div>

        {/* === TABLE CONTAINER === */}
        <div className="relative w-full flex-1 min-h-[400px]">
          <AgGridReact
            loading={loading}
            overlayLoadingTemplate="."
            autoSizeStrategy={autoSizeStrategy}
            defaultColDef={defaultColDef}
            rowData={pekerjaData}
            columnDefs={colDefs}
          />
        </div>

        <div className="flex justify-center sm:justify-end">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalPekerja}
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

      <DeleteConfirmationWithInputModal
        isOpen={showModalConfirmDeletePekerja}
        onClose={handleDeleteCancel}
        onConfirm={handleDeletePekerja}
        itemName={`pekerja dengan nama ${selectedPekerjaToDelete?.nama_pekerja}`}
        expectedInput={selectedPekerjaToDelete?.nama_pekerja || ''}
        isLoading={loading}
      />
    </div>
  );
};

export default PekerjaPage;
