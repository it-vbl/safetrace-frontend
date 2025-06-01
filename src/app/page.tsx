'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Statistic from '@/components/atoms/Icons/Statistic';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import theme from '@/utils/tailwindTheme';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Button } from '@/stories/Button';
import { useRouter } from 'next/navigation';
import Heading from '@/components/atoms/Typography/Heading';
import Close from '@/components/atoms/Icons/Close';
import Select from '@/components/molecules/Select';
import Image from 'next/image';
import Logo1 from '@/assets/images/logo1.png';
import Logo2 from '@/assets/images/logo2.png';
import Logo3 from '@/assets/images/logo3.png';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import pekebuns from '@/consts/pekebuns';
import getPolygonCenter from '@/utils/getPolygonCenter';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const MapDashboard = () => {
  const [showTable, setShowTable] = useState(false);
  const [rowData, setRowData] = useState(pekebuns);
  const [selectedPekebun, setSelectedPekebun] = useState<any>(pekebuns[0]);

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
  const colDefs: any = [
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

  const autoSizeStrategy = useMemo<any>(() => {
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

  return (
    <html>
      <body className='h-full w-full overflow-x-clip'>
        <div className='flex h-[72px] w-full flex-row items-center bg-white px-4 '>
          {/* logo */}
          <div className='flex flex-1'>SIPEKEBUN 2.0</div>
          <div className='ml-auto flex flex-row items-center gap-4'>
            <Image src={Logo1.src} width={30} height={30} alt='logo' />
            <Image src={Logo2.src} width={30} height={30} alt='logo' />
            <Image src={Logo3.src} width={30} height={30} alt='logo' />
          </div>
          <div className='ml-auto flex flex-1 flex-row items-center justify-end gap-4 uppercase'>
            <div>Map</div>
            <div>Dashboard</div>
            <div className='flex flex-row items-center gap-2 font-bold'>
              Fajar Sukmara <ChevronDownIcon />
            </div>
          </div>
        </div>
        <div className='relative max-h-[calc(100vh-72px)]'>
          <Map position={centerMap} data={pekebuns} activeDataId={selectedPekebun?.id} />
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
                    <Select
                      containerClassName='w-[200px]'
                      placeholder='Pilih Komoditas'
                      options={[
                        {
                          label: 'Sawit',
                          value: 'sawit',
                        },
                        {
                          label: 'Padi',
                          value: 'padi',
                        },
                        {
                          label: 'Jagung',
                          value: 'jagung',
                        },
                        {
                          label: 'Kedelai',
                          value: 'kedelai',
                        },
                        {
                          label: 'Kacang',
                          value: 'kacang',
                        },
                      ]}
                    />
                    <Select
                      containerClassName='w-[200px]'
                      placeholder='Pilih Kecamatan'
                      options={[
                        {
                          label: 'Sawit',
                          value: 'sawit',
                        },
                        {
                          label: 'Padi',
                          value: 'padi',
                        },
                        {
                          label: 'Jagung',
                          value: 'jagung',
                        },
                        {
                          label: 'Kedelai',
                          value: 'kedelai',
                        },
                        {
                          label: 'Kacang',
                          value: 'kacang',
                        },
                      ]}
                    />
                    <Select
                      containerClassName='w-[200px]'
                      placeholder='Pilih STDB'
                      options={[
                        {
                          label: 'Sawit',
                          value: 'sawit',
                        },
                        {
                          label: 'Padi',
                          value: 'padi',
                        },
                        {
                          label: 'Jagung',
                          value: 'jagung',
                        },
                        {
                          label: 'Kedelai',
                          value: 'kedelai',
                        },
                        {
                          label: 'Kacang',
                          value: 'kacang',
                        },
                      ]}
                    />
                  </div>
                  <Close onClick={() => setShowTable(false)} />
                </div>
              </div>
              <div className='w-full flex-1'>
                <AgGridReact autoSizeStrategy={autoSizeStrategy} rowData={rowData} columnDefs={colDefs} />
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default MapDashboard;
