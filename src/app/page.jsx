'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import debounce from 'lodash/debounce';
import { useDispatch } from 'react-redux';

import Checkbox from '@/components/atoms/Checkbox';
import Close from '@/components/atoms/Icons/Close';
import Statistic from '@/components/atoms/Icons/Statistic';
import STDBStatusChip from '@/components/atoms/STDBStatusChip';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import RadioButton from '@/components/molecules/RadioButton';
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import Select from '@/components/molecules/Select';
import SelectMultiple from '@/components/molecules/SelectMultiple';
import Pagination from '@/components/organisms/Pagination';
import pekebuns from '@/constants/pekebuns';
import useKecamatanSanggau from '@/hooks/useKecamatanSanggau';
import useKomoditas from '@/hooks/useKomoditas';
import useReferences from '@/hooks/useReferences';
import useStaticLayer from '@/hooks/useStaticLayer';
import useSTDB from '@/hooks/useSTDB';
import convertCoordToDMS from '@/libs/utils/convertCoordToDMS';
import { setStaticLayerDetail } from '@/store/slices/staticLayer';
import {
  setFilterKecamatan,
  setFilterKomoditas,
  setFilterSTDBStatus,
} from '@/store/slices/stdb';
import { Button } from '@/stories/Button';
import getPolygonCenter from '@/utils/getPolygonCenter';
import theme from '@/utils/tailwindTheme';

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
  const [selectedPekebun, setSelectedPekebun] = useState(pekebuns[0]);
  const [activeFilter, setActiveFilter] = useState('');
  const [activeTile, setActiveTile] = useState('osm');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchText, setSearchText] = useState('');

  const { komoditas } = useKomoditas();
  const { kecamatanSanggau } = useKecamatanSanggau();
  const {
    stdb,
    loading,
    filterKomoditas,
    filterKecamatan,
    totalSTDB,
    filterSTDBStatus,
    fetchSTDB,
  } = useSTDB({
    page_size: pageSize,
    page: currentPage,
    search: searchText,
  });
  const { stdbStatuses, fetchSTDBStatuses } = useReferences();
  const {
    staticLayerList,
    staticLayersDetail,
    fetchStaticLayerList,
    fetchStaticLayersDetail,
    loading: loadingDetailStaticLayer,
  } = useStaticLayer();

  const handleOnLihatClicked = (data) => {
    setShowTable(false);
    setSelectedPekebun(data);
  };

  const ActionsCellRenderer = useCallback(
    (e) => {
      return (
        <Button
          label="Lihat"
          size={'small'}
          onClick={() => handleOnLihatClicked(e.data)}
        />
      );
    },
    [stdb]
  );

  const STDBStatusCellRenderer = useCallback(
    (e) => {
      return (
        <STDBStatusChip
          value={e.data?.status_stdb}
          label={e.data?.status_stdb_label}
        />
      );
    },
    [stdb]
  );

  const PetaAvailabilityCellRenderer = useCallback(
    (e) => {
      console.log('Check ', e);
      return (
        <div
          className={` font-bold ${
            e.data?.peta?.geom?.coordinates ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {e.data?.peta?.geom?.coordinates ? 'Ada' : 'Belum Ada'}
        </div>
      );
    },
    [stdb]
  );

  const PetaDetailCellRenderer = (params) => {
    const handlePetaClick = () => {
      // Implement the logic to show the map or navigate to map view
      alert('PETA clicked for ID: ' + params.data.id);
    };

    const handleDetailClick = () => {
      // Implement the logic to show detail or navigate to detail page
      alert('DETAIL clicked for ID: ' + params.data.id);
    };

    return (
      <div className="flex gap-2">
        <button
          onClick={handlePetaClick}
          className="font-bold text-orange-600 underline"
        >
          PETA
        </button>
        <button
          onClick={handleDetailClick}
          className="font-bold text-blue-600 underline"
        >
          DETAIL
        </button>
      </div>
    );
  };

  const StatusCellRenderer = (params) => {
    const value = params.value;
    const isSudah = value?.toLowerCase() === 'sudah';
    return (
      <span
        className={
          isSudah
            ? 'font-semibold text-green-600'
            : 'font-semibold text-red-600'
        }
      >
        {value}
      </span>
    );
  };

  // Dummy data array to replace real data source for table display
  const dummyData = [
    {
      id: 'GR-001-002-001',
      pekebun: { nama: 'Akeng Rupinus' },
      kelompok: 'Bepekaek Besamo',
      lahan: {
        kecamatan_label: 'Dusun Gonis',
        desa_label: 'Rabu',
        luas_lahan: 7500,
      },
      peta: {
        titik_koordinat: { coordinates: [3.8717, 103.2533] },
      },
      waktu_tanam: 'September, 2014',
      rspo: 'Sudah',
      ispo: 'Sudah',
      legalitas: 'SHM',
    },
    {
      id: 'GR-001-002-002',
      pekebun: { nama: 'Budi Santoso' },
      kelompok: 'Bepekaek Besamo',
      lahan: {
        kecamatan_label: 'Dusun Gonis',
        desa_label: 'Rabu',
        luas_lahan: 8500,
      },
      peta: {
        titik_koordinat: { coordinates: [3.8718, 103.2534] },
      },
      waktu_tanam: 'October, 2015',
      rspo: 'Belum',
      ispo: 'Sudah',
      legalitas: 'SHM',
    },
    {
      id: 'GR-001-002-003',
      pekebun: { nama: 'Sari Dewi' },
      kelompok: 'Bepekaek Besamo',
      lahan: {
        kecamatan_label: 'Dusun Gonis',
        desa_label: 'Rabu',
        luas_lahan: 6500,
      },
      peta: {
        titik_koordinat: { coordinates: [3.8719, 103.2535] },
      },
      waktu_tanam: 'August, 2013',
      rspo: 'Sudah',
      ispo: 'Belum',
      legalitas: 'SHM',
    },
  ];

  const colDefs = [
    {
      headerName: '',
      field: 'actions',
      cellRenderer: PetaDetailCellRenderer,
      width: 120,
      pinned: 'left',
      suppressMenu: true,
      sortable: false,
      filter: false,
    },
    {
      field: 'peta.titik_koordinat.coordinates',
      headerName: 'Titik Koordinat',
      valueFormatter: (params) => {
        return convertCoordToDMS(params?.value?.[0], params?.value?.[1]);
      },
      width: 160,
    },
    { field: 'id', headerName: 'Id Kebun', width: 140 },
    { field: 'pekebun.nama', headerName: 'Petani', width: 160 },
    {
      headerName: 'Kelompok',
      field: 'kelompok',
      width: 160,
    },
    {
      headerName: 'Lokasi',
      field: 'lokasi',
      width: 200,
      valueGetter: (params) =>
        `${params.data?.lahan?.kecamatan_label || ''} ${
          params.data?.lahan?.desa_label || ''
        }`,
    },
    {
      headerName: 'Luas Kebun (Ha)',
      field: 'lahan.luas_lahan',
      width: 140,
      valueFormatter: (params) => {
        if (params.value == null) return '';
        const hectares = params.value / 10000;
        return hectares.toFixed(2);
      },
    },
    {
      headerName: 'Waktu Tanam',
      field: 'waktu_tanam',
      width: 140,
    },
    {
      headerName: 'RSPO',
      field: 'rspo',
      width: 100,
      cellRenderer: StatusCellRenderer,
    },
    {
      headerName: 'ISPO',
      field: 'ispo',
      width: 100,
      cellRenderer: StatusCellRenderer,
    },
    {
      headerName: 'Legalitas',
      field: 'legalitas',
      width: 100,
    },
  ];

  const autoSizeStrategy = useMemo(() => {
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

  const handleFilterKomoditasChange = (value, komoditas) => {
    let temp = [...filterKomoditas];
    if (value.target.checked) {
      temp.push(komoditas.value);
    } else {
      temp = filterKomoditas.filter((fk) => fk !== komoditas.value);
    }
    dispatch(setFilterKomoditas(temp));
  };

  const handleFilterKecamatanChange = (value, komoditas) => {
    let temp = [...filterKecamatan];
    if (value.target.checked) {
      temp.push(komoditas.value);
    } else {
      temp = filterKecamatan.filter((fk) => fk !== komoditas.value);
    }
    dispatch(setFilterKecamatan(temp));
  };

  const handleStaticLayerChange = (v, data) => {
    if (v.target.checked == true) {
      fetchStaticLayersDetail(data?.slug);
    } else {
      let tempStaticLayer = { ...staticLayersDetail };
      tempStaticLayer[data?.value] = null;
      dispatch(setStaticLayerDetail(tempStaticLayer));
    }
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
      setSearchText(e.target.value);
    }, 300),
    []
  );

  const handleFilterKomoditasMultipleSelectChange = useCallback(
    debounce((e) => {
      dispatch(setFilterKomoditas(e.target.value));
    }, 500),
    []
  );

  const handleFilterKecamatanMultipleSelectChange = useCallback(
    debounce((e) => {
      dispatch(setFilterKecamatan(e.target.value));
    }, 500),
    []
  );

  const handleFilterSTDBStatusChange = useCallback(
    debounce((e) => {
      dispatch(setFilterSTDBStatus(e.target.value));
    }, 500),
    []
  );

  useEffect(() => {
    fetchSTDBStatuses();
    fetchStaticLayerList();

    return () => {
      dispatch(setFilterSTDBStatus(''));
      dispatch(setFilterKomoditas([]));
      dispatch(setFilterKecamatan([]));
    };
  }, []);

  useEffect(() => {
    fetchSTDB();
  }, [
    pageSize,
    currentPage,
    searchText,
    filterKomoditas,
    filterKecamatan,
    filterSTDBStatus,
  ]);

  return (
    <div className="relative h-full w-full max-w-full overflow-x-hidden">
      <div className="relative max-h-[calc(100vh-72px)]">
        <Map
          highlightedPolygon={selectedPekebun?.peta?.geom?.coordinates}
          zoom={zoomMap}
          position={centerMap}
          data={stdb}
          activeDataId={selectedPekebun?.id}
          showCustomControls={true}
          onFilterChange={(filter) =>
            setActiveFilter(activeFilter == filter ? '' : filter)
          }
          activeFilter={activeFilter}
          tileLayer={activeTile}
          staticLayers={staticLayersDetail}
        />
        <div className="absolute right-4 top-4 z-[400]">
          <div
            onClick={() => setShowTable(!showTable)}
            className="flex flex-row items-center gap-2 rounded-[4px] border border-primary bg-white px-[10px] py-[10px] py-[10px] py-[10px]"
          >
            <Statistic color={theme.colors?.primary} />
            <Paragraph level={3} className="font-bold text-primary">
              Data Kebun
            </Paragraph>
          </div>
        </div>
        <div
          className={`border-gray absolute left-5 top-5 z-[1000] h-[calc(100%-40px)] max-h-[calc(100%-40px)] w-[calc(100%-40px)] overflow-y-scroll rounded-xl border bg-white p-4 duration-500 ease-in-out ${
            showTable ? 'translate-x-0' : 'left-[200px] translate-x-full'
          } xs:left-2 xs:top-2 xs:h-[calc(100%-16px)] xs:w-[calc(100%-16px)] xs:p-3`}
        >
          <div className="flex h-full flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              <Heading level={2}>Data Pekebun</Heading>
              <div className="flex flex-row items-center gap-8">
                <div className="flex flex-row items-center gap-2">
                  <SearchBar
                    placeholder="Cari Pekebun"
                    value={searchText}
                    onChange={handleSearchTextChange}
                    // onSearch={handleSearch}
                  />
                  {/* <Select containerClassName='w-[200px]' placeholder='Pilih Komoditas' options={komoditas} /> */}
                  <SelectMultiple
                    value={filterKomoditas}
                    onChange={handleFilterKomoditasMultipleSelectChange}
                    containerClassName="w-[200px]"
                    placeholder="Pilih Komoditas"
                    options={komoditas}
                  />
                  <SelectMultiple
                    value={filterKecamatan}
                    onChange={handleFilterKecamatanMultipleSelectChange}
                    containerClassName="w-[200px]"
                    placeholder="Pilih Kecamatan"
                    options={kecamatanSanggau}
                  />
                  <Select
                    value={filterSTDBStatus}
                    onChange={handleFilterSTDBStatusChange}
                    containerClassName="w-[200px]"
                    placeholder="Pilih STDB"
                    options={stdbStatuses}
                  />
                </div>
                <Close onClick={() => setShowTable(false)} />
              </div>
            </div>
            <div className="w-full flex-1">
              <SectionLoading loading={loading} />
              <AgGridReact
                loading={loading}
                autoSizeStrategy={autoSizeStrategy}
                rowData={dummyData}
                columnDefs={colDefs}
              />
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
        <div className="flex flex-col gap-2">
          {komoditas?.map((data) => {
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
        <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto p-4">
          {kecamatanSanggau?.map((data) => {
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
        <SectionLoading loading={loadingDetailStaticLayer} />
        <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto p-4">
          <div>
            <RadioButton
              labelClassName="text-[16px]"
              containerClassName="gap-2"
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
          <div className="w-full border-b" />
          {staticLayerList?.map((data) => {
            return (
              <Checkbox
                size={14}
                key={`komoditas-${data?.value}`}
                value={filterKomoditas?.includes(data?.value)}
                onChange={(v) => handleStaticLayerChange(v, data)}
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
