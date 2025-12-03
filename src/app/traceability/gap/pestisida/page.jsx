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
import { getListPestisida } from '@/services/pestisida';

ModuleRegistry.registerModules([AllCommunityModule]);

const PestisidaPage = () => {
  const router = useRouter();
  const { kelompokTani, fetchKelompokTani } = useReferences();

  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [pestisidaData, setPestisidaData] = useState([]);
  const [totalPestisida, setTotalPestisida] = useState(0);
  const yearOptions = useYearOptions();

  useEffect(() => {
    fetchKelompokTani();
  }, []);

  const kelompokOptions = useMemo(() => {
    return (
      kelompokTani?.map((item) => ({ label: item.label, value: item.label })) ||
      []
    );
  }, [kelompokTani]);

  const currentYear = new Date().getFullYear();
  const formatNumber = (num) =>
    typeof num === 'number'
      ? num.toLocaleString('id-ID')
      : (Number(num) || 0).toLocaleString('id-ID');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedKelompok) params.kelompok = selectedKelompok;
        if (search) params.search = search;
        if (selectedYear) params.tahun = selectedYear;
        const res = Object.keys(params).length
          ? await getListPestisida(params)
          : await getListPestisida();
        const payload = res?.data?.data || res?.data || {};
        const list = payload?.results || payload?.data || payload || [];
        const normalized = (Array.isArray(list) ? list : []).map((item) => ({
          id: item?.kebun_id,
          idKebun: item?.id_kebun ?? '-',
          namaPetani: item?.nama_petani ?? '-',
          kelompok: item?.kelompok_tani ?? '-',
          luasKebunHa:
            typeof item?.luas_kebun === 'string'
              ? Number(item.luas_kebun)
              : item?.luas_kebun ?? null,
          tahun: item?.tahun ?? null,
          umurTanaman: item?.umur_tanaman ?? null,
          totalPestisida:
            typeof item?.total_pestisida === 'number'
              ? item.total_pestisida
              : Number(item?.total_pestisida) || 0,
        }));
        setPestisidaData(normalized);
        const count = payload?.count ?? normalized.length;
        setTotalPestisida(count);
      } catch (err) {
        toast.error('Gagal memuat data pestisida');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, selectedKelompok, selectedYear]);

  const handleSearchTextChange = useCallback(
    debounce((value) => {
      setSearch(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleKelompokChange = (e) => {
    setSelectedKelompok(e?.target?.value ?? '');
    setCurrentPage(1);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e?.target?.value ?? '');
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
    router.push(`/traceability/gap/pestisida/${data.id}`);
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
      { field: 'tahun', headerName: 'Tahun', flex: 1 },
      {
        field: 'umurTanaman',
        headerName: 'Umur Tanaman',
        valueFormatter: (p) => {
          const v = p.value;
          return v == null || v < 0 ? '-' : `${v} Tahun`;
        },
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

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      minWidth: 100,
      wrapText: true,
      autoHeight: true,
    }),
    []
  );

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
        (item) => String(item?.tahun) === String(selectedYear)
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
    <div className="relative !min-h-[calc(100%-72px)] w-full min-w-[320px] max-w-full">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          {/* Header Section */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <Heading
              className=" flex flex-1 uppercase tracking-[2px]"
              level={3}
            >
              PESTISIDA
            </Heading>

            {/* Controls Container */}
            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              {/* Search and Filters - Responsive Grid */}
              <div className="grid w-full grid-cols-1 items-center gap-2 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-row">
                <SearchBar
                  onChange={(e) => handleSearchTextChange(e.target.value)}
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

              <div className="flex flex-row flex-wrap items-center justify-end gap-2">
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
        <div className="relative w-full flex-1 overflow-x-auto">
          <AgGridReact
            loading={loading}
            overlayLoadingTemplate="."
            autoSizeStrategy={autoSizeStrategy}
            defaultColDef={defaultColDef}
            rowData={paginatedData}
            columnDefs={colDefs}
          />
        </div>

        {/* Pagination */}
        <div className="flex w-full justify-center overflow-x-auto sm:justify-end">
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
