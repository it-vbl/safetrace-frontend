import BorderBottomColData from '../../../molecules/BorderBottomColData';

const DataJenisPupuk = ({ data }) => {
  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-1 font-bold'>Informasi Jenis Pupuk</div>
      <div className='grid h-auto w-full grid-cols-3'>
        <BorderBottomColData label='Jenis Pupuk' value={data?.jenis_pupuk_label} />
      </div>
    </div>
  );
};

export default DataJenisPupuk;
