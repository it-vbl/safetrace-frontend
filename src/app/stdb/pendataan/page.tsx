'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useRouter } from 'next/navigation';
import Heading from '@/components/atoms/Typography/Heading';
import Select from '@/components/molecules/Select';
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
import debounce from 'lodash/debounce';
import ModalConfirmDeletePekebun from '@/components/organisms/Modal/ModalConfirmDeletePekebun';
import { deletePekebun } from '@/services/pekebun';
import { toast } from 'react-toastify';
import { DownloadCloudIcon } from 'lucide-react';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const MapDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showTable, setShowTable] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedPekebun, setSelectedPekebun] = useState<any>(null);
  const [showModalConfirmDeletePekebun, setShowModalConfirmDeletePekebun] = useState(false);
  const [selectedPekebunToDelete, setSelectedPekebunToDelete] = useState(false);

  const [search, setSearch] = useState('');
  //pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { komoditas } = useKomoditas();
  const { kecamatanSanggau } = useKecamatanSanggau();
  const { stdb, filterKomoditas } = useSTDB();
  const { stdbStatuses } = useReferences();
  const { loading, onPendataanPekebuns, fetchPekebunOnPendataan, totalPekebun } = usePekebuns();

  useEffect(() => {
    fetchPekebunOnPendataan({
      page: currentPage,
      page_size: pageSize,
      search: search,
    });
  }, [currentPage, pageSize, search]);

  /**
   * Handles when the user clicks on the "Lihat" button on the table row.
   * This will navigate the user to the detail page of the selected pekebun.
   * @param {object} data - The data of the selected pekebun.
   */
  const handleOnLihatClicked = (data: any) => {
    router.push(`/stdb/pendataan/${data.pekebun.id}/detail`);
    setShowTable(false);
    setSelectedPekebun(data);
  };

  const handleOnLihatClickedDelete = (data: any) => {
    setSelectedPekebunToDelete(data);
    setShowModalConfirmDeletePekebun(true);
  };

  const ActionsCellRenderer = useCallback(
    (e: any) => {
      return (
        <div className='flex h-full w-full flex-row items-center justify-center gap-2'>
          <Button size={'extraSmall'} onClick={() => handleOnLihatClicked(e.data)}>
            Lihat
          </Button>
          <Button variant={'danger'} size={'extraSmall'} onClick={() => handleOnLihatClickedDelete(e.data)}>
            Hapus
          </Button>
        </div>
      );
    },
    [rowData]
  );
  const colDefs: any = [
    {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: ActionsCellRenderer,
      width: 164,
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
    <div className='relative max-h-[calc(100vh-72px)] w-full'>
      <div className='flex h-full flex-col gap-4'>
        <div className='flex flex-row items-center justify-between'>
          <Heading level={2}>Pendataan</Heading>
          <div className='flex flex-row items-center gap-8'>
            <div className='flex flex-row items-center gap-2'>
              <SearchBar onChange={handleSearchTextChange} placeholder='Cari Pekebun' />
              <Select containerClassName='w-[200px]' placeholder='Pilih Komoditas' options={komoditas} />
              <Select containerClassName='w-[200px]' placeholder='Pilih Kecamatan' options={kecamatanSanggau} />
              <Button className='!px-3' icon={<DownloadCloudIcon size={20} />} />
              <Button onClick={() => router.push(`/stdb/pendataan/tambah-pekebun`)}>Tambah Pekebun</Button>
            </div>
          </div>
        </div>
        <div className='w-full flex-1'>
          <AgGridReact
            loading={loading}
            autoSizeStrategy={autoSizeStrategy}
            rowData={onPendataanPekebuns}
            columnDefs={colDefs}
          />
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
