import Checkbox from '@/components/atoms/Checkbox';

import BorderBottomColData from '../../../molecules/BorderBottomColData';

const DataPolaTanam = ({ data, onVerifyChange = (e) => {}, verified = false, mode = 'pendataan' }) => {
  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-1 font-bold'>Informasi Pola Tanam</div>
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
        <BorderBottomColData label='Pola Tanam' value={data?.pola_tanam_label} />
      </div>
    </div>
  );
};

export default DataPolaTanam;
