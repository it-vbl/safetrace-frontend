'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import Logo1 from '@/assets/images/logo1.png';
import Logo2 from '@/assets/images/logo2.png';
import Logo3 from '@/assets/images/logo3.png';
import Checkbox from '@/components/atoms/Checkbox';
import Close from '@/components/atoms/Icons/Close';
import Statistic from '@/components/atoms/Icons/Statistic';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/molecules/Select';
import JumlahSTDBStatusCard from '@/components/organisms/JumlahSTDBStatusCard';
import JumlahSTDBTahapCard from '@/components/organisms/JumlahSTDBTahapCard';
import LahanTanamPerKomoditasCard from '@/components/organisms/LahanTanamPerKomoditasCard';
import Sidebar from '@/components/organisms/Sidebar';
import komoditas from '@/constants/komoditas';
import pekebuns from '@/constants/pekebuns';
import numberFormat from '@/libs/utils/numberFormat';
import { Button } from '@/stories/Button';
import getPolygonCenter from '@/utils/getPolygonCenter';
import theme from '@/utils/tailwindTheme';
import { ChevronDownIcon } from '@radix-ui/react-icons';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const MapDashboard = () => {
  const [showTable, setShowTable] = useState(false);
  const [rowData, setRowData] = useState(pekebuns);
  const [selectedPekebun, setSelectedPekebun] = useState(pekebuns[0]);

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
    { field: 'id_kebun', headerName: 'ID Kebun' },
    { field: 'coordinate', headerName: 'Titik Koordinat' },
    { field: 'status_lahan', headerName: 'Nama Pemilik' },
    { field: 'komoditas', headerName: 'Komoditas' },
    { field: 'luas_lahan', headerName: 'Luas Lahan(m2) ' },
    { field: 'kecamatan', headerName: 'Kecamatan' },
    { field: 'kelurahan', headerName: 'Kelurahan' },
    { field: 'data_peta', headerName: 'Data Peta' },
    { field: 'pekebun', headerName: 'Pekebun' },
    { field: 'stdb', headerName: 'STDB' },
  ];

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

  const centerMap = useMemo(() => {
    if (selectedPekebun) {
      return getPolygonCenter(selectedPekebun?.polygonCoords);
    }
    return [-0.5, 114.9];
  }, [selectedPekebun]);

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/organisms/MapView'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const dashboardCard = [
    {
      tag: 'Data STDB',
      value: 10000,
    },
    {
      tag: 'STDB Telah Terbit',
      value: 10000,
      tagBg: '#D0FAED',
    },
    {
      tag: 'STDB Tidak Terbit',
      value: 10000,
      tagBg: '#FDD0CE',
    },
    {
      tag: 'Total Luas Kebun Polygon (ha)',
      value: 10000,
    },
    {
      tag: 'Total Luas Kebun Sertifikat (ha)',
      value: 10000,
    },
    {
      tag: 'Pekebun',
      value: 10000,
    },
    {
      tag: 'Kebun',
      value: 10000,
    },
    {
      tag: 'Kecamatan',
      value: 10000,
    },
  ];

  const DashboardCard = ({ value, tagBg, tag }) => {
    return (
      <div className='flex flex-col items-start rounded-[2px] border border-gray-300 p-4'>
        <span className='text-[40px]'>{numberFormat(value)}</span>
        <div style={{ background: tagBg || '#00000033' }} className={`rounded-[4px] p-4 px-3 py-1`}>
          {tag}
        </div>
      </div>
    );
  };

  return (
    <div className='h-full w-full'>
      <div className='flex w-full flex-col gap-4'>
        <Heading level={1}>DATA ANALISIS SEPANJANG WAKTU</Heading>
        <div className='grid grid-cols-4 gap-4'>
          {dashboardCard?.map((data) => {
            return <DashboardCard key={data?.tag} value={data?.value} tag={data?.tag} tagBg={data?.tagBg} />;
          })}
          <div className={'col-span-3 row-span-3'}>
            <LahanTanamPerKomoditasCard />
          </div>
          <div className={'col-span-1'}>
            <DashboardCard value={10000} tag={'Data Lahan'} />
          </div>
          <div className={'col-span-1'}>
            <DashboardCard value={5000} tag={'Data Kebun'} tagBg={'#FDD0CE'} />
          </div>
          <div className={'col-span-1'}>
            <DashboardCard value={2000} tag={'Data Pekebun'} tagBg={'#D0FAED'} />
          </div>
          <div className={'col-span-2'}>
            <JumlahSTDBTahapCard />
          </div>
          <div className={'col-span-2'}>
            <JumlahSTDBStatusCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDashboard;
