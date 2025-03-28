import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { cn } from '@/utils/cn';

import Paragraph from '../../atoms/Typography/Paragraph';

const StatusLabel = ({ status = 'success', text = '', className }) => {
  const colors = useMemo(() => {
    switch (status) {
      case 'success':
      case 'lunas':
      case 'siswa':
      case 'aktif':
        return {
          bg: 'bg-green1',
          text: 'text-green8',
        };
      case 'menunggu':
      case 'pending':
      case 'menunggu':
      case 'pindah_sekolah':
        return {
          bg: 'bg-warning1',
          text: 'text-warning8',
        };
      case 'failed':
      case 'belum bayar':
      case 'belum dibayar':
      case 'calon siswa':
      case 'gagal':
        return {
          bg: 'bg-error1',
          text: 'text-error7',
        };
      case 'tamat':
        return {
          bg: 'bg-blue1',
          text: 'text-blue8',
        };
      case 'dropout':
        return {
          bg: 'bg-neutral3',
          text: 'text-neutral7',
        };
      default:
        return {
          bg: '',
          text: '',
        };
    }
  }, [status]);

  return (
    <div className={cn(`rounded-full px-4 py-[6px] text-center capitalize`, colors.bg, className)}>
      <Paragraph level={4} className={`${colors.text}`}>
        {text}
      </Paragraph>
    </div>
  );
};

StatusLabel.propTypes = {
  status: PropTypes.oneOf(['success', 'pending', 'failed']),
  text: PropTypes.string,
};

export default StatusLabel;
