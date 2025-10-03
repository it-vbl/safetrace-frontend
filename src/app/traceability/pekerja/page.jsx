'use client';

// 1. React & Next.js (built-in)
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
// 2. External packages
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import debounce from 'lodash/debounce';
import { DownloadCloudIcon } from 'lucide-react';
import { toast } from 'react-toastify';

// 3. Internal components (alias @/)
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/molecules/Select';
import Pagination from '@/components/organisms/Pagination';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const kelompokOptions = [
  { label: 'Kelompok A', value: 'kelompok_a' },
  { label: 'Kelompok B', value: 'kelompok_b' },
  { label: 'Kelompok C', value: 'kelompok_c' },
];

const PekerjaPage = () => {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [pekerjaData, setPekerjaData] = useState([]);
  const [totalPekerja, setTotalPekerja] = useState(0);

  // Sample data - replace with actual API call
  const samplePekerjaData = [
    {
      id: '001-APKS-001-001',
      namaPetani: 'Agustinus Nery',
      jenisKelamin: 'Laki - Laki',
      kelompok: 'Bepekaek Besamo',
      noKTP: '6109010805890003',
      noKK: '6109011711110021',
      luasKebun: '0.75',
      jumlahPekerja: 3,
    },
    {
      id: '001-APKS-001-002',
      namaPetani: 'Agustinus Nery',
      jenisKelamin: 'Laki - Laki',
      kelompok: 'Bepekaek Besamo',
      noKTP: '6109010805890003',
      noKK: '6109011711110021',
      luasKebun: '1.25',
      jumlahPekerja: 4,
    },
    {
      id: '001-APKS-001-003',
      namaPetani: 'Agustinus Nery',
      jenisKelamin: 'Laki - Laki',
      kelompok: 'Bepekaek Besamo',
      noKTP: '6109010805890003',
      noKK: '6109011711110021',
      luasKebun: '2.00',
      jumlahPekerja: 4,
    },
    {
      id: '001-APKS-001-004',
      namaPetani: 'Agustinus Nery',
      jenisKelamin: 'Laki - Laki',
      kelompok: 'Bepekaek Besamo',
      noKTP: '6109010805890003',
      noKK: '6109011711110021',
      luasKebun: '1.50',
      jumlahPekerja: 2,
    },
    {
      id: '001-APKS-001-005',
      namaPetani: 'Agustinus Nery',
      jenisKelamin: 'Laki - Laki',
      kelompok: 'Bepekaek Besamo',
      noKTP: '6109010805890003',
      noKK: '6109011711110021',
      luasKebun: '0.90',
      jumlahPekerja: 1,
    },
    {
      id: '001-APKS-001-006',
      namaPetani: 'Agustinus Nery',
      jenisKelamin: 'Laki - Laki',
      kelompok: 'Bepekaek Besamo',
      noKTP: '6109010805890003',
      noKK: '6109011711110021',
      luasKebun: '1.80',
      jumlahPekerja: 3,
    },
    {
      id: '001-APKS-001-007',
      namaPetani: 'Agustinus Nery',
      jenisKelamin: 'Laki - Laki',
      kelompok: 'Bepekaek Besamo',
      noKTP: '6109010805890003',
      noKK: '6109011711110021',
      luasKebun: '2.25',
      jumlahPekerja: 4,
    },
    {
      id: '001-APKS-001-008',
      namaPetani: 'Agustinus Nery',
      jenisKelamin: 'Laki - Laki',
      kelompok: 'Bepekaek Besamo',
      noKTP: '6109010805890003',
      noKK: '6109011711110021',
      luasKebun: '3.00',
      jumlahPekerja: 5,
    },
  ];

  // Initialize pekerjaData with sample data
  useEffect(() => {
    setPekerjaData(samplePekerjaData);
    setTotalPekerja(samplePekerjaData.length);
  }, []);

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
    router.push(`/traceability/pekerja/${data.id}`);
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
        width: 120,
        minWidth: 100,
        maxWidth: 150,
        suppressSizeToFit: false,
      },
      {
        field: 'id',
        headerName: 'Id Petani',
        flex: 1,
      },
      {
        field: 'namaPetani',
        headerName: 'Nama Petani',
        flex: 1,
      },
      {
        field: 'jenisKelamin',
        headerName: 'Jenis Kelamin',
        flex: 1,
      },
      {
        field: 'kelompok',
        headerName: 'Kelompok',
        flex: 1,
      },
      {
        field: 'noKTP',
        headerName: 'No. KTP',
        flex: 1,
      },
      {
        field: 'noKK',
        headerName: 'No. KK',
        flex: 1,
      },
      {
        field: 'luasKebun',
        headerName: 'Luas Kebun (Ha)',
        flex: 1,
      },
      {
        field: 'jumlahPekerja',
        headerName: 'Jumlah Pekerja',
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

  // Filter data based on search and kelompok
  const filteredData = useMemo(() => {
    let filtered = pekerjaData;

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.namaPetani.toLowerCase().includes(search.toLowerCase()) ||
          item.id.toLowerCase().includes(search.toLowerCase()) ||
          item.kelompok.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedKelompok) {
      filtered = filtered.filter((item) =>
        item.kelompok.toLowerCase().includes(selectedKelompok.toLowerCase())
      );
    }

    return filtered;
  }, [pekerjaData, search, selectedKelompok]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  useEffect(() => {
    setTotalPekerja(filteredData.length);
  }, [filteredData]);

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          {/* Header Section */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <Heading level={2} className="text-lg sm:text-xl md:text-2xl">
              PEKERJA
            </Heading>

            {/* Controls Container */}
            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              {/* Search and Filters - Responsive Grid */}
              <div className="grid w-full grid-cols-1 items-center gap-2 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-row">
                <SearchBar
                  onChange={handleSearchTextChange}
                  placeholder="Cari..."
                  className="w-full sm:w-auto lg:w-[200px]"
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[180px]"
                  placeholder="Kelompok"
                  options={kelompokOptions}
                  value={selectedKelompok}
                  onChange={handleKelompokChange}
                />
              </div>

              {/* Action Buttons - Responsive */}
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

          {/* Table Container - Responsive Height */}
        </div>
        <div className="relative w-full flex-1 ">
          <AgGridReact
            loading={loading}
            overlayLoadingTemplate="."
            autoSizeStrategy={autoSizeStrategy}
            rowData={paginatedData}
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
