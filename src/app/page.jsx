'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch } from 'react-redux';

import Checkbox from '@/components/atoms/Checkbox';
import Close from '@/components/atoms/Icons/Close';
import Statistic from '@/components/atoms/Icons/Statistic';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/molecules/Select';
import pekebuns from '@/constants/pekebuns';
import useFitPolygonBounds from '@/hooks/useFitPolygonBounds';
import useKecamatanSanggau from '@/hooks/useKecamatanSanggau';
import useKomoditas from '@/hooks/useKomoditas';
import useReferences from '@/hooks/useReferences';
import useSTDB from '@/hooks/useSTDB';
import { setFilterKomoditas } from '@/store/slices/stdb';
import { Button } from '@/stories/Button';
import getPolygonCenter from '@/utils/getPolygonCenter';
import theme from '@/utils/tailwindTheme';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const MapDashboard = () => {
  const dispatch = useDispatch();
  const [showTable, setShowTable] = useState(false);
  const [rowData, setRowData] = useState(pekebuns);
  const [selectedPekebun, setSelectedPekebun] = useState(pekebuns[0]);

  const { komoditas } = useKomoditas();
  const { kecamatanSanggau } = useKecamatanSanggau();
  const { stdb, filterKomoditas } = useSTDB();
  const { stdbStatuses } = useReferences();

  const handleOnLihatClicked = (data) => {
    setShowTable(false);
    setSelectedPekebun(data);
  };

  const ActionsCellRenderer = useCallback(
    (e) => {
      return <Button label='Lihat' size={'small'} onClick={() => handleOnLihatClicked(e.data)} />;
    },
    [rowData]
  );
  const colDefs = [
    {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: ActionsCellRenderer,
    },
    { field: 'id', headerName: 'ID Kebun' },
    {
      field: 'geom.coordinates',
      headerName: 'Titik Koordinat',
      valueFormatter: (params) => {
        return params.value.join(', ');
      },
    },
    { field: 'kelembagaan_tani', headerName: 'Nama Pemilik' },
    { field: 'komoditas_kelembagaan_label', headerName: 'Komoditas' },
    { field: 'luas_lahan', headerName: 'Luas Lahan(m2)' },
    { field: 'kecamatan_label', headerName: 'Kecamatan' },
    { field: 'desa_label', headerName: 'Kelurahan' },
    { field: 'data_peta', headerName: 'Data Peta' },
    { field: 'pekebun.user.full_name', headerName: 'Pekebun' },
    { field: 'stdb', headerName: 'STDB' },
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

  return (
    <div className=' h-full w-full'>
      <div className='relative max-h-[calc(100vh-72px)]'>
        <Map
          highlightedPolygon={selectedPekebun?.geom?.coordinates}
          zoom={zoomMap}
          position={centerMap}
          data={stdb}
          activeDataId={selectedPekebun?.id}
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
                  <SearchBar placeholder='Cari Pekebun' />
                  <Select containerClassName='w-[200px]' placeholder='Pilih Komoditas' options={komoditas} />
                  <Select containerClassName='w-[200px]' placeholder='Pilih Kecamatan' options={kecamatanSanggau} />
                  <Select containerClassName='w-[200px]' placeholder='Pilih STDB' options={stdb} />
                </div>
                <Close onClick={() => setShowTable(false)} />
              </div>
            </div>
            <div className='w-full flex-1'>
              <AgGridReact autoSizeStrategy={autoSizeStrategy} rowData={stdb} columnDefs={colDefs} />
            </div>
          </div>
        </div>
      </div>
      <div className='absolute left-[64px] top-[calc(72px+9px)] z-[400] rounded-[8px] border-[2px] border-black50/60 bg-white p-4'>
        <div className='flex flex-col gap-2'>
          {komoditas?.map((data) => {
            return (
              <Checkbox
                key={data?.value}
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
