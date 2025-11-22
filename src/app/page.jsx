'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import debounce from 'lodash/debounce';
import { useDispatch } from 'react-redux';

import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import Statistic from '@/components/atoms/Icons/Statistic';
import STDBStatusChip from '@/components/atoms/STDBStatusChip';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import RadioButton from '@/components/molecules/RadioButton';
import SectionLoading from '@/components/molecules/SectionLoading';
import DataAlertDeforestasi from '@/components/organisms/DataAlertDeforestasi';
import DataPekebunTable from '@/components/organisms/DataPekebunTable';
import FilterSidebar from '@/components/organisms/MapView/FilterSidebar';
import RightSidebar from '@/components/organisms/MapView/RightSidebar';
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
  const [showAlertTable, setShowAlertTable] = useState(false);
  const [selectedPekebun, setSelectedPekebun] = useState(pekebuns[0]);
  const [activeFilter, setActiveFilter] = useState('');
  const [activeTile, setActiveTile] = useState('osm');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchText, setSearchText] = useState('');
  const [filterKelompok, setFilterKelompok] = useState('');
  const [filterRSPO, setFilterRSPO] = useState('');
  const [filterISPO, setFilterISPO] = useState('');
  const [filterLegalitas, setFilterLegalitas] = useState('');

  // Alert table states
  const [alertSearchText, setAlertSearchText] = useState('');
  const [alertCurrentPage, setAlertCurrentPage] = useState(1);
  const [alertPageSize, setAlertPageSize] = useState(10);
  const [filterAlertType, setFilterAlertType] = useState('');
  const [filterAlertKabupaten, setFilterAlertKabupaten] = useState('');
  const [filterAlertKecamatan, setFilterAlertKecamatan] = useState('');

  const rspoOptions = [
    { label: 'Sudah', value: 'sudah' },
    { label: 'Belum', value: 'belum' },
  ];

  const ispoOptions = [
    { label: 'Sudah', value: 'sudah' },
    { label: 'Belum', value: 'belum' },
  ];

  const alertTypeOptions = [
    { label: 'GLAD', value: 'glad' },
    { label: 'RADD', value: 'radd' },
    { label: 'UMD', value: 'umd' },
  ];

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
  const {
    stdbStatuses,
    kelompokTani,
    jenisLegalitas,
    fetchSTDBStatuses,
    fetchKelompokTani,
    fetchJenisLegalitas,
  } = useReferences();
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

    const coordinates = params.data?.peta?.titik_koordinat?.coordinates;
    const coordText = coordinates
      ? convertCoordToDMS(coordinates[0], coordinates[1])
      : '';
    const idKebun = params.data?.id || '';

    return (
      <div className="flex flex-col gap-1">
        <button
          onClick={handlePetaClick}
          className="font-bold text-orange-600 underline text-left"
        >
          PETA DETAIL
        </button>
        {coordText && <div className="text-sm text-gray-600">{coordText}</div>}
        {idKebun && <div className="text-sm text-gray-600">{idKebun}</div>}
      </div>
    );
  };

  const ResikoDeforestasiCellRenderer = (params) => {
    const value = params.value?.toLowerCase() || '';
    let chipClass = '';
    let displayText = params.value || '';

    if (value === 'rendah') {
      chipClass = 'bg-green-100 text-green-800 border-green-300';
    } else if (value === 'menengah') {
      chipClass = 'bg-orange-100 text-orange-800 border-orange-300';
    } else if (value === 'tinggi') {
      chipClass = 'bg-red-100 text-red-800 border-red-300';
    } else {
      chipClass = 'bg-gray-100 text-gray-800 border-gray-300';
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${chipClass}`}
      >
        {displayText}
      </span>
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

  // Alert table cell renderers
  const IdAlertCellRenderer = (params) => {
    const handleLihatClick = () => {
      // Implement the logic to show alert detail
      alert('LIHAT clicked for ID: ' + params.data.id_alert);
    };

    const idAlert = params.data?.id_alert || '';

    return (
      <div className="flex flex-col gap-1">
        <button
          onClick={handleLihatClick}
          className="font-bold text-blue-600 underline text-left"
        >
          LIHAT
        </button>
        {idAlert && <div className="text-sm text-gray-600">{idAlert}</div>}
      </div>
    );
  };

  // Dummy data for alert table
  const alertDummyData = [
    {
      id_alert: 'GR-001-002-001',
      lokasi_alert: { coordinates: [3.0883, 103.2533] },
      area_deforestasi: 0.5,
      tanggal_terdeteksi: '2025-11-10',
      alert_type: 'GLAD',
      kabupaten: 'Sanggau',
      kecamatan: 'Toba Hilir',
    },
    {
      id_alert: 'GR-001-002-002',
      lokasi_alert: { coordinates: [3.0884, 103.2534] },
      area_deforestasi: 0.3,
      tanggal_terdeteksi: '2025-11-09',
      alert_type: 'GLAD',
      kabupaten: 'Sanggau',
      kecamatan: 'Toba Hilir',
    },
    {
      id_alert: 'GR-001-002-003',
      lokasi_alert: { coordinates: [3.0885, 103.2535] },
      area_deforestasi: 0.7,
      tanggal_terdeteksi: '2025-11-08',
      alert_type: 'RADD',
      kabupaten: 'Sanggau',
      kecamatan: 'Toba Hilir',
    },
  ];

  // Alert table column definitions
  const alertColDefs = [
    {
      headerName: 'Id Alert',
      field: 'id_alert',
      cellRenderer: IdAlertCellRenderer,
      width: 180,
      pinned: 'left',
      suppressMenu: true,
      sortable: false,
      filter: false,
    },
    {
      headerName: 'Lokasi Alert',
      field: 'lokasi_alert.coordinates',
      valueFormatter: (params) => {
        if (!params?.value) return '';
        return convertCoordToDMS(params.value[0], params.value[1]);
      },
      width: 200,
    },
    {
      headerName: 'Area Deforestasi (Ha)',
      field: 'area_deforestasi',
      width: 180,
      valueFormatter: (params) => {
        if (params.value == null) return '';
        return params.value.toFixed(1);
      },
    },
    {
      headerName: 'Tanggal Terdeteksi',
      field: 'tanggal_terdeteksi',
      width: 160,
    },
    {
      headerName: 'Alert Type',
      field: 'alert_type',
      width: 120,
    },
    {
      headerName: 'Kabupaten',
      field: 'kabupaten',
      width: 140,
    },
    {
      headerName: 'Kecamatan',
      field: 'kecamatan',
      width: 160,
    },
  ];

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
      resiko_deforestasi: 'Menengah',
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
      resiko_deforestasi: 'Rendah',
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
      resiko_deforestasi: 'Tinggi',
    },
  ];

  const colDefs = [
    {
      headerName: 'Titik Koordinat',
      field: 'peta.titik_koordinat.coordinates',
      cellRenderer: PetaDetailCellRenderer,
      width: 200,
      pinned: 'left',
      suppressMenu: true,
      sortable: false,
      filter: false,
    },
    {
      headerName: 'Resiko Deforestasi',
      field: 'resiko_deforestasi',
      cellRenderer: ResikoDeforestasiCellRenderer,
      width: 160,
    },
    { field: 'pekebun.nama', headerName: 'Petani', width: 160 },
    {
      headerName: 'Kelompok',
      field: 'kelompok',
      width: 200,
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

  const handleFilterKelompokChange = useCallback(
    debounce((e) => {
      setFilterKelompok(e.target.value);
    }, 500),
    []
  );

  const handleFilterRSPOChange = useCallback(
    debounce((e) => {
      setFilterRSPO(e.target.value);
    }, 500),
    []
  );

  const handleFilterISPOChange = useCallback(
    debounce((e) => {
      setFilterISPO(e.target.value);
    }, 500),
    []
  );

  const handleFilterLegalitasChange = useCallback(
    debounce((e) => {
      setFilterLegalitas(e.target.value);
    }, 500),
    []
  );

  // Alert table handlers
  const handleAlertSearchTextChange = useCallback(
    debounce((e) => {
      setAlertSearchText(e.target.value);
    }, 300),
    []
  );

  const handleAlertPageChange = useCallback((newPage) => {
    setAlertCurrentPage(newPage);
  }, []);

  const handleAlertPageSizeChange = useCallback((newPageSize) => {
    setAlertPageSize(newPageSize);
    setAlertCurrentPage(1);
  }, []);

  const handleFilterAlertTypeChange = useCallback(
    debounce((e) => {
      setFilterAlertType(e.target.value);
    }, 500),
    []
  );

  const handleFilterAlertKabupatenChange = useCallback(
    debounce((e) => {
      setFilterAlertKabupaten(e.target.value);
    }, 500),
    []
  );

  const handleFilterAlertKecamatanChange = useCallback(
    debounce((e) => {
      setFilterAlertKecamatan(e.target.value);
    }, 500),
    []
  );

  useEffect(() => {
    fetchSTDBStatuses();
    fetchStaticLayerList();
    fetchKelompokTani();
    fetchJenisLegalitas();

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
    <div className="relative h-full w-full max-w-full max-h-full overflow-y-hidden overflow-x-hidden">
      <div className="relative max-h-[calc(100vh-72px)]">
        <FilterSidebar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          staticLayers={staticLayerList}
          activeStaticLayers={staticLayersDetail}
          onStaticLayerChange={(layer, value) => {
            handleStaticLayerChange({ target: { checked: value } }, layer);
          }}
          activeBasemap={activeTile}
          onBasemapChange={setActiveTile}
        />
        <RightSidebar />
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
        <DataPekebunTable
          showTable={showTable}
          onClose={() => {
            setShowTable(false);
          }}
          searchText={searchText}
          onSearchTextChange={handleSearchTextChange}
          filterKelompok={filterKelompok}
          onFilterKelompokChange={handleFilterKelompokChange}
          filterRSPO={filterRSPO}
          onFilterRSPOChange={handleFilterRSPOChange}
          filterISPO={filterISPO}
          onFilterISPOChange={handleFilterISPOChange}
          filterLegalitas={filterLegalitas}
          onFilterLegalitasChange={handleFilterLegalitasChange}
          kelompokOptions={kelompokTani}
          rspoOptions={rspoOptions}
          ispoOptions={ispoOptions}
          legalitasOptions={jenisLegalitas}
          loading={loading}
          rowData={dummyData}
          columnDefs={colDefs}
          autoSizeStrategy={autoSizeStrategy}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalSTDB}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
        <DataAlertDeforestasi
          showTable={showAlertTable}
          onClose={() => {
            setShowAlertTable(false);
          }}
          searchText={alertSearchText}
          onSearchTextChange={handleAlertSearchTextChange}
          filterAlertType={filterAlertType}
          onFilterAlertTypeChange={handleFilterAlertTypeChange}
          filterKabupaten={filterAlertKabupaten}
          onFilterKabupatenChange={handleFilterAlertKabupatenChange}
          filterKecamatan={filterAlertKecamatan}
          onFilterKecamatanChange={handleFilterAlertKecamatanChange}
          alertTypeOptions={alertTypeOptions}
          kabupatenOptions={kecamatanSanggau}
          kecamatanOptions={kecamatanSanggau}
          loading={false}
          rowData={alertDummyData}
          columnDefs={alertColDefs}
          autoSizeStrategy={autoSizeStrategy}
          currentPage={alertCurrentPage}
          pageSize={alertPageSize}
          totalItems={500}
          onPageChange={handleAlertPageChange}
          onPageSizeChange={handleAlertPageSizeChange}
        />
      </div>

      <div className="absolute left-1/2 bottom-0 z-[400] mx-auto -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-row items-center gap-2">
          <Button
            className="bg-white"
            variant="secondary"
            label=""
            onClick={() => {
              setShowAlertTable(!showAlertTable);
              if (!showAlertTable) {
                setShowTable(false);
              }
            }}
          >
            Data Alert
          </Button>
          <Button
            label=""
            onClick={() => {
              setShowTable(!showTable);
              if (!showTable) {
                setShowAlertTable(false);
              }
            }}
          >
            Data Kebun
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapDashboard;
