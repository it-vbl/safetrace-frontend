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
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/molecules/Select';
import Pagination from '@/components/organisms/Pagination';
import useReferences from '@/hooks/useReferences';
import useYearOptions from '@/hooks/useYearOptions';
import { getCurrentUserRoles, hasPermission } from '@/libs/permissions';
import { downloadListPestisida, getListPestisida } from '@/services/pestisida';

ModuleRegistry.registerModules([AllCommunityModule]);

const PestisidaPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const canDownload = mounted ? hasPermission(getCurrentUserRoles(), 'pestisida.download') : false;

  const { kelompokTani, fetchKelompokTani } = useReferences();

  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [pestisidaData, setPestisidaData] = useState([]);
  const [totalPestisida, setTotalPestisida] = useState(0);
  const yearOptions = useYearOptions();

  useEffect(() => {
    fetchKelompokTani();
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
        setSelectedKelompok(kelompokOption.label); // Uses label as value
        setIsKetuaKelompokTani(true);
        setTimeout(() => setIsKelompokFilterInitialized(true), 100);
      } else {
        setIsKelompokFilterInitialized(true);
      }
    } else {
      setIsKelompokFilterInitialized(true);
    }
  }, [kelompokTani]);

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

  const fetchPestisidaList = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        page_size: pageSize,
      };
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
        tahunTanam: item?.tahun_tanam ?? null,
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
  }, [currentPage, pageSize, search, selectedKelompok, selectedYear]);

  useEffect(() => {
    if (isKelompokFilterInitialized) {
      fetchPestisidaList();
    }
  }, [isKelompokFilterInitialized, fetchPestisidaList]);

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

  const handleExportExcel = async () => {
    try {
      setIsExportingExcel(true);
      const params = {};
      if (selectedKelompok) params.kelompok = selectedKelompok;
      if (search) params.search = search;
      if (selectedYear) params.tahun = selectedYear;

      const response = await downloadListPestisida(params);
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'text/csv' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `data-pestisida-${moment().format('YYYY-MM-DD-HH-mm')}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      toast.error('Gagal mengunduh data');
    } finally {
      setIsExportingExcel(false);
    }
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
        pinned: 'left',
      },
      { field: 'idKebun', headerName: 'Id Kebun', flex: 1 },
      { field: 'namaPetani', headerName: 'Nama Petani', flex: 1 },
      { field: 'kelompok', headerName: 'Kelompok', flex: 1 },
      { field: 'luasKebunHa', headerName: 'Luas Kebun (Ha)', flex: 1 },
      { field: 'tahunTanam', headerName: 'Tahun Tanam', flex: 1 },
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
    // Backend filtering covers search, kelompok, and year.
    return pestisidaData;
  }, [pestisidaData]);

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
                  placeholder="Cari Petani"
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
                  containerClassName="w-full sm:w-auto lg:w-[150px]"
                  placeholder="Tahun"
                  options={yearOptions}
                  value={selectedYear}
                  onChange={handleYearChange}
                />
              </div>

              <div className="flex flex-row flex-wrap items-center justify-end gap-2">
                {canDownload && (
                  <Button
                    className="!px-2 sm:!px-3"
                    icon={<DownloadCloudIcon size={18} />}
                    title="Export Excel"
                    onClick={handleExportExcel}
                    isLoading={isExportingExcel}
                    disabled={isExportingExcel || loading}
                  />
                )}
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
            rowData={pestisidaData}
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
