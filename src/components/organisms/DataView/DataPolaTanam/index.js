import BorderBottomColData from '../../../molecules/BorderBottomColData';

const DataPolaTanam = ({ data }) => {
  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-1 font-bold'>Informasi Pola Tanam</div>
      <div className='grid h-auto w-full grid-cols-3'>
        <BorderBottomColData label='Pola Tanam' value={data?.pola_tanam_label} />
      </div>
    </div>
  );
};

export default DataPolaTanam;
