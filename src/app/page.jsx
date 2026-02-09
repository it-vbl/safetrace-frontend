'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';
import { useDispatch } from 'react-redux';

import Button from '@/components/atoms/Button';
import SectionLoading from '@/components/molecules/SectionLoading';
import DataAlertDeforestasi from '@/components/organisms/DataAlertDeforestasi';
import DataPekebunTable from '@/components/organisms/DataPekebunTable';
import FilterSidebar from '@/components/organisms/MapView/FilterSidebar';
import RightSidebar from '@/components/organisms/MapView/RightSidebar';
import pekebuns from '@/constants/pekebuns';
import useKebun from '@/hooks/useKebun';
import useKecamatanSanggau from '@/hooks/useKecamatanSanggau';
import useKomoditas from '@/hooks/useKomoditas';
import useReferences from '@/hooks/useReferences';
import useStaticLayer from '@/hooks/useStaticLayer';
import useSTDB from '@/hooks/useSTDB';
import { getCurrentUserRoles, hasPermission } from '@/libs/permissions';
import convertCoordToDMS from '@/libs/utils/convertCoordToDMS';
import {
  getPetaOverlayDetail,
  getPetaOverlayList,
} from '@/services/petaOverlay';
import { setStaticLayerDetail } from '@/store/slices/staticLayer';
import {
  setFilterKecamatan,
  setFilterKomoditas,
  setFilterSTDBStatus,
} from '@/store/slices/stdb';
import getPolygonCenter from '@/utils/getPolygonCenter';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
const MapDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roles, setRoles] = useState([]);
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showAlertTable, setShowAlertTable] = useState(false);
  const [selectedPekebun, setSelectedPekebun] = useState(pekebuns[0]);
  const [activeFilter, setActiveFilter] = useState('');
  const [activeTile, setActiveTile] = useState('osm');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const [petaOverlays, setPetaOverlays] = useState([]);
  const [activePetaOverlays, setActivePetaOverlays] = useState({});
  const [loadingPetaOverlays, setLoadingPetaOverlays] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchText, setSearchText] = useState('');
  const [filterKelompok, setFilterKelompok] = useState('');
  const [filterRSPO, setFilterRSPO] = useState('');
  const [filterISPO, setFilterISPO] = useState('');
  const [filterLegalitas, setFilterLegalitas] = useState('');
  const [filterPetaniId, setFilterPetaniId] = useState('');

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
    loading,
    filterKomoditas,
    filterKecamatan,
    totalSTDB,
    filterSTDBStatus,
  } = useSTDB({
    page_size: pageSize,
    page: currentPage,
    search: searchText,
  });
  const petaniIdFromUrl = searchParams.get('petani_id');
  const {
    kebunList,
    loading: loadingKebun,
    totalKebun,
    fetchKebun,
    transformKebunForTable,
    transformKebunForMap,
  } = useKebun({
    page_size: pageSize,
    page: currentPage,
    search: searchText,
    kelompok: filterKelompok,
    rspo: filterRSPO,
    ispo: filterISPO,
    legalitas: filterLegalitas,
    petani_id: filterPetaniId || petaniIdFromUrl || '',
    start_date: dateRange.startDate || '',
    end_date: dateRange.endDate || '',
  });
  const {
    kelompokTani,
    jenisLegalitas,
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

  useEffect(() => {
    const currentRoles = getCurrentUserRoles();
    setRoles(currentRoles);
    setRolesLoaded(true);
  }, []);

  const canViewMap = useMemo(
    () => hasPermission(roles, 'peta.dashboard'),
    [roles]
  );

  const PetaDetailCellRenderer = (params) => {
    const handlePetaClick = () => {
      const idKebun = params.data?.id;
      console.log('CHECK idKEbun');
      if (idKebun) {
        // Find the original kebun data and transform it for map
        const originalKebun = kebunList.find((k) => k.id === idKebun);
        if (originalKebun) {
          const mapData = transformKebunForMap([originalKebun])[0];
          // Close the modal
          setShowTable(false);
          // Set selected kebun to highlight it on the map
          setSelectedPekebun(mapData);
        }
      }
    };

    const handleDetailClick = () => {
      const idKebun = params.data?.id;
      if (idKebun) {
        router.push(`/traceability/kebun/${idKebun}/detail`);
      }
    };

    return (
      <div className="flex flex-row gap-2">
        <button
          onClick={handlePetaClick}
          className="font-bold text-orange-600 underline text-left hover:text-orange-700 transition-colors"
        >
          PETA
        </button>
        <button
          onClick={handleDetailClick}
          className="font-bold text-blue-600 underline text-left hover:text-blue-700 transition-colors"
        >
          DETAIL
        </button>
      </div>
    );
  };

  const ResikoDeforestasiCellRenderer = (params) => {
    const risikoValue = params.data?.risiko_deforestasi || params.value || '';

    // Map API values to display text
    let displayText = '-';
    let chipClass = 'bg-gray-100 text-gray-800 border-gray-300';

    if (risikoValue) {
      const lowerValue = risikoValue.toLowerCase();
      if (lowerValue === 'low') {
        displayText = 'Rendah';
        chipClass = 'bg-green-100 text-green-800 border-green-300';
      } else if (lowerValue === 'medium') {
        displayText = 'Menengah';
        chipClass = 'bg-orange-100 text-orange-800 border-orange-300';
      } else if (lowerValue === 'high') {
        displayText = 'Tinggi';
        chipClass = 'bg-red-100 text-red-800 border-red-300';
      } else {
        // If value doesn't match expected values, show as-is
        displayText = risikoValue;
        chipClass = 'bg-gray-100 text-gray-800 border-gray-300';
      }
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

  // Transform kebun data for table display
  const kebunTableData = useMemo(() => {
    return transformKebunForTable(kebunList);
  }, [kebunList]);

  // Get petani name from kebunList when filterPetaniId or petaniIdFromUrl is set
  const petaniName = useMemo(() => {
    const activePetaniId = filterPetaniId || petaniIdFromUrl;
    if (activePetaniId && kebunList.length > 0) {
      const firstKebun = kebunList[0];
      return firstKebun?.nama_petani || '';
    }
    return '';
  }, [filterPetaniId, petaniIdFromUrl, kebunList]);

  // Transform kebun data for map display
  const kebunMapData = useMemo(() => {
    return transformKebunForMap(kebunList);
  }, [kebunList]);

  const colDefs = [
    {
      headerName: '',
      field: 'peta.titik_koordinat.coordinates',
      cellRenderer: PetaDetailCellRenderer,
      width: 128,
      pinned: 'left',
      suppressMenu: true,
      sortable: false,
      filter: false,
    },
    {
      headerName: 'Titik Koordinat',
      field: 'peta.titik_koordinat.coordinates',
      valueFormatter: (params) => {
        if (params.value == null) return '-';
        return convertCoordToDMS(params.value[0], params.value[1]);
      },
      width: 200,
      sortable: false,
      filter: false,
    },
    {
      headerName: 'Resiko Deforestasi',
      field: 'risiko_deforestasi',
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
      field: 'lokasi_kebun',
      width: 200,
      valueGetter: (params) =>
        params.data?.lokasi_kebun ||
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
    if (selectedPekebun?.peta?.geom?.coordinates) {
      return getPolygonCenter(selectedPekebun?.peta?.geom?.coordinates);
    }
    if (selectedPekebun?.geom?.coordinates) {
      return getPolygonCenter(selectedPekebun?.geom?.coordinates);
    }
    return [-0.5, 114.9];
  }, [selectedPekebun]);

  const zoomMap = 7;

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/organisms/MapView'), {
        loading: () => (
          <div className="h-[calc(100vh-72px)] w-[100vw] bg-primary/20 flex items-center justify-center">
            Memuat Peta
          </div>
        ),
        ssr: false,
      }),
    []
  );

  const handleStaticLayerChange = (v, data) => {
    if (v.target.checked == true) {
      fetchStaticLayersDetail(data?.slug);
    } else {
      let tempStaticLayer = { ...staticLayersDetail };
      tempStaticLayer[data?.value] = null;
      dispatch(setStaticLayerDetail(tempStaticLayer));
    }
  };

  const handlePetaOverlayChange = async (layer, value) => {
    const key = `peta_overlay_${layer.id}`;

    setActivePetaOverlays((prev) => {
      const next = { ...prev };
      if (value) {
        next[layer.value] = { ...(next[layer.value] || {}), active: true };
      } else {
        next[layer.value] = { ...(next[layer.value] || {}), active: false };
      }
      return next;
    });

    if (value) {
      try {
        setLoadingPetaOverlays(true);
        const res = await getPetaOverlayDetail(layer.id);
        const data = res?.data?.data || res?.data;
        if (data) {
          const tempStaticLayersDetail = { ...staticLayersDetail };
          tempStaticLayersDetail[key] = { active: true, ...data };
          dispatch(setStaticLayerDetail(tempStaticLayersDetail));
        }
      } catch (error) {
        console.error('Failed to fetch peta overlay detail', error);
      } finally {
        setLoadingPetaOverlays(false);
      }
    } else {
      const tempStaticLayersDetail = { ...staticLayersDetail };
      tempStaticLayersDetail[key] = null;
      dispatch(setStaticLayerDetail(tempStaticLayersDetail));
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

  const handleRemoveFilterPetani = useCallback(() => {
    setFilterPetaniId('');
    setCurrentPage(1);
    // Clear petani_id from URL if it exists
    if (petaniIdFromUrl) {
      router.replace('/', { scroll: false });
    }
  }, [petaniIdFromUrl, router]);

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
    fetchStaticLayerList();
    fetchKelompokTani();
    fetchJenisLegalitas();

    return () => {
      dispatch(setFilterSTDBStatus(''));
      dispatch(setFilterKomoditas([]));
      dispatch(setFilterKecamatan([]));
    };
  }, []);

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
        setFilterKelompok(kelompokOption.value);
        setIsKetuaKelompokTani(true);
        // Small delay to ensure state is updated before fetching
        setTimeout(() => setIsKelompokFilterInitialized(true), 100);
      } else {
        setIsKelompokFilterInitialized(true);
      }
    } else {
      setIsKelompokFilterInitialized(true);
    }
  }, [kelompokTani]);

  useEffect(() => {
    const fetchPetaOverlays = async () => {
      setLoadingPetaOverlays(true);
      try {
        const res = await getPetaOverlayList();
        const data = res?.data?.data || res?.data || {};
        const results = data?.results || data || [];
        const formatted = (Array.isArray(results) ? results : []).map(
          (item) => ({
            ...item,
            value: item.slug || item.id,
            label: item.nama || item.name || `Layer ${item.id}`,
          })
        );
        setPetaOverlays(formatted);
      } catch (error) {
        console.error('Failed to fetch peta overlay list', error);
        setPetaOverlays([]);
      } finally {
        setLoadingPetaOverlays(false);
      }
    };

    fetchPetaOverlays();
  }, []);

  // Handle query parameters for opening Data Kebun Modal with filter
  useEffect(() => {
    const openModal = searchParams.get('openModal');
    const kelompokName = searchParams.get('kelompokName');
    const petaniId = searchParams.get('petani_id');

    // Handle petani_id parameter
    if (openModal === 'dataKebun' && petaniId) {
      // Open the modal
      setShowTable(true);
      // Set the petani_id filter (will be passed to useKebun)
      setFilterPetaniId(petaniId);
      // Clear query parameters from URL
      router.replace('/', { scroll: false });
    }
    // Handle kelompokName parameter (existing logic)
    else if (
      openModal === 'dataKebun' &&
      kelompokName &&
      kelompokTani &&
      kelompokTani.length > 0
    ) {
      // Find the kelompok ID by matching the name
      const kelompokOption = kelompokTani.find(
        (kelompok) => kelompok.label === decodeURIComponent(kelompokName)
      );

      if (kelompokOption) {
        // Open the modal
        setShowTable(true);
        // Set the filter
        setFilterKelompok(kelompokOption.value);
        // Clear query parameters from URL
        router.replace('/', { scroll: false });
      }
    }
  }, [searchParams, kelompokTani, router]);

  // Fetch kebun data when filters change or on page load
  useEffect(() => {
    // Only fetch after kelompok filter is initialized to prevent race conditions
    if (isKelompokFilterInitialized) {
      fetchKebun();
    }
  }, [
    isKelompokFilterInitialized,
    pageSize,
    currentPage,
    searchText,
    filterKelompok,
    filterRSPO,
    filterISPO,
    filterLegalitas,
    filterPetaniId,
    petaniIdFromUrl,
    dateRange.startDate,
    dateRange.endDate,
  ]);

  if (!rolesLoaded) {
    return null;
  }

  if (!canViewMap) {
    return (
      <div className="flex h-[calc(100vh-72px)] w-full items-center justify-center">
        <p className="text-sm text-gray-600">
          Anda tidak memiliki akses untuk melihat MapView.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full max-w-full max-h-full overflow-y-hidden overflow-x-hidden">
      <div className="relative max-h-[calc(100vh-72px)]">
        <FilterSidebar
          staticLayers={staticLayerList}
          activeStaticLayers={staticLayersDetail}
          petaOverlays={petaOverlays}
          activePetaOverlays={activePetaOverlays}
          onStaticLayerChange={(layer, value) => {
            handleStaticLayerChange({ target: { checked: value } }, layer);
          }}
          onPetaOverlayChange={handlePetaOverlayChange}
          activeBasemap={activeTile}
          onBasemapChange={setActiveTile}
          loading={loadingDetailStaticLayer || loadingPetaOverlays}
        />
        <RightSidebar dateRange={dateRange} onDateRangeChange={setDateRange} />
        <Map
          highlightedPolygon={selectedPekebun?.peta?.geom?.coordinates}
          zoom={zoomMap}
          position={centerMap}
          data={kebunMapData}
          activeDataId={selectedPekebun?.id}
          showCustomControls={true}
          onFilterChange={(filter) =>
            setActiveFilter(activeFilter == filter ? '' : filter)
          }
          activeFilter={activeFilter}
          tileLayer={activeTile}
          staticLayers={staticLayersDetail}
          isDisplaySidebar={true}
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
          filterPetaniId={filterPetaniId || petaniIdFromUrl || ''}
          petaniName={petaniName}
          onRemoveFilterPetani={handleRemoveFilterPetani}
          kelompokOptions={kelompokTani}
          rspoOptions={rspoOptions}
          ispoOptions={ispoOptions}
          legalitasOptions={jenisLegalitas}
          loading={loadingKebun}
          rowData={kebunTableData}
          columnDefs={colDefs}
          autoSizeStrategy={autoSizeStrategy}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalKebun}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          disableKelompokFilter={isKetuaKelompokTani}
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

const MapDashboardWithSuspense = () => {
  return (
    <Suspense fallback={<SectionLoading />}>
      <MapDashboard />
    </Suspense>
  );
};

export default MapDashboardWithSuspense;
