'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import debounce from 'lodash/debounce';
import { DownloadCloudIcon } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import DatePicker from '@/components/molecules/DatePicker';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import Select from '@/components/molecules/Select';
import Pagination from '@/components/organisms/Pagination';

import useReferences from '../../../hooks/useReferences';
import {
  deletePenjualan,
  exportPenjualanToExcel,
  getListPenjualan,
} from '../../../services/penjualan';

ModuleRegistry.registerModules([AllCommunityModule]);

const PenjualanPage = () => {
  const router = useRouter();

  const { kelompokTani, fetchKelompokTani } = useReferences();
  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState(null);
  const [selectedPabrik, setSelectedPabrik] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [penjualanData, setPenjualanData] = useState([]);
  const [totalPenjualan, setTotalPenjualan] = useState(0);

  const [showModalConfirmDeletePenjualan, setShowModalConfirmDeletePenjualan] =
    useState(false);
  const [selectedPenjualanToDelete, setSelectedPenjualanToDelete] =
    useState(null);

  // Mock pabrik options - replace with actual API call if needed
  const pabrikOptions = [
    { label: 'Pabrik A', value: 'pabrik-a' },
    { label: 'Pabrik B', value: 'pabrik-b' },
    { label: 'Pabrik C', value: 'pabrik-c' },
  ];

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

  const fetchPenjualanData = async ({
    page,
    page_size,
    search,
    kelompok,
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
        ...(kelompok && { kelompok }),
        ...(pabrik && { pabrik }),
        ...(start_date && { start_date }),
        ...(end_date && { end_date }),
      };

      const response = await getListPenjualan(params);

      if (response?.status === 200) {
        const data = response?.data?.data;
        const results = data?.results || [];

        const mapped = results.map((item) => ({
          id: item?.id,
          id_penjualan: item?.id_penjualan || item?.id_penjualan || '-',
          tanggal_penjualan: item?.tanggal_penjualan
            ? moment(item.tanggal_penjualan).format('DD MMMM YYYY')
            : '-',
          driver: item?.driver || '-',
          no_polisi: item?.no_polisi || item?.no_polisi || '-',
          jumlah_tandan: item?.jumlah_tandan || item?.jumlah_tandan || '0',
          berat_timbangan: item?.berat_timbangan
            ? Number(item.berat_timbangan).toLocaleString('id-ID')
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
      // For now, use mock data if API fails
      const mockData = Array.from({ length: 8 }, (_, i) => ({
        id: `mock-${i + 1}`,
        id_penjualan: 'P009201',
        tanggal_penjualan: '25 Oktober 2025',
        driver: 'Welly',
        no_polisi: 'KB9194AG',
        jumlah_tandan: '546',
        berat_timbangan: '12.520',
        total_penjualan: '28.790.786',
      }));
      setPenjualanData(mockData);
      setTotalPenjualan(500);
      // toast.error(error?.response?.data?.message || 'Gagal memuat data penjualan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const startDate = selectedDate
      ? moment(selectedDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
      : null;
    const endDate = selectedDate
      ? moment(selectedDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
      : null;

    fetchPenjualanData({
      page: currentPage,
      page_size: pageSize,
      search,
      kelompok: selectedKelompok,
      pabrik: selectedPabrik,
      start_date: startDate,
      end_date: endDate,
    });
  }, [
    currentPage,
    pageSize,
    search,
    selectedKelompok,
    selectedPabrik,
    selectedDate,
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

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    if (dateValue) {
      // DatePicker expects value in DD-MM-YYYY format for display
      setSelectedDate(moment(dateValue, 'YYYY-MM-DD').format('DD-MM-YYYY'));
    } else {
      setSelectedDate('');
    }
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

  const handleExportExcel = async () => {
    try {
      setLoading(true);
      const startDate = selectedDate
        ? moment(selectedDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
        : null;
      const endDate = selectedDate
        ? moment(selectedDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
        : null;

      const response = await exportPenjualanToExcel({
        search,
        kelompok: selectedKelompok,
        pabrik: selectedPabrik,
        start_date: startDate,
        end_date: endDate,
      });

      // Create blob and download
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `penjualan_${moment().format('YYYY-MM-DD')}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Data berhasil diekspor ke Excel');
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
        <div
          className="cursor-pointer text-[10px] font-bold uppercase text-red-500 underline hover:text-red-600 sm:text-[12px]"
          onClick={() => handleDeleteClicked(e.data)}
        >
          HAPUS
        </div>
      </div>
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
      const res = await deletePenjualan(selectedPenjualanToDelete.id);
      if (
        res?.data?.status === 'success' ||
        res?.status === 200 ||
        res?.status === 204
      ) {
        toast.success('Data penjualan berhasil dihapus');
        setShowModalConfirmDeletePenjualan(false);
        fetchPenjualanData({
          page: currentPage,
          page_size: pageSize,
          search,
          kelompok: selectedKelompok,
          pabrik: selectedPabrik,
        });
      } else {
        toast.error(res?.data?.message || 'Data penjualan gagal dihapus');
      }
    } catch (error) {
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
        <div className="flex flex-col gap-3 sm:gap-4 p-0 max-w-full">
          {/* Header Section */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <Heading level={4} className="text-lg sm:text-xl md:text-2xl">
              PENJUALAN
            </Heading>

            {/* Controls Container */}
            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              {/* Search and Filters - Responsive Grid */}
              <div className="grid w-full grid-cols-1 items-center gap-2 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-row">
                <SearchBar
                  onChange={handleSearchTextChange}
                  placeholder="Cari"
                  className="w-full sm:w-auto lg:w-[200px]"
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[180px]"
                  placeholder="Kelompok"
                  options={kelompokOptions}
                  value={selectedKelompok}
                  onChange={handleKelompokChange}
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[180px]"
                  placeholder="Pabrik"
                  options={pabrikOptions}
                  value={selectedPabrik}
                  onChange={handlePabrikChange}
                />

                <div className="w-full sm:w-auto lg:w-[152px]">
                  <DatePicker
                    placeholder="Custom Date"
                    name="custom_date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    inputContainerClassName="!h-[42px]"
                  />
                </div>
              </div>

              {/* Action Buttons - Responsive */}
              <div className="flex flex-row items-center justify-end gap-2">
                <Button
                  onClick={handleExportExcel}
                  className="!px-2 sm:!px-3"
                  icon={<DownloadCloudIcon size={18} />}
                />
                <Button
                  onClick={() => router.push('/traceability/penjualan/tambah')}
                  className="whitespace-nowrap text-xs sm:text-sm"
                >
                  Tambah Penjualan
                </Button>
              </div>
            </div>
          </div>

          {/* Table Container - Responsive Height */}
        </div>
        <div className="relative w-full flex-1 ">
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
