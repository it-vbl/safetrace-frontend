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
import ModalConfirmDeletePekebun from '@/components/organisms/Modal/ModalConfirmDeletePekebun';
import Pagination from '@/components/organisms/Pagination';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const kelompokOptions = [
  { label: 'Kelompok A', value: 'kelompok_a' },
  { label: 'Kelompok B', value: 'kelompok_b' },
  { label: 'Kelompok C', value: 'kelompok_c' },
];

const keanggotaanOptions = [
  { label: 'Aktif', value: 'aktif' },
  { label: 'Tidak Aktif', value: 'tidak_aktif' },
];

const PetaniPage = () => {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState(null);
  const [selectedKeanggotaan, setSelectedKeanggotaan] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [petaniData, setPetaniData] = useState([]);
  const [totalPetani, setTotalPetani] = useState(0);

  const [showModalConfirmDeletePetani, setShowModalConfirmDeletePetani] =
    useState(false);
  const [selectedPetaniToDelete, setSelectedPetaniToDelete] = useState(null);

  // Placeholder fetch function - replace with real API call
  const fetchPetaniData = async ({
    page,
    page_size,
    search,
    kelompok,
    keanggotaan,
  }) => {
    setLoading(true);
    try {
      // TODO: Replace with real API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data
      const mockData = Array.from({ length: page_size }, (_, i) => {
        const id = `001-PTN-001-${(page - 1) * page_size + i + 1}`;
        return {
          id_petani: id,
          nama_petani: 'Agustinus Nery',
          jenis_kelamin: 'Laki - Laki',
          kelompok: 'Bepekaek Besamo',
          no_ktp: '6109010805890003',
          no_kk: '610901171110021',
          status_pernikahan: 'Kawin',
          no_nib: '2910210022444',
        };
      });

      setPetaniData(mockData);
      setTotalPetani(500); // Mock total count
    } catch (error) {
      toast.error('Gagal memuat data petani');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetaniData({
      page: currentPage,
      page_size: pageSize,
      search,
      kelompok: selectedKelompok,
      keanggotaan: selectedKeanggotaan,
    });
  }, [currentPage, pageSize, search, selectedKelompok, selectedKeanggotaan]);

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

  const handleKeanggotaanChange = (e) => {
    setSelectedKeanggotaan(e.target.value);
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
    router.push(`/petani/${data.id_petani}/detail`);
  };

  const handleDeleteClicked = (data) => {
    setSelectedPetaniToDelete(data);
    setShowModalConfirmDeletePetani(true);
  };

  const ActionsCellRenderer = useCallback((e) => {
    return (
      <div className="flex h-full w-full flex-row items-center justify-center gap-1 sm:gap-2">
        <div
          className="uppercase underline text-primary font-bold text-[10px] sm:text-[12px] cursor-pointer hover:text-primary/80"
          onClick={() => handleLihatClicked(e.data)}
        >
          LIHAT
        </div>
        <div
          className="uppercase underline text-red-500 font-bold text-[10px] sm:text-[12px] cursor-pointer hover:text-red-600"
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
        field: 'id_petani',
        headerName: 'Id Petani',
        flex: 1,
      },
      {
        field: 'nama_petani',
        headerName: 'Nama Petani',
        flex: 1,
      },
      {
        field: 'jenis_kelamin',
        headerName: 'Jenis Kelamin',
        flex: 1,
      },
      {
        field: 'kelompok',
        headerName: 'Kelompok',
        flex: 1,
      },
      {
        field: 'no_ktp',
        headerName: 'No. KTP',
        flex: 1,
      },
      {
        field: 'no_kk',
        headerName: 'No. KK',
        flex: 1,
      },
      {
        field: 'status_pernikahan',
        headerName: 'Status Pernikahan',
        flex: 1,
      },
      {
        field: 'no_nib',
        headerName: 'No. NIB',
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

  const handleDeletePetani = async () => {
    try {
      // TODO: Replace with real delete API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setShowModalConfirmDeletePetani(false);
      toast.success('Data petani berhasil dihapus');
      fetchPetaniData({
        page: currentPage,
        page_size: pageSize,
        search,
        kelompok: selectedKelompok,
        keanggotaan: selectedKeanggotaan,
      });
    } catch (error) {
      toast.error('Data petani gagal dihapus');
    }
  };

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <Heading level={2} className="text-lg sm:text-xl md:text-2xl">
              DATA PETANI
            </Heading>

            {/* Controls Container */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Search and Filters - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-center gap-2 w-full sm:w-auto">
                <SearchBar
                  onChange={handleSearchTextChange}
                  placeholder="Cari petani"
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
                  placeholder="Keanggotaan"
                  options={keanggotaanOptions}
                  value={selectedKeanggotaan}
                  onChange={handleKeanggotaanChange}
                />
              </div>

              {/* Action Buttons - Responsive */}
              <div className="flex flex-row items-center gap-2 justify-end">
                <Button
                  className="!px-2 sm:!px-3"
                  icon={<DownloadCloudIcon size={18} />}
                  title="Export Excel"
                  onClick={() => toast.info('Export Excel clicked')}
                />
                <Button
                  onClick={() => router.push('/petani/tambah-petani')}
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  Tambah Petani
                </Button>
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
            rowData={petaniData}
            columnDefs={colDefs}
          />
        </div>
        <div className="flex justify-center sm:justify-end">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalPetani}
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

      <ModalConfirmDeletePekebun
        open={showModalConfirmDeletePetani}
        setOpen={setShowModalConfirmDeletePetani}
        namaPekebun={selectedPetaniToDelete?.nama_petani}
        jumlahKebun={null}
        handleSubmit={handleDeletePetani}
      />
    </div>
  );
};

export default PetaniPage;
