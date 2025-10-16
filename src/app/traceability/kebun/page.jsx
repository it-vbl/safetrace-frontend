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
import { getListKebun } from '@/services/pekebun';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const kelompokOptions = [
  { label: 'Bepekaek Besamo', value: 'bepekaek_besamo' },
  { label: 'Kelompok A', value: 'kelompok_a' },
  { label: 'Kelompok B', value: 'kelompok_b' },
];

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
  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState(null);
  const [selectedRSPO, setSelectedRSPO] = useState(null);
  const [selectedISPO, setSelectedISPO] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [kebunData, setKebunData] = useState([]);
  const [totalKebun, setTotalKebun] = useState(0);

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
      if (kelompok) params.append('kelompok', kelompok);
      if (rspo) params.append('is_rspo', rspo === 'sudah' ? 'true' : 'false');
      if (ispo) params.append('is_ispo', ispo === 'sudah' ? 'true' : 'false');

      const response = await getListKebun(params.toString());

      if (response?.data?.status === 'success') {
        // Map API response to table format
        const mappedData = response.data.data.results.map((kebun) => ({
          id: kebun.id,
          id_kebun: kebun.id_kebun,
          nama_petani: '-', // Petani name not included in this endpoint
          kelompok: '-', // Kelompok not included in this endpoint
          lokasi: kebun.lokasi_kebun,
          luas_kebun: kebun.luas,
          waktu_tanam: new Date(kebun.waktu_tanam).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          rspo: kebun.is_rspo ? 'Sudah' : 'Belum',
          ispo: kebun.is_ispo ? 'Sudah' : 'Belum',
        }));

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

  const handleLihatClicked = (data) => {
    router.push(`/traceability/kebun/${data?.id}`);
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
        width: 80,
        minWidth: 70,
        maxWidth: 100,
        suppressSizeToFit: false,
      },
      {
        field: 'id_kebun',
        headerName: 'Id Kebun',
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
        field: 'kelompok',
        headerName: 'Kelompok',
        flex: 1,
        minWidth: 140,
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
          return `${params.value}`;
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
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          {/* === HEADER === */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <Heading level={2} className="text-lg sm:text-xl md:text-2xl">
              DATA KEBUN
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
                  onClick={() => toast.info('Export Excel clicked')}
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
    </div>
  );
};

export default KebunPage;
