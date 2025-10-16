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
import useYearOptions from '@/hooks/useYearOptions';

ModuleRegistry.registerModules([AllCommunityModule]);

const kelompokOptions = [
  { label: 'Bepekaek Besamo', value: 'Bepekaek Besamo' },
  { label: 'Kelompok A', value: 'Kelompok A' },
  { label: 'Kelompok B', value: 'Kelompok B' },
  { label: 'Kelompok C', value: 'Kelompok C' },
];

const PestisidaPage = () => {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [pestisidaData, setPestisidaData] = useState([]);
  const [totalPestisida, setTotalPestisida] = useState(0);
  const yearOptions = useYearOptions();

  const currentYear = new Date().getFullYear();
  const formatNumber = (num) =>
    typeof num === 'number'
      ? num.toLocaleString('id-ID')
      : (Number(num) || 0).toLocaleString('id-ID');

  const samplePestisidaData = [
    {
      idKebun: '001-APKS-001-001',
      namaPetani: 'Agustinus Nery',
      kelompok: 'Bepekaek Besamo',
      luasKebunHa: 0.75,
      tahunTanam: 2014,
      totalPestisida: 13,
    },
    {
      idKebun: '001-APKS-001-002',
      namaPetani: 'Agustinus Nery',
      kelompok: 'Bepekaek Besamo',
      luasKebunHa: 0.75,
      tahunTanam: 2014,
      totalPestisida: 13,
    },
    {
      idKebun: '001-APKS-001-003',
      namaPetani: 'Agustinus Nery',
      kelompok: 'Bepekaek Besamo',
      luasKebunHa: 0.75,
      tahunTanam: 2014,
      totalPestisida: 13,
    },
    {
      idKebun: '001-APKS-001-004',
      namaPetani: 'Agustinus Nery',
      kelompok: 'Bepekaek Besamo',
      luasKebunHa: 0.75,
      tahunTanam: 2014,
      totalPestisida: 13,
    },
  ];

  useEffect(() => {
    setPestisidaData(samplePestisidaData);
    setTotalPestisida(samplePestisidaData.length);
  }, []);

  const handleSearchTextChange = useCallback(
    debounce((e) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleKelompokChange = (value) => {
    setSelectedKelompok(value);
    setCurrentPage(1);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleTambahClicked = () => {
    router.push('/traceability/gap/pestisida/tambah');
  };

  const handleLihatClicked = (data) => {
    router.push(`/traceability/gap/pestisida/${data.idKebun}`);
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
      { field: 'idKebun', headerName: 'Id Kebun', flex: 1 },
      { field: 'namaPetani', headerName: 'Nama Petani', flex: 1 },
      { field: 'kelompok', headerName: 'Kelompok', flex: 1 },
      { field: 'luasKebunHa', headerName: 'Luas Kebun (Ha)', flex: 1 },
      { field: 'tahunTanam', headerName: 'Tahun Tanam', flex: 1 },
      {
        field: 'umurTanaman',
        headerName: 'Umur Tanaman',
        valueGetter: (params) => `${currentYear - params.data.tahunTanam} Tahun`,
        flex: 1,
      },
      {
        field: 'totalPestisida',
        headerName: 'Total Pestisida',
        valueFormatter: (params) => `${formatNumber(params.value)} Liter`,
        flex: 1,
      },
    ],
    [ActionsCellRenderer, currentYear]
  );

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

  const filteredData = useMemo(() => {
    let filtered = pestisidaData;

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.namaPetani.toLowerCase().includes(search.toLowerCase()) ||
          item.idKebun.toLowerCase().includes(search.toLowerCase()) ||
          item.kelompok.toLowerCase().includes(search.toLowerCase()) ||
          (item?.luasKebunHa + '')?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedKelompok) {
      filtered = filtered.filter((item) =>
        item.kelompok.toLowerCase().includes(selectedKelompok.toLowerCase())
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (item) => item.tahunTanam === Number(selectedYear)
      );
    }

    return filtered;
  }, [pestisidaData, search, selectedKelompok, selectedYear]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  useEffect(() => {
    setTotalPestisida(filteredData.length);
  }, [filteredData]);

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          {/* Header Section */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <Heading level={2} className="text-lg sm:text-xl md:text-2xl">
              PESTISIDA
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

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[150px]"
                  placeholder="Tahun"
                  options={yearOptions}
                  value={selectedYear}
                  onChange={handleYearChange}
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
        </div>

        {/* Table Container - Responsive Height */}
        <div className="relative w-full flex-1 ">
          <AgGridReact
            loading={loading}
            overlayLoadingTemplate="."
            autoSizeStrategy={autoSizeStrategy}
            rowData={paginatedData}
            columnDefs={colDefs}
          />
        </div>

        {/* Pagination */}
        <div className="flex justify-center sm:justify-end">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalPestisida}
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

export default PestisidaPage;
