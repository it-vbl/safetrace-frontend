import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { DownloadCloud } from 'lucide-react';
import { toast } from 'react-toastify';

import Checkbox from '@/components/atoms/Checkbox';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import convertCoordToDMS from '@/libs/utils/convertCoordToDMS';
import { downloadSHPKebun } from '@/services/kebun';

import BorderBottomColData from '../../../molecules/BorderBottomColData';

const DataPemetaan = ({ data, mode = 'pendataan', verified = false, onVerifyChange = (e) => { } }) => {
  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/organisms/MapView'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const handleDownloadPeta = async () => {
    try {
      const res = await downloadSHPKebun(data?.id);
      if (res.status == 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'peta.shp');
        document.body.appendChild(link);
        link.click();
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Gagal mengunduh peta');
    }
  };

  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-1 font-bold'>Informasi Pemetaan</div>
      {mode === 'verifikasi' && (
        <div className='mt-3'>
          <Checkbox
            value={verified}
            onChange={onVerifyChange}
            size={14}
            labelClassName={`${data?.status_stdb === '3' ? 'text-gray-400' : 'text-primary'}  text-[12px] font-bold`}
            label='Terverifikasi?'
            disabled={data?.status_stdb === '3'}
          />
        </div>
      )}
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
      <div className='my-4 grid h-auto w-full grid-cols-3'>
        <div className='flex flex-col gap-y-[2px]'>
          <Paragraph level={3} className='line-clamp-1 text-[12px] font-bold text-neutral7'>
            File
          </Paragraph>
          <div
            onClick={() => {
              handleDownloadPeta();
            }}
            className='flex cursor-pointer flex-row gap-2 text-[14px] font-bold text-primary'
          >
            <DownloadCloud width={24} height={24} className='text-primary' />
            Unduh SHP Per Kebun
          </div>
        </div>
      </div>
      <div className='h-[256px] w-full '>
        <Map mapClassName='h-full' highlightedPolygon={data?.peta?.geom?.coordinates} position={null} data={[data]} />
      </div>
    </div>
  );
};

export default DataPemetaan;
