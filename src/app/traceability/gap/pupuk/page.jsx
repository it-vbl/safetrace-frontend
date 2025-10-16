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
import useReferences from '@/hooks/useReferences';
import useYearOptions from '@/hooks/useYearOptions';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const PupukPage = () => {
  const router = useRouter();

  // Get options from hooks
  const tahunOptions = useYearOptions();
  const { kelompokTani, fetchKelompokTani } = useReferences();
  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState(null);
  const [selectedTahun, setSelectedTahun] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [pupukData, setPupukData] = useState([]);
  const [totalPupuk, setTotalPupuk] = useState(0);

  // Mock data for demonstration
  const mockData = useMemo(
    () => [
      {
        id: 1,
        id_kebun: '001-APKS-001-001',
        nama_petani: 'Agustinus Nery',
        kelompok: 'Bepekaek Besamo',
        luas_kebun: 0.75,
        tahun_tanam: 2014,
        umur_tanaman: '21 Tahun',
        jumlah_pokok: '100 Pohon',
        total_pupuk: '500 Kg',
      },
      {
        id: 2,
        id_kebun: '001-APKS-001-002',
        nama_petani: 'Agustinus Nery',
        kelompok: 'Bepekaek Besamo',
        luas_kebun: 0.75,
        tahun_tanam: 2014,
        umur_tanaman: '21 Tahun',
        jumlah_pokok: '100 Pohon',
        total_pupuk: '500 Kg',
      },
      {
        id: 3,
        id_kebun: '001-APKS-001-003',
        nama_petani: 'Agustinus Nery',
        kelompok: 'Bepekaek Besamo',
        luas_kebun: 0.75,
        tahun_tanam: 2014,
        umur_tanaman: '21 Tahun',
        jumlah_pokok: '100 Pohon',
        total_pupuk: '500 Kg',
      },
      {
        id: 4,
        id_kebun: '001-APKS-001-004',
        nama_petani: 'Agustinus Nery',
        kelompok: 'Bepekaek Besamo',
        luas_kebun: 0.75,
        tahun_tanam: 2014,
        umur_tanaman: '21 Tahun',
        jumlah_pokok: '100 Pohon',
        total_pupuk: '500 Kg',
      },
      {
        id: 5,
        id_kebun: '001-APKS-001-005',
        nama_petani: 'Agustinus Nery',
        kelompok: 'Bepekaek Besamo',
        luas_kebun: 0.75,
        tahun_tanam: 2014,
        umur_tanaman: '21 Tahun',
        jumlah_pokok: '100 Pohon',
        total_pupuk: '500 Kg',
      },
    ],
    []
  );

  // Fetch Pupuk data function
  const fetchPupukData = useCallback(
    async ({ page, page_size, search, kelompok, tahun }) => {
      setLoading(true);
      try {
        // For now, use mock data
        // In real implementation, you would call the API:
        // const params = new URLSearchParams({
        //   page,
        //   page_size,
        // });
        // if (search) params.append('search', search);
        // if (kelompok) params.append('kelompok', kelompok);
        // if (tahun) params.append('tahun', tahun);
        // const response = await getListPupuk(params.toString());

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock response
        setPupukData(mockData);
        setTotalPupuk(500); // Mock total count
      } catch (error) {
        console.error('Error fetching Pupuk data:', error);
        toast.error('Gagal memuat data Pupuk');
        setPupukData([]);
        setTotalPupuk(0);
      } finally {
        setLoading(false);
      }
    },
    [mockData]
  );

  // Fetch kelompok tani data on component mount
  useEffect(() => {
    if (!kelompokTani || kelompokTani.length === 0) {
      fetchKelompokTani();
    }
  }, [kelompokTani, fetchKelompokTani]);

  useEffect(() => {
    fetchPupukData({
      page: currentPage,
      page_size: pageSize,
      search,
      kelompok: selectedKelompok,
      tahun: selectedTahun,
    });
  }, [
    currentPage,
    pageSize,
    search,
    selectedKelompok,
    selectedTahun,
    fetchPupukData,
  ]);

  const handleSearchTextChange = useMemo(
    () =>
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

  const handleTahunChange = (e) => {
    setSelectedTahun(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleLihatClicked = useCallback(
    (data) => {
      router.push(`/traceability/gap/pupuk/${data?.id}`);
    },
    [router]
  );

  const ActionsCellRenderer = useCallback(
    (e) => {
      return (
        <div className="flex h-full w-full flex-row items-center justify-center gap-1 sm:gap-2">
          <button
            className="cursor-pointer text-[10px] font-bold uppercase text-primary underline hover:text-primary/80 sm:text-[12px]"
            onClick={() => handleLihatClicked(e.data)}
            type="button"
          >
            LIHAT
          </button>
        </div>
      );
    },
    [handleLihatClicked]
  );

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
        field: 'luas_kebun',
        headerName: 'Luas Kebun (Ha)',
        flex: 1,
        minWidth: 120,
        cellRenderer: (params) => {
          return `${params.value}`;
        },
      },
      {
        field: 'tahun_tanam',
        headerName: 'Tahun Tanam',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'umur_tanaman',
        headerName: 'Umur Tanaman',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'jumlah_pokok',
        headerName: 'Jumlah Pokok',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'total_pupuk',
        headerName: 'Total Pupuk',
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
              PUPUK
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
                  options={kelompokTani || []}
                  value={selectedKelompok}
                  onChange={handleKelompokChange}
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[120px]"
                  placeholder="Tahun"
                  options={tahunOptions}
                  value={selectedTahun}
                  onChange={handleTahunChange}
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
            rowData={pupukData}
            columnDefs={colDefs}
          />
        </div>

        <div className="flex justify-center sm:justify-end">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalPupuk}
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

export default PupukPage;
