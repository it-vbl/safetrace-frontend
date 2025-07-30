'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useRouter } from 'next/navigation';
import Heading from '@/components/atoms/Typography/Heading';
import Close from '@/components/atoms/Icons/Close';
import Select from '@/components/molecules/Select';
import getPolygonCenter from '@/utils/getPolygonCenter';
import Checkbox from '@/components/atoms/Checkbox';
import SearchBar from '@/components/molecules/SearchBar';
import useKomoditas from '@/hooks/useKomoditas';
import useKecamatanSanggau from '@/hooks/useKecamatanSanggau';
import useSTDB from '@/hooks/useSTDB';
import usePekebuns from '@/hooks/usePekebuns';
import { useDispatch } from 'react-redux';
import { setFilterKomoditas } from '@/store/slices/stdb';
import useReferences from '@/hooks/useReferences';
import Button from '@/components/atoms/Button';
import Pagination from '@/components/organisms/Pagination';
import { DownloadCloudIcon } from 'lucide-react';
import debounce from 'lodash/debounce';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const ListVerifikasi = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showTable, setShowTable] = useState(false);

  const [rowData, setRowData] = useState([]);
  const [selectedPekebun, setSelectedPekebun] = useState<any>(null);

  const [search, setSearch] = useState('');

  //pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { stdb, filterKomoditas, listVerifikasi, fetchListVerifikasi } = useSTDB();
  const { pekebuns, totalPekebun, onPendataanPekebuns, fetchPekebunOnPendataan } = usePekebuns();

  useEffect(() => {
    fetchListVerifikasi({
      page: currentPage,
      page_size: pageSize,
      search: search,
    });
  }, [currentPage, pageSize, search]);

  const handleOnLihatClicked = (data: any) => {
    console.log('CHECK DATA VERIFIKASI', data);
    router.push(`/stdb/verifikasi/${data.stdb_id}/detail?pekebunId=${data.pekebun.id}`);
    setShowTable(false);
    setSelectedPekebun(data);
  };

  const ActionsCellRenderer = useCallback(
    (e: any) => {
      return (
        <div className='flex h-full w-full flex-row items-center justify-center gap-2'>
          <Button size={'extraSmall'} onClick={() => handleOnLihatClicked(e.data)}>
            Lihat
          </Button>
        </div>
      );
    },
    [rowData]
  );
  const colDefs: any = [
    {
      field: 'actions',
      headerName: '',
      cellRenderer: ActionsCellRenderer,
      width: 80,
    },
    { field: 'pekebun.nama', headerName: 'Pekebun' },
    { field: 'pekebun.nik', headerName: 'NIK' },
    { field: 'pekebun.id', headerName: 'ID Pekebun' },
    { field: 'jumlah_kebun', headerName: 'Jumlah Kebun' },
    { field: 'jumlah_dipetakan', headerName: 'Jumlah Dipetakan' },
    { field: 'total_luas_kebun', headerName: 'Total Luas(m2)' },
    { field: 'kecamatan_label', headerName: 'Kecamatan' },
    { field: 'desa_label', headerName: 'Desa' },
    { field: 'updated_at', headerName: 'Terakhir Update' },
    { field: 'desa_label', headerName: 'Pendata' },
  ];

  const autoSizeStrategy = useMemo<any>(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

  const centerMap = useMemo(() => {
    if (selectedPekebun?.geom?.coordinates) {
      return getPolygonCenter(selectedPekebun?.geom?.coordinates);
    }
    return [-0.5, 114.9];
  }, [selectedPekebun]);

  const zoomMap = 7;

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/organisms/MapView'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const handleFilterKomoditasChange = (value: any, komoditas: any) => {
    let temp = [...filterKomoditas];
    if (value.target.checked) {
      temp.push(komoditas.value);
    } else {
      temp = filterKomoditas.filter((fk: any) => fk !== komoditas.value);
    }
    dispatch(setFilterKomoditas(temp));
  };

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  const handleSearchTextChange = useCallback(
    debounce((e: any) => {
      setSearch(e.target.value);
    }, 300),
    []
  );

  return (
    <div className='relative max-h-[calc(100vh-72px)] w-full'>
      <div className='flex h-full flex-col gap-4'>
        <div className='flex flex-row items-center justify-between'>
          <Heading level={2}>Verifikasi</Heading>
          <div className='flex flex-row items-center gap-8'>
            <div className='flex flex-row items-center gap-2'>
              <SearchBar onChange={handleSearchTextChange} placeholder='Cari Pekebun' />
              <Button className='!px-3' icon={<DownloadCloudIcon size={20} />} />
            </div>
          </div>
        </div>
        <div className='w-full flex-1'>
          <AgGridReact autoSizeStrategy={autoSizeStrategy} rowData={listVerifikasi} columnDefs={colDefs} />
        </div>
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
        />
      </div>
    </div>
  );
};

export default ListVerifikasi;
