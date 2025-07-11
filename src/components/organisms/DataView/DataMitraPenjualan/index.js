import BorderBottomColData from '../../../molecules/BorderBottomColData';

const DataMitraPenjualan = ({ data }) => {
  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-1 font-bold'>Informasi Mitra Penjualan</div>
      <div className='grid h-auto w-full grid-cols-3'>
        <BorderBottomColData label='Mitra Penjualan' value={data?.mitra_penjualan} />
      </div>
    </div>
  );
};

export default DataMitraPenjualan;
