'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import debounce from 'lodash/debounce';
import { DownloadCloudIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import Select from '@/components/molecules/Select';
import ModalConfirmDeletePekebun from '@/components/organisms/Modal/ModalConfirmDeletePekebun';
import Pagination from '@/components/organisms/Pagination';
import useKecamatanSanggau from '@/hooks/useKecamatanSanggau';
import useKomoditas from '@/hooks/useKomoditas';
import usePekebuns from '@/hooks/usePekebuns';
import useSTDB from '@/hooks/useSTDB';
import { deletePekebun } from '@/services/pekebun';
import { setFilterKomoditas } from '@/store/slices/stdb';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const MapDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showModalConfirmDeletePekebun, setShowModalConfirmDeletePekebun] =
    useState(false);
  const [selectedPekebunToDelete, setSelectedPekebunToDelete] = useState(false);

  const [search, setSearch] = useState('');
  //pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { komoditas } = useKomoditas();
  const { kecamatanSanggau } = useKecamatanSanggau();
  const { stdb, filterKomoditas } = useSTDB();
  const {
    loading,
    onPendataanPekebuns,
    fetchPekebunOnPendataan,
    totalPekebun,
  } = usePekebuns();

  const [selectedKomoditas, setSelectedKomoditas] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);

  useEffect(() => {
    fetchPekebunOnPendataan({
      page: currentPage,
      page_size: pageSize,
      search: search,
      komoditas: selectedKomoditas,
      kecamatan: selectedKecamatan,
    });
  }, [currentPage, pageSize, search, selectedKomoditas, selectedKecamatan]);

  const handleOnLihatClicked = (data) => {
    router.push(`/stdb/pendataan/${data.pekebun.id}/detail`);
  };

  const handleOnDeleteClicked = (data) => {
    setSelectedPekebunToDelete(data);
    setShowModalConfirmDeletePekebun(true);
  };

  const ActionsCellRenderer = useCallback(
    (e) => {
      return (
        <div className="flex h-full w-full flex-row items-center justify-center gap-1 sm:gap-2">
          <div
            className="uppercase underline text-primary font-bold text-[10px] sm:text-[12px] cursor-pointer hover:text-primary/80"
            onClick={() => handleOnLihatClicked(e.data)}
          >
            Lihat
          </div>
          <div
            className="uppercase underline text-red-500 font-bold text-[10px] sm:text-[12px] cursor-pointer hover:text-red-600"
            onClick={() => handleOnDeleteClicked(e.data)}
          >
            Hapus
          </div>
        </div>
      );
    },
    [stdb]
  );

  const colDefs = [
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
      field: 'pekebun.nama',
      headerName: 'Pekebun',
    },
    {
      field: 'pekebun.nik',
      headerName: 'NIK',
    },
    {
      field: 'pekebun.id',
      headerName: 'ID Pekebun',
    },
    {
      field: 'jumlah_kebun',
      headerName: 'Jumlah Kebun',
    },
    {
      field: 'jumlah_dipetakan',
      headerName: 'Jumlah Dipetakan',
    },
    {
      field: 'total_luas_kebun',
      headerName: 'Total Luas(m2)',
    },
    {
      field: 'kecamatan_label',
      headerName: 'Kecamatan',
    },
    {
      field: 'desa_label',
      headerName: 'Desa',
    },
    {
      field: 'updated_at',
      headerName: 'Terakhir Update',
    },
    {
      field: 'desa_label',
      headerName: 'Pendata',
    },
  ];

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

  const handleFilterKomoditasChange = (value) => {
    setCurrentPage(1);
    setSelectedKomoditas(value);
  };

  const handleFilterKecamatanChange = (value) => {
    setCurrentPage(1);
    setSelectedKecamatan(value);
  };

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  const handleSearchTextChange = useCallback(
    debounce((e) => {
      setSearch(e.target.value);
    }, 300),
    []
  );

  const handleDeletePekebun = async () => {
    try {
      const res = await deletePekebun(selectedPekebunToDelete?.id);
      if (res.status == 200) {
        setShowModalConfirmDeletePekebun(false);
        fetchPekebunOnPendataan({
          page: currentPage,
          page_size: pageSize,
          search: search,
        });
        toast.success('Data pekebun berhasil dihapus');
      }
    } catch (err) {
      toast.error('Data pekebun gagal dihapus');
    }

    return true;
  };

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <Heading level={2} className="text-lg sm:text-xl md:text-2xl">
              Pendataan
            </Heading>

            {/* Controls Container */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Search and Filters - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-center gap-2 w-full sm:w-auto">
                <SearchBar
                  onChange={handleSearchTextChange}
                  placeholder="Cari Pekebun"
                  className="w-full sm:w-auto lg:w-[200px]"
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[180px]"
                  placeholder="Pilih Komoditas"
                  options={komoditas}
                  value={selectedKomoditas}
                  onChange={(e) => handleFilterKomoditasChange(e.target.value)}
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[180px]"
                  placeholder="Pilih Kecamatan"
                  options={kecamatanSanggau}
                  value={selectedKecamatan}
                  onChange={(e) => handleFilterKecamatanChange(e.target.value)}
                />
              </div>

              {/* Action Buttons - Responsive */}
              <div className="flex flex-row items-center gap-2 justify-end">
                <Button
                  className="!px-2 sm:!px-3"
                  icon={<DownloadCloudIcon size={18} />}
                  title="Download"
                />
                <Button
                  onClick={() => router.push(`/stdb/pendataan/tambah-pekebun`)}
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  Tambah Pekebun
                </Button>
              </div>
            </div>
          </div>

          {/* Table Container - Responsive Height */}

          {/* Pagination - Responsive */}
        </div>
        <div className="relative w-full flex-1 ">
          <SectionLoading loading={loading} />
          <AgGridReact
            loading={loading}
            overlayLoadingTemplate="."
            autoSizeStrategy={autoSizeStrategy}
            rowData={onPendataanPekebuns}
            columnDefs={colDefs}
          />
        </div>
        <div className="flex justify-center sm:justify-end">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalPekebun}
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
        open={showModalConfirmDeletePekebun}
        setOpen={setShowModalConfirmDeletePekebun}
        namaPekebun={selectedPekebunToDelete?.pekebun?.nama}
        jumlahKebun={selectedPekebunToDelete?.jumlah_kebun}
        handleSubmit={handleDeletePekebun}
      />
    </div>
  );
};

export default MapDashboard;
