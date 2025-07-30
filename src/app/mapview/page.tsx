'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Statistic from '@/components/atoms/Icons/Statistic';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import theme from '@/utils/tailwindTheme';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Button } from '@/stories/Button';
import Heading from '@/components/atoms/Typography/Heading';
import Close from '@/components/atoms/Icons/Close';
import Select from '@/components/molecules/Select';
import pekebuns from '@/constants/pekebuns';
import getPolygonCenter from '@/utils/getPolygonCenter';
import Checkbox from '@/components/atoms/Checkbox';
import SearchBar from '@/components/molecules/SearchBar';
import useKomoditas from '@/hooks/useKomoditas';
import useKecamatanSanggau from '@/hooks/useKecamatanSanggau';
import useSTDB from '@/hooks/useSTDB';
import { useDispatch } from 'react-redux';
import { setFilterKecamatan, setFilterKomoditas, setFilterSTDBStatus } from '@/store/slices/stdb';
import useReferences from '@/hooks/useReferences';
import Pagination from '@/components/organisms/Pagination';
import convertCoordToDMS from '@/libs/utils/convertCoordToDMS';
import debounce from 'lodash/debounce';
import SelectMultiple from '@/components/molecules/SelectMultiple';
import RadioButton from '@/components/molecules/RadioButton';
import STDBStatusChip from '@/components/atoms/STDBStatusChip';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const layerFilter = [
  { label: 'Peta IUP', value: 'peta-iup' },
  { label: 'Batas Desa', value: 'batas-desa' },
  { label: 'Batas Kecamatan', value: 'batas-kecamatan' },
  { label: 'Kawasan Hutan', value: 'kawasan-hutan' },
];

const MapDashboard = () => {
  const dispatch = useDispatch();
  const [showTable, setShowTable] = useState(false);
  const [rowData, setRowData] = useState(pekebuns);
  const [selectedPekebun, setSelectedPekebun] = useState<any>(pekebuns[0]);
  const [activeFilter, setActiveFilter] = useState('');
  const [activeTile, setActiveTile] = useState('osm');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchText, setSearchText] = useState('');

  const { komoditas } = useKomoditas();
  const { kecamatanSanggau } = useKecamatanSanggau();
  const { stdb, filterKomoditas, filterKecamatan, totalSTDB, filterSTDBStatus } = useSTDB({
    page_size: pageSize,
    page: currentPage,
    search: searchText,
  });
  const { stdbStatuses, fetchSTDBStatuses } = useReferences();

  const handleOnLihatClicked = (data: any) => {
    setShowTable(false);
    setSelectedPekebun(data);
  };

  const ActionsCellRenderer = useCallback(
    (e: any) => {
      return <Button label='Lihat' size={'small'} onClick={() => handleOnLihatClicked(e.data)} />;
    },
    [rowData]
  );

  const STDBStatusCellRenderer = useCallback(
    (e: any) => {
      return <STDBStatusChip value={e.data?.status_stdb} label={e.data?.status_stdb_label} />;
    },
    [rowData]
  );

  const colDefs: any = [
    {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: ActionsCellRenderer,
    },
    { field: 'id', headerName: 'ID Kebun' },
    {
      field: 'peta.titik_koordinat.coordinates',
      headerName: 'Titik Koordinat',
      valueFormatter: (params: any) => {
        return convertCoordToDMS(params?.value?.[0], params?.value?.[1]);
      },
    },
    { field: 'pekebun.user.username', headerName: 'Nama Pemilik' },
    { field: 'komoditas_info', headerName: 'Komoditas' },
    { field: 'lahan.luas_lahan', headerName: 'Luas Lahan(m2)' },
    { field: 'lahan.kecamatan_label', headerName: 'Kecamatan' },
    { field: 'lahan.desa_label', headerName: 'Kelurahan' },
    { field: 'lahan.data_peta', headerName: 'Data Peta' },
    { field: 'pekebun.name', headerName: 'Pekebun' },
    { field: 'status_stdb_label', headerName: 'STDB', cellRenderer: STDBStatusCellRenderer },
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

  const handleFilterKecamatanChange = (value: any, komoditas: any) => {
    let temp = [...filterKecamatan];
    if (value.target.checked) {
      temp.push(komoditas.value);
    } else {
      temp = filterKecamatan.filter((fk: any) => fk !== komoditas.value);
    }
    dispatch(setFilterKecamatan(temp));
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
      setSearchText(e.target.value);
    }, 300),
    []
  );

  const handleSearch = useCallback(
    async (newText: string) => {
      const newSTDB = await useSTDB({ search: newText, page_size: pageSize, page: currentPage });
      setRowData(newSTDB);
    },
    [currentPage, pageSize]
  );

  const handleFilterSTDBStatusChange = (e) => {
    dispatch(setFilterSTDBStatus(e.target.value));
  };

  useEffect(() => {
    fetchSTDBStatuses();
  }, []);

  return (
    <div className=' h-full w-full'>
      <div className='relative max-h-[calc(100vh-72px)]'>
        <Map
          highlightedPolygon={selectedPekebun?.peta?.geom?.coordinates}
          zoom={zoomMap}
          position={centerMap}
          data={stdb}
          activeDataId={selectedPekebun?.id}
          showCustomControls={true}
          onFilterChange={(filter) => setActiveFilter(activeFilter == filter ? '' : filter)}
          activeFilter={activeFilter}
          tileLayer={activeTile}
        />
        <div className='absolute right-4 top-4 z-[400]'>
          <div
            onClick={() => setShowTable(!showTable)}
            className='flex flex-row items-center gap-2 rounded-[4px] border border-primary bg-white px-[10px] py-[10px] py-[10px] py-[10px]'
          >
            <Statistic color={theme.colors?.primary} />
            <Paragraph level={3} className='font-bold text-primary'>
              Data Pekebun
            </Paragraph>
          </div>
        </div>
        <div
          className={`border-gray absolute left-5 top-5 z-[1000] h-[calc(100%-40px)] max-h-[calc(100%-40px)] w-[calc(100%-40px)] overflow-y-scroll rounded-xl border bg-white p-4 duration-500 ease-in-out ${
            showTable ? 'translate-x-0' : 'left-[200px] translate-x-full'
          }`}
        >
          <div className='flex h-full flex-col gap-4'>
            <div className='flex flex-row items-center justify-between'>
              <Heading level={2}>Data Pekebun</Heading>
              <div className='flex flex-row items-center gap-8'>
                <div className='flex flex-row items-center gap-2'>
                  <SearchBar
                    placeholder='Cari Pekebun'
                    value={searchText}
                    onChange={handleSearchTextChange}
                    onSearch={handleSearch}
                  />
                  {/* <Select containerClassName='w-[200px]' placeholder='Pilih Komoditas' options={komoditas} /> */}
                  <SelectMultiple
                    value={filterKomoditas}
                    containerClassName='w-[200px]'
                    placeholder='Pilih Komoditas'
                    options={komoditas}
                  />
                  <SelectMultiple
                    value={filterKecamatan}
                    containerClassName='w-[200px]'
                    placeholder='Pilih Kecamatan'
                    options={kecamatanSanggau}
                  />
                  <Select
                    value={filterSTDBStatus}
                    onChange={handleFilterSTDBStatusChange}
                    containerClassName='w-[200px]'
                    placeholder='Pilih STDB'
                    options={stdbStatuses}
                  />
                </div>
                <Close onClick={() => setShowTable(false)} />
              </div>
            </div>
            <div className='w-full flex-1'>
              <AgGridReact autoSizeStrategy={autoSizeStrategy} rowData={stdb} columnDefs={colDefs} />
            </div>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalSTDB}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[5, 10, 20, 50, 100]}
              showRowsPerPage={true}
              labels={{
                rowsPerPage: 'Baris Per Halaman',
                showing: 'Menampilkan',
                of: 'dari',
              }}
            />
          </div>
        </div>
      </div>
      <div
        className={`absolute left-[52px] top-[calc(72px+9px)] z-[400] rounded-[4px] border-[2px] border-black50/60 bg-white p-4 transition-all duration-300 ${
          activeFilter === 'komoditas' ? 'translate-x-0' : '-translate-x-[200%]'
        }`}
      >
        <div className='flex flex-col gap-2'>
          {komoditas?.map((data: any) => {
            return (
              <Checkbox
                size={14}
                key={`komoditas-${data?.value}`}
                value={filterKomoditas?.includes(data?.value)}
                onChange={(v) => handleFilterKomoditasChange(v, data)}
                label={data?.label}
              />
            );
          })}
        </div>
      </div>
      <div
        className={`absolute left-[52px] top-[calc(72px+9px)] z-[400] rounded-[4px] border-[2px] border-black50/60 bg-white  transition-all duration-300 ${
          activeFilter === 'kecamatan' ? 'translate-x-0' : '-translate-x-[200%]'
        }`}
      >
        <div className='flex max-h-[50vh] flex-col gap-2 overflow-y-auto p-4'>
          {kecamatanSanggau?.map((data: any) => {
            return (
              <Checkbox
                size={14}
                key={`kecamatan-${data?.value}`}
                value={filterKecamatan?.includes(data?.value)}
                onChange={(v) => handleFilterKecamatanChange(v, data)}
                label={data?.label}
              />
            );
          })}
        </div>
      </div>
      <div
        className={`absolute left-[52px] top-[calc(72px+9px)] z-[400] rounded-[4px] border-[2px] border-black50/60 bg-white  transition-all duration-300 ${
          activeFilter === 'tilelayer' ? 'translate-x-0' : '-translate-x-[200%]'
        }`}
      >
        <div className='flex max-h-[50vh] flex-col gap-2 overflow-y-auto p-4'>
          <div>
            <RadioButton
              labelClassName='text-[16px]'
              containerClassName='gap-2'
              value={activeTile}
              onChangeValue={(e) => setActiveTile(e)}
              options={[
                { label: 'Open Street Map', value: 'osm' },
                { label: 'Light Map', value: 'light' },
                { label: 'Dark Map', value: 'dark' },
                { label: 'Satellite Map', value: 'satellite' },
              ]}
            />
          </div>
          <div className='w-full border-b' />
          {layerFilter?.map((data: any) => {
            return (
              <Checkbox
                size={14}
                key={`komoditas-${data?.value}`}
                value={filterKomoditas?.includes(data?.value)}
                onChange={(v) => handleFilterKomoditasChange(v, data)}
                label={data?.label}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MapDashboard;
