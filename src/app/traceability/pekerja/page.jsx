'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import debounce from 'lodash/debounce';
import { DownloadCloudIcon } from 'lucide-react';
import moment from 'moment/moment';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/molecules/Select';
import Pagination from '@/components/organisms/Pagination';
import useReferences from '@/hooks/useReferences';
import PekerjaService from '@/services/pekerja';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const PekerjaPage = () => {
  const router = useRouter();
  const { kelompokTani, fetchKelompokTani } = useReferences();
  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [pekerjaData, setPekerjaData] = useState([]);
  const [totalPekerja, setTotalPekerja] = useState(0);

  // Fetch pekerja data function
  const fetchPekerjaData = async ({
    page,
    page_size,
    search,
    kelompok,
  }) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page,
        page_size,
      });

      if (search) params.append('search', search);
      if (kelompok) params.append('kelompok', kelompok);

      const response = await PekerjaService.getListPekerja(params.toString());

      if (response?.data?.status === 'success') {
        // Map API response to table format
        const mappedData = response.data.data.results.map((pekerja) => ({
          id: pekerja.id,
          id_petani: pekerja.id_petani || '-',
          nama_petani: pekerja.nama_petani || '-',
          jenis_kelamin: pekerja.jenis_kelamin || '-',
          kelompok: pekerja.kelompok || '-',
          no_ktp: pekerja.no_ktp || '-',
          no_kk: pekerja.no_kk || '-',
          luas_kebun: pekerja.luas_kebun || '0',
          jumlah_pekerja: pekerja.jumlah_pekerja || 0,
          terakhir_diubah: pekerja.updated_at ? new Date(pekerja.updated_at).toLocaleString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }) : '-',
        }));

        setPekerjaData(mappedData);
        setTotalPekerja(response.data.data.count);
      } else {
        throw new Error('Invalid response format');
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

  // Fetch kelompok data on component mount
  useEffect(() => {
    if (kelompokTani.length === 0) {
      fetchKelompokTani();
    }
  }, [kelompokTani.length, fetchKelompokTani]);

  useEffect(() => {
    fetchPekerjaData({
      page: currentPage,
      page_size: pageSize,
      search,
      kelompok: selectedKelompok,
    });
  }, [
    currentPage,
    pageSize,
    search,
    selectedKelompok,
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleLihatClicked = (data) => {
    router.push(`/traceability/pekerja/${data?.id}`);
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
      </div>
    );
  }, []);

  const colDefs = useMemo(
    () => [
      {
        field: 'actions',
        headerName: '',
        cellRenderer: ActionsCellRenderer,
        width: 80,
        minWidth: 70,
        maxWidth: 100,
        suppressSizeToFit: false,
      },
      {
        field: 'id_petani',
        headerName: 'Id Petani',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'nama_petani',
        headerName: 'Nama Petani',
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
        field: 'kelompok',
        headerName: 'Kelompok',
        flex: 1,
        minWidth: 140,
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
        field: 'luas_kebun',
        headerName: 'Luas Kebun (Ha)',
        flex: 1,
        minWidth: 120,
        cellRenderer: (params) => {
          return `${params.value}`;
        },
      },
      {
        field: 'jumlah_pekerja',
        headerName: 'Jumlah Pekerja',
        flex: 1,
        minWidth: 120,
      },
    ],
    [ActionsCellRenderer]
  );

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          {/* === HEADER === */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <Heading level={2} className="text-lg sm:text-xl md:text-2xl">
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
                  placeholder="Kelompok"
                  options={kelompokTani}
                  value={selectedKelompok}
                  onChange={handleKelompokChange}
                />
              </div>

              {/* === ACTION BUTTON === */}
              <div className="flex flex-row items-center justify-end gap-2">
                <Button
                  className="!px-2 sm:!px-3"
                  icon={<DownloadCloudIcon size={18} />}
                  title="Export Excel"
                  onClick={() => toast.info('Export Excel clicked')}
                />
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
    </div>
  );
};

export default PekerjaPage;
