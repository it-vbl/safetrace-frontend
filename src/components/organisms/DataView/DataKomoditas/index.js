import { useMemo, useState } from 'react';
import BorderBottomColData from '../../../molecules/BorderBottomColData';

const DataKomoditas = ({ komoditas }) => {
  const [activeKomoditasIndex, setActiveKomoditasIndex] = useState(0);

  const dataKomoditas = useMemo(() => {
    return (
      komoditas?.map((data, index) => {
        return {
          label: index == 0 ? 'Komoditas Utama' : `Komoditas Lain (${index})`,
          id: data?.id,
          data: data,
        };
      }) || []
    );
  }, [komoditas]);

  const activeKomoditas = useMemo(() => {
    return dataKomoditas?.[activeKomoditasIndex];
  }, [activeKomoditasIndex, dataKomoditas]);

  const activeClassName = 'font-bold text-primary bg-gray-100 ';

  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-row items-start justify-start'>
        {dataKomoditas?.map((data, index) => (
          <div
            className={`cursor-pointer border-r border-t border-r-gray-300 border-t-gray-300 p-3 text-[14px] hover:bg-slate-100 ${
              activeKomoditasIndex === index ? activeClassName : ''
            } ${
              index == 0
                ? ' rounded-tl-[4px] border-x border-x-gray-300'
                : index === komoditas.length - 1
                ? ' rounded-tr-[4px]'
                : ''
            } `}
            key={index}
            onClick={() => setActiveKomoditasIndex(index)}
            id={`tab-komoditas-${index}`}
          >
            {data.label}
          </div>
        ))}
      </div>
      <div className='border border-gray-300 p-4'>
        <div className='flex flex-1 font-bold'>Informasi Pola Tanam</div>
        <div className='grid h-auto w-full grid-cols-3'>
          <BorderBottomColData label='Komoditas' value={activeKomoditas?.data?.nama_label} />
          <BorderBottomColData label='Tahun Tanam' value={activeKomoditas?.data?.tahun_tanam} />
          <BorderBottomColData
            label='Tahun Sebelum Peremajaan'
            value={activeKomoditas?.data?.tahun_sebelum_peremajaan}
          />
          <BorderBottomColData label='Asal Benih' value={activeKomoditas?.data?.asal_benih_label} />
          <BorderBottomColData label='Jenis Lahan' value={activeKomoditas?.data?.jenis_lahan_label} />
          <BorderBottomColData label='Jumlah Tegakan Pohon' value={activeKomoditas?.data?.jumlah_tegakan_pohon} />
          <BorderBottomColData label='Produksi Satu Tahun' value={activeKomoditas?.data?.produksi_per_tahun} />
          <BorderBottomColData label='Luas Area Tanam' value={activeKomoditas?.data?.luas_areal_tanam} />
          <BorderBottomColData label='Produktifitas Lahan (Ton/ha)' value={activeKomoditas?.data?.produktivitas} />
        </div>
      </div>
    </div>
  );
};

export default DataKomoditas;
