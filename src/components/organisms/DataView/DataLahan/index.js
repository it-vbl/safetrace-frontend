import Checkbox from '@/components/atoms/Checkbox';

import BorderBottomColData from '../../../molecules/BorderBottomColData';

const DataLahan = ({ mode = 'pendataan', data, onVerifyChange = (e) => {}, verified = false }) => {
  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-1 font-bold'>Informasi Lahan</div>
      {mode === 'verifikasi' && (
        <div className='mt-3'>
          <Checkbox
            value={verified}
            onChange={onVerifyChange}
            size={14}
            label='Terverifikasi?'
            labelClassName={`${data?.status_stdb === '3' ? 'text-gray-400' : 'text-primary'}  text-[12px] font-bold`}
            disabled={data?.status_stdb === '3'}
          />
        </div>
      )}
      <div className='grid h-auto w-full grid-cols-3'>
        <BorderBottomColData label='Eks Plasma' value={data?.lahan?.eks_plasma} />
        <BorderBottomColData label='Status Lahan' value={data?.lahan?.status_lahan_label} />
        <BorderBottomColData label='Luas Lahan(m2)' value={data?.lahan?.luas_lahan} />
        <BorderBottomColData label='No Dokumen' value={data?.lahan?.no_dokumen} />
        <BorderBottomColData label='Kecamatan' value={data?.lahan?.kecamatan_label} />
        <BorderBottomColData label='Desa/Kelurahan' value={data?.lahan?.desa_label} />
      </div>
    </div>
  );
};
export default DataLahan;
