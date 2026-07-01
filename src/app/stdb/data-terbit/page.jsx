'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import debounce from 'lodash/debounce';
import { DownloadCloudIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import Select from '@/components/molecules/Select';
import Pagination from '@/components/organisms/Pagination';
import useReferences from '@/hooks/useReferences';
import useSTDB from '@/hooks/useSTDB';
import { getCurrentUserRoles, isDisbunak } from '@/libs/permissions';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const ListVerifikasi = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDisbunakUser = mounted ? isDisbunak(getCurrentUserRoles()) : false;

  const [search, setSearch] = useState('');
  const [selectedKomoditas, setSelectedKomoditas] = useState(null);

  //pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { listTerbit: stdbList, fetchTerbit, totalSTDB, loading } = useSTDB();

  useEffect(() => {
    fetchTerbit(
      `search=${search}&page=${currentPage}&page_size=${pageSize}${
        selectedKomoditas ? `&komoditas=${selectedKomoditas}` : ''
      }`
    );
  }, [currentPage, pageSize, search, selectedKomoditas]);

  const handleOnLihatClicked = (data) => {
    router.push(`/stdb/data-terbit/${data.stdb_id}/detail?pekebunId=${data.pekebun.id}`);
  };

  const ActionsCellRenderer = useCallback((e) => {
    return (
      <div className='flex h-full w-full flex-row items-center justify-center gap-2'>
        <div 
            className='uppercase underline text-primary font-bold text-[12px] cursor-pointer' 
            onClick={() => handleOnLihatClicked(e.data)}
          >
            Lihat
          </div>
      </div>
    );
  }, []);
  const colDefs = [
    {
      field: 'actions',
      headerName: '',
      cellRenderer: ActionsCellRenderer,
      width: 80,
      pinned: 'left',
    },
    { field: 'pekebun.nama', headerName: 'Pekebun' },
    { field: 'pekebun.nik', headerName: 'NIK' },
    { field: 'pekebun.id', headerName: 'ID Pekebun' },
    { field: 'jumlah_kebun', headerName: 'Jumlah Kebun' },
    { field: 'jumlah_dipetakan', headerName: 'Jumlah Dipetakan' },
    { field: 'total_luas_kebun', headerName: 'Total Luas(m2)' },
    { field: 'kecamatan_label', headerName: 'Kecamatan' },
    { field: 'desa_label', headerName: 'Desa/Kelurahan' },
    { field: 'updated_at', headerName: 'Terakhir Update' },
  ];

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

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

  const handleKomoditasChange = useCallback((e) => {
    dispatch(setFilterKomoditas(e.target.value));
    setSelectedKomoditas(e.target.value);
  }, []);

  return (
    <div className='relative max-h-[calc(100vh-72px)] w-full'>
      <div className='flex h-full flex-col gap-4'>
        <div className='flex flex-row items-center justify-between'>
          <Heading className='uppercase tracking-[2px]' level={4}>
            Data Terbit
          </Heading>
          <div className='flex flex-row items-center gap-8'>
            <div className='flex flex-row items-center gap-2'>
              <SearchBar className='w-full' onChange={handleSearchTextChange} placeholder='Cari Pekebun' />
              <Select
                value={selectedKomoditas}
                onChange={handleKomoditasChange}
                options={[]}
                placeholder='Semua Komoditas'
              />
              {!isDisbunakUser && (
                <Button className='!px-3' icon={<DownloadCloudIcon size={20} />} />
              )}
            </div>
          </div>
        </div>
        <div className='relative w-full flex-1'>
          <SectionLoading loading={loading} />
          <AgGridReact
            loadingOverlayComponent={null}
            overlayLoadingTemplate='.'
            loading={loading}
            autoSizeStrategy={autoSizeStrategy}
            rowData={stdbList}
            columnDefs={colDefs}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalSTDB}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showRowsPerPage={true}
          labels={{
            rowsPerPage: 'Baris Per Halaman',
            showing: 'Menampilkan',
            of: 'dari',
          }}
        />
      </div>
    </div>
  );
};

export default ListVerifikasi;
