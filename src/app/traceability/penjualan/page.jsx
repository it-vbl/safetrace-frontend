'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';
import { DownloadCloudIcon } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import DateRange from '@/components/molecules/DateRange';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import Select from '@/components/molecules/Select';
import Pagination from '@/components/organisms/Pagination';
import { getCurrentUserRoles, isViewOnlyRole } from '@/libs/permissions';

import useReferences from '../../../hooks/useReferences';
import {
  deletePenjualanAngkutan,
  exportPenjualanAngkutanToCSV,
  getListPabrik,
  getListPenjualanAngkutan,
} from '../../../services/penjualan';

ModuleRegistry.registerModules([AllCommunityModule]);

const PenjualanPage = () => {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if the current user is view-only (Disbunak Kalbar / Disbunak Sekadau)
  const isViewOnly = mounted ? isViewOnlyRole(getCurrentUserRoles()) : false;

  const { kelompokTani, fetchKelompokTani } = useReferences();
  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState(null);
  const [selectedPabrik, setSelectedPabrik] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [penjualanData, setPenjualanData] = useState([]);
  const [totalPenjualan, setTotalPenjualan] = useState(0);

  const [showModalConfirmDeletePenjualan, setShowModalConfirmDeletePenjualan] =
    useState(false);
  const [selectedPenjualanToDelete, setSelectedPenjualanToDelete] =
    useState(null);
  const [pabrikOptions, setPabrikOptions] = useState([]);

  useEffect(() => {
    fetchKelompokTani();
    fetchPabrikOptions();
  }, [fetchKelompokTani]);

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

  const fetchPabrikOptions = async () => {
    try {
      const response = await getListPabrik();
      if (
        response?.status === 200 &&
        (response?.data?.status === 'success' || response?.data?.data)
      ) {
        const data =
          response?.data?.data?.results || response?.data?.results || [];
        const options = data.map((pabrik) => ({
          label: pabrik.nama,
          value: pabrik.id?.toString(),
        }));
        setPabrikOptions(options);
      }
    } catch (error) {
      console.error('Error fetching pabrik options:', error);
      setPabrikOptions([]);
    }
  };

  const kelompokOptions = useMemo(() => {
    return (
      kelompokTani?.map((item) => ({
        label: item.label,
        value: item.value,
      })) || []
    );
  }, [kelompokTani]);

  const fetchPenjualanData = async ({
    page,
    page_size,
    search,
    kelompok_tani,
    pabrik,
    start_date,
    end_date,
  }) => {
    setLoading(true);
    try {
      const params = {
        page,
        page_size,
        ...(search && { search }),
        ...(kelompok_tani && { kelompok_tani }),
        ...(pabrik && { pabrik }),
        ...(start_date && { start_date }),
        ...(end_date && { end_date }),
      };

      const response = await getListPenjualanAngkutan(params);

      if (
        response?.status === 200 &&
        (response?.data?.status === 'success' || response?.data?.data)
      ) {
        const data = response?.data?.data;
        const results = data?.results || [];

        const mapped = results.map((item) => ({
          id: item?.id,
          id_penjualan: item?.id_penjualan || '-',
          tanggal_penjualan: item?.tanggal_penjualan
            ? moment(item.tanggal_penjualan).format('DD MMMM YYYY')
            : '-',
          driver: item?.driver || '-',
          no_registrasi: item?.no_registrasi || '-',
          no_polisi: item?.no_polisi || '-',
          jumlah_tandan: item?.jumlah_tandan || '0',
          berat_timbangan: item?.berat_timbangan
            ? Number(item.berat_timbangan).toLocaleString('id-ID')
            : '0',
          tarra: item?.tarra ? Number(item.tarra).toLocaleString('id-ID') : '0',
          t_potongan_persen: item?.t_potongan_persen || '0',
          t_potongan_kg: item?.t_potongan_kg
            ? Number(item.t_potongan_kg).toLocaleString('id-ID')
            : '0',
          berat_bersih: item?.berat_bersih
            ? Number(item.berat_bersih).toLocaleString('id-ID')
            : '0',
          harga_per_kilo: item?.harga_per_kilo
            ? Number(item.harga_per_kilo).toLocaleString('id-ID')
            : '0',
          total_penjualan: item?.total_penjualan
            ? Number(item.total_penjualan).toLocaleString('id-ID')
            : '0',
        }));

        setPenjualanData(mapped);
        setTotalPenjualan(Number(data?.count || 0));
      } else {
        setPenjualanData([]);
        setTotalPenjualan(0);
      }
    } catch (error) {
      setPenjualanData([]);
      setTotalPenjualan(0);
      toast.error(
        error?.response?.data?.message || 'Gagal memuat data penjualan angkutan'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isKelompokFilterInitialized) {
      const startDate = selectedDateRange.startDate
        ? moment(selectedDateRange.startDate).format('YYYY-MM-DD')
        : null;
      const endDate = selectedDateRange.endDate
        ? moment(selectedDateRange.endDate).format('YYYY-MM-DD')
        : null;

      fetchPenjualanData({
        page: currentPage,
        page_size: pageSize,
        search,
        kelompok_tani: selectedKelompok,
        pabrik: selectedPabrik,
        start_date: startDate,
        end_date: endDate,
      });
    }
  }, [
    isKelompokFilterInitialized,
    currentPage,
    pageSize,
    search,
    selectedKelompok,
    selectedPabrik,
    selectedDateRange.startDate,
    selectedDateRange.endDate,
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

  const handlePabrikChange = (e) => {
    setSelectedPabrik(e.target.value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleLihatClicked = (data) => {
    router.push(`/traceability/penjualan/${data.id}`);
  };

  const handleDeleteClicked = (data) => {
    setSelectedPenjualanToDelete(data);
    setShowModalConfirmDeletePenjualan(true);
  };

  const handleExportCSV = async () => {
    try {
      setLoading(true);
      const startDate = selectedDateRange.startDate
        ? moment(selectedDateRange.startDate).format('YYYY-MM-DD')
        : null;
      const endDate = selectedDateRange.endDate
        ? moment(selectedDateRange.endDate).format('YYYY-MM-DD')
        : null;

      const response = await exportPenjualanAngkutanToCSV({
        search,
        kelompok: selectedKelompok,
        pabrik: selectedPabrik,
        start_date: startDate,
        end_date: endDate,
      });

      // Create blob and download
      const blob = new Blob([response.data], {
        type: 'text/csv',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `penjualan_angkutan_${moment().format('YYYY-MM-DD')}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Data berhasil diekspor ke CSV');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal mengekspor data');
    } finally {
      setLoading(false);
    }
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
            className="cursor-pointer text-[10px] font-bold uppercase text-red-500 underline hover:text-red-600 sm:text-[12px]"
            onClick={() => handleDeleteClicked(e.data)}
          >
            HAPUS
          </div>
        )}
      </div>
    );
  }, [isViewOnly]);

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
      },
      {
        field: 'id_penjualan',
        headerName: 'Id Penjualan',
        flex: 1,
      },
      {
        field: 'tanggal_penjualan',
        headerName: 'Tanggal Penjualan',
        flex: 1,
      },
      {
        field: 'driver',
        headerName: 'Driver',
        flex: 1,
      },
      {
        field: 'no_polisi',
        headerName: 'No. Polisi',
        flex: 1,
      },
      {
        field: 'jumlah_tandan',
        headerName: 'Jumlah Tandan',
        flex: 1,
      },
      {
        field: 'berat_timbangan',
        headerName: 'Berat Timbangan (Kg)',
        flex: 1,
      },
      {
        field: 'total_penjualan',
        headerName: 'Total Penjualan (Rp)',
        flex: 1,
      },
    ],
    [ActionsCellRenderer]
  );

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

  const handleDeletePenjualan = async () => {
    if (!selectedPenjualanToDelete?.id) {
      toast.error('ID penjualan tidak ditemukan');
      return;
    }

    try {
      const res = await deletePenjualanAngkutan(selectedPenjualanToDelete.id);
      if (
        res?.data?.status === 'success' ||
        res?.status === 200 ||
        res?.status === 204
      ) {
        toast.success('Data penjualan berhasil dihapus');
        setShowModalConfirmDeletePenjualan(false);
        setSelectedPenjualanToDelete(null);
        const startDate = selectedDateRange.startDate
          ? moment(selectedDateRange.startDate).format('YYYY-MM-DD')
          : null;
        const endDate = selectedDateRange.endDate
          ? moment(selectedDateRange.endDate).format('YYYY-MM-DD')
          : null;
        fetchPenjualanData({
          page: currentPage,
          page_size: pageSize,
          search,
          kelompok_tani: selectedKelompok,
          pabrik: selectedPabrik,
          start_date: startDate,
          end_date: endDate,
        });
      } else {
        toast.error(res?.data?.message || 'Data penjualan gagal dihapus');
      }
    } catch (error) {
      console.error('Error deleting penjualan:', error);
      toast.error(
        error?.response?.data?.message || 'Data penjualan gagal dihapus'
      );
    }
  };

  const handleDeleteCancel = () => {
    setShowModalConfirmDeletePenjualan(false);
    setSelectedPenjualanToDelete(null);
  };

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      <div className="flex h-full flex-col gap-4">
        <div className="flex max-w-full flex-col gap-3 p-0 sm:gap-4">
          {/* Header Section */}
          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between sm:gap-4">
            <Heading
              className="mt-1 flex uppercase tracking-[2px]"
              level={3}
            >
              PENJUALAN
            </Heading>

            {/* Controls Container */}
            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-start xl:justify-end sm:gap-3">
              {/* Search and Filters - Responsive Grid */}
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                <SearchBar
                  onChange={handleSearchTextChange}
                  placeholder="Cari Driver"
                  className="w-full sm:w-auto lg:w-[200px]"
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[180px]"
                  placeholder="Kelompok"
                  options={kelompokOptions}
                  value={selectedKelompok}
                  onChange={handleKelompokChange}
                  disabled={isKetuaKelompokTani}
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[180px]"
                  placeholder="Pabrik"
                  options={pabrikOptions}
                  value={selectedPabrik}
                  onChange={handlePabrikChange}
                />

                <div className="w-full sm:w-auto lg:w-[280px]">
                  <DateRange
                    value={selectedDateRange}
                    onChange={handleDateRangeChange}
                    placeholder="Pilih Rentang Tanggal"
                    className="!h-[42px]"
                  />
                </div>
              </div>

              {/* Action Buttons - Responsive */}
              <div className="flex w-full flex-row items-center justify-between gap-2 sm:w-auto sm:justify-end">
                <Button
                  onClick={handleExportCSV}
                  className="!px-3 flex-1 sm:flex-none justify-center"
                  icon={<DownloadCloudIcon size={18} />}
                  title="Export CSV"
                />
                {!isViewOnly && (
                  <Button
                    onClick={() => router.push('/traceability/penjualan/tambah')}
                    className="whitespace-nowrap text-xs sm:text-sm flex-[2] sm:flex-none justify-center"
                  >
                    Tambah Penjualan
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Table Container - Responsive Height */}
        </div>
        <div className="relative w-full flex-1 overflow-hidden min-h-[400px]">
          <SectionLoading loading={loading} />
          <AgGridReact
            loading={loading}
            overlayLoadingTemplate="."
            autoSizeStrategy={autoSizeStrategy}
            rowData={penjualanData}
            columnDefs={colDefs}
          />
        </div>
        <div className="flex justify-center sm:justify-end">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalPenjualan}
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

      <DeleteConfirmationModal
        isOpen={showModalConfirmDeletePenjualan}
        onClose={handleDeleteCancel}
        onConfirm={handleDeletePenjualan}
        itemName={`penjualan dengan ID ${selectedPenjualanToDelete?.id_penjualan}`}
        isLoading={loading}
      />
    </div>
  );
};

export default PenjualanPage;
