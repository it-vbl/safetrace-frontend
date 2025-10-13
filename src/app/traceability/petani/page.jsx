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
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import Select from '@/components/molecules/Select';
import Pagination from '@/components/organisms/Pagination';

import useReferences from '../../../hooks/useReferences';
import { deletePetani, getListPetani } from '../../../services/petani';

ModuleRegistry.registerModules([AllCommunityModule]);

const keanggotaanOptions = [
  { label: 'Aktif', value: true },
  { label: 'Tidak Aktif', value: false },
];

const PetaniPage = () => {
  const router = useRouter();

  const { kelompokTani, fetchKelompokTani } = useReferences();
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

  useEffect(() => {
    fetchKelompokTani();
  }, [fetchKelompokTani]);

  const kelompokOptions = useMemo(() => {
    return (
      kelompokTani?.map((item) => ({
        label: item.label,
        value: item.value,
      })) || []
    );
  }, [kelompokTani]);

  const fetchPetaniData = async ({
    page,
    page_size,
    search,
    keanggotaan,
    kelompok_tani,
  }) => {
    setLoading(true);
    try {
      const params = {
        page,
        page_size,
        ...(search && { search }),
        ...(keanggotaan !== null &&
          keanggotaan !== undefined && { keanggotaan }),
        ...(kelompok_tani && { kelompok_tani }),
      };

      const response = await getListPetani(params);

      if (response?.status === 200) {
        const data = response?.data?.data;
        const results = data?.results || [];

        const mapped = results.map((item) => ({
          id: item?.id,
          id_petani: item?.id_petani,
          nama_petani: item?.nama,
          jenis_kelamin:
            item?.jns_kelamin === '1'
              ? 'Laki - Laki'
              : item?.jns_kelamin === '2'
              ? 'Perempuan'
              : '-',
          kelompok: item?.nama_kelompok ?? '-',
          no_ktp: item?.no_ktp ?? '-',
          no_kk: item?.no_kk ?? '-',
          status_pernikahan:
            item?.status_perkawinan === '1'
              ? 'Belum Kawin'
              : item?.status_perkawinan === '2'
              ? 'Kawin'
              : '-',
          no_nib: item?.no_nib ?? '-',
        }));

        setPetaniData(mapped);
        setTotalPetani(Number(data?.count || 0));
      } else {
        setPetaniData([]);
        setTotalPetani(0);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal memuat data petani');
      setPetaniData([]);
      setTotalPetani(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetaniData({
      page: currentPage,
      page_size: pageSize,
      search,
      keanggotaan: selectedKeanggotaan,
      kelompok_tani: selectedKelompok,
    });
  }, [currentPage, pageSize, search, selectedKeanggotaan, selectedKelompok]);

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
    router.push(`/traceability/petani/${data.id}`);
  };

  const handleDeleteClicked = (data) => {
    setSelectedPetaniToDelete(data);
    setShowModalConfirmDeletePetani(true);
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
        <div
          className="cursor-pointer text-[10px] font-bold uppercase text-red-500 underline hover:text-red-600 sm:text-[12px]"
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
    if (!selectedPetaniToDelete?.id) {
      toast.error('ID petani tidak ditemukan');
      return;
    }

    try {
      const res = await deletePetani(selectedPetaniToDelete.id);
      if (
        res?.data?.status === 'success' ||
        res?.status === 200 ||
        res?.status === 204
      ) {
        toast.success('Data petani berhasil dihapus');
        setShowModalConfirmDeletePetani(false);
        fetchPetaniData({
          page: currentPage,
          page_size: pageSize,
          search,
        });
      } else {
        toast.error(res?.data?.message || 'Data petani gagal dihapus');
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Data petani gagal dihapus'
      );
    }
  };

  const handleDeleteCancel = () => {
    setShowModalConfirmDeletePetani(false);
    setSelectedPetaniToDelete(null);
  };

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          {/* Header Section */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <Heading level={2} className="text-lg sm:text-xl md:text-2xl">
              DATA PETANI
            </Heading>

            {/* Controls Container */}
            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              {/* Search and Filters - Responsive Grid */}
              <div className="grid w-full grid-cols-1 items-center gap-2 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-row">
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
              <div className="flex flex-row items-center justify-end gap-2">
                <Button
                  className="!px-2 sm:!px-3"
                  icon={<DownloadCloudIcon size={18} />}
                  title="Export Excel"
                />
                <Button
                  onClick={() => router.push('/traceability/petani/tambah')}
                  className="whitespace-nowrap text-xs sm:text-sm"
                >
                  Tambah Petani
                </Button>
              </div>
            </div>
          </div>

          {/* Table Container - Responsive Height */}
        </div>
        <div className="relative w-full flex-1 ">
          <SectionLoading loading={loading} />
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

      <DeleteConfirmationModal
        isOpen={showModalConfirmDeletePetani}
        onClose={handleDeleteCancel}
        onConfirm={handleDeletePetani}
        itemName={`petani dengan nama ${selectedPetaniToDelete?.nama_petani}`}
        isLoading={loading}
      />
    </div>
  );
};

export default PetaniPage;
