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
import { downloadListLB3, getListLB3 } from '@/services/lb3';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const LB3Page = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const canDownload = mounted ? hasPermission(getCurrentUserRoles(), 'limbah.download') : false;

  // Get options from hooks
  const tahunOptions = useYearOptions();
  const { kelompokTani, fetchKelompokTani } = useReferences();
  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState(null);
  const [selectedTahun, setSelectedTahun] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [lb3Data, setLb3Data] = useState([]);
  const [totalLb3, setTotalLb3] = useState(0);

  // Fetch LB3 data function
  const fetchLB3Data = useCallback(
    async ({ page, page_size, search, kelompok, tahun }) => {
      setLoading(true);
      try {
        const params = {
          page,
          page_size,
          ...(search && { search }),
          ...(kelompok && { kelompok }),
          ...(tahun && { tahun }),
        };

        const response = await getListLB3(params);

        if (response?.status === 200) {
          const data = response?.data?.data;
          const results = data?.results || [];

          const mapped = results.map((item) => ({
            id: item?.kebun_id || item?.id,
            id_kebun: item?.id_kebun || '-',
            nama_petani: item?.nama_petani || '-',
            kelompok: item?.kelompok_tani || '-',
            luas_kebun: item?.luas_kebun || 0,
            tahun_tanam: item?.tahun_tanam || '-',
            umur_tanaman: item?.umur_tanaman
              ? `${item.umur_tanaman} Tahun`
              : '-',
            total_lb3: item?.total_lb3 ? `${item.total_lb3} Kg` : '-',
          }));

          setLb3Data(mapped);
          setTotalLb3(Number(data?.count || 0));
        } else {
          setLb3Data([]);
          setTotalLb3(0);
        }
      } catch (error) {
        console.error('Error fetching LB3 data:', error);
        toast.error(error?.response?.data?.message || 'Gagal memuat data LB3');
        setLb3Data([]);
        setTotalLb3(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch kelompok tani data on component mount
  useEffect(() => {
    if (!kelompokTani || kelompokTani.length === 0) {
      fetchKelompokTani();
    }
  }, [kelompokTani]);

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

  useEffect(() => {
    if (isKelompokFilterInitialized) {
      fetchLB3Data({
        page: currentPage,
        page_size: pageSize,
        search,
        kelompok: selectedKelompok,
        tahun: selectedTahun,
      });
    }
  }, [
    isKelompokFilterInitialized,
    currentPage,
    pageSize,
    search,
    selectedKelompok,
    selectedTahun,
    fetchLB3Data,
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

  const handleExportExcel = async () => {
    try {
      setIsExportingExcel(true);
      const params = {};
      if (selectedKelompok) params.kelompok = selectedKelompok;
      if (search) params.search = search;
      if (selectedTahun) params.tahun = selectedTahun;

      const response = await downloadListLB3(params);
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'text/csv' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `data-lb3-${moment().format('YYYY-MM-DD-HH-mm')}.csv`
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

  const handleLihatClicked = useCallback(
    (data) => {
      router.push(`/traceability/gap/lb3/${data?.id}`);
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
        width: 120,
        minWidth: 100,
        maxWidth: 150,
        suppressSizeToFit: false,
        pinned: 'left',
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
        field: 'total_lb3',
        headerName: 'Total LB3',
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
            <Heading
              className=" flex flex-1 uppercase tracking-[2px]"
              level={3}
            >
              LIMBAH BAHAN BERBAHAYA BERACUN
            </Heading>

            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              {/* === SEARCH FILTER === */}
              <div className="grid w-full grid-cols-1 items-center gap-2 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-row">
                <SearchBar
                  onChange={handleSearchTextChange}
                  placeholder="Cari Petani"
                  className="w-full sm:w-auto lg:w-[200px]"
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[150px]"
                  placeholder="Kelompok"
                  options={kelompokTani || []}
                  value={selectedKelompok}
                  onChange={handleKelompokChange}
                  disabled={isKetuaKelompokTani}
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

        {/* === TABLE CONTAINER === */}
        <div className="relative w-full flex-1">
          <AgGridReact
            loading={loading}
            overlayLoadingTemplate="."
            autoSizeStrategy={autoSizeStrategy}
            rowData={lb3Data}
            columnDefs={colDefs}
          />
        </div>

        <div className="flex justify-center sm:justify-end">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalLb3}
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

export default LB3Page;
