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
import { getListProduksi } from '@/services/produksi';

ModuleRegistry.registerModules([AllCommunityModule]);

const ProduksiPage = () => {
  const router = useRouter();

  const { kelompokTani, fetchKelompokTani } = useReferences();
  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [produksiData, setProduksiData] = useState([]);
  const [totalProduksi, setTotalProduksi] = useState(0);

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

  const formatNumber = (num) =>
    typeof num === 'number'
      ? num.toLocaleString('id-ID')
      : (Number(num) || 0).toLocaleString('id-ID');

  const fetchProduksiList = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedKelompok) params.kelompok = selectedKelompok;
      if (search) params.search = search;
      if (selectedYear) params.tahun = selectedYear;

      const res = Object.keys(params).length
        ? await getListProduksi(params)
        : await getListProduksi();

      const payload = res?.data?.data || res?.data || {};
      const results = payload?.results || payload?.data || payload || [];
      const count =
        payload?.count ?? (Array.isArray(results) ? results.length : 0);

      const mapped = (results || []).map((item) => ({
        id: item?.kebun_id ?? item?.id,
        idKebun: item?.id_kebun ?? '-',
        namaPetani: item?.nama_petani ?? '-',
        kelompok: item?.kelompok_tani ?? '-',
        tahun: item?.tahun_tanam ?? item?.tahun ?? '-',
        umurTanaman: item?.umur_tanaman ?? '-',
        totalProduksi: item?.total_produksi ?? 0,
        produksiPerHaPerTahun: item?.prod_ha_th ?? 0,
      }));

      setProduksiData(mapped);
      setTotalProduksi(count);
    } catch (error) {
      toast.error('Gagal memuat data produksi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduksiList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, search, selectedKelompok, selectedYear]);

  const handleSearchTextChange = useCallback(
    debounce((e) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleKelompokChange = (e) => {
    const val = e?.target?.value ?? '';
    setSelectedKelompok(val);
    setCurrentPage(1);
  };

  const handleYearChange = (e) => {
    const val = e?.target?.value ?? '';
    setSelectedYear(val);
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
    router.push(`/traceability/gap/produksi/${data.id}`);
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
      { field: 'kelompok', headerName: 'Kelompok Tani', flex: 1 },
      { field: 'tahun', headerName: 'Tahun', flex: 1 },
      {
        field: 'umurTanaman',
        headerName: 'Umur Tanaman',
        valueFormatter: (p) => `${p.value} Tahun`,
        flex: 1,
      },
      {
        field: 'totalProduksi',
        headerName: 'Total Produksi',
        valueFormatter: (params) => `${formatNumber(params.value)} Kg`,
        flex: 1,
      },
      {
        field: 'produksiPerHaPerTahun',
        headerName: 'Prod/Ha/Th',
        valueFormatter: (params) => `${formatNumber(params.value)} Kg`,
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

  const filteredData = useMemo(() => {
    let data = [...produksiData];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (item) =>
          String(item?.namaPetani || '')
            ?.toLowerCase()
            .includes(q) ||
          String(item?.idKebun || '')
            ?.toLowerCase()
            .includes(q) ||
          String(item?.kelompok || '')
            ?.toLowerCase()
            .includes(q)
      );
    }

    if (selectedKelompok) {
      const k = String(selectedKelompok).toLowerCase();
      data = data.filter((item) =>
        (item?.kelompok || '')?.toLowerCase().includes(k)
      );
    }

    if (selectedYear) {
      data = data.filter(
        (item) => String(item?.tahun) === String(selectedYear)
      );
    }

    return data;
  }, [produksiData, search, selectedKelompok, selectedYear]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  useEffect(() => {
    setTotalProduksi(filteredData.length);
  }, [filteredData]);

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          {/* Header Section */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <Heading level={2} className="text-lg sm:text-xl md:text-2xl">
              PRODUKSI
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
            totalItems={totalProduksi}
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

export default ProduksiPage;
