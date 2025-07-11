import { useMemo } from 'react';
import BorderBottomColData from '../../../molecules/BorderBottomColData';
import dynamic from 'next/dynamic';
import convertCoordToDMS from '@/libs/utils/convertCoordToDMS';

const DataPemetaan = ({ data }) => {
  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/organisms/MapView'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-1 font-bold'>Informasi Pemetaan</div>
      <div className='grid h-auto w-full grid-cols-3'>
        <BorderBottomColData
          label='Titik koordinat'
          value={convertCoordToDMS(
            data?.peta?.titik_koordinat?.coordinates[0],
            data?.peta?.titik_koordinat?.coordinates[1]
          )}
        />
        <BorderBottomColData label='Luas (m2)' value={data?.peta?.luas_area_geom} />
        <BorderBottomColData label='Keliling (m2)' value={data?.peta?.keliling_area_geom} />
      </div>
      <div className='h-[256px] w-full '>
        <Map mapClassName='h-full' highlightedPolygon={data?.peta?.geom?.coordinates} position={null} data={[data]} />
      </div>
    </div>
  );
};

export default DataPemetaan;
