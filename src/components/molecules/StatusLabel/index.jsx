import { useMemo } from 'react';
import PropTypes from 'prop-types';

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
          bg: 'bg-bgColor',
          text: 'text-primary',
        };
      case 'menunggu':
      case 'pending':
      case 'menunggu':
      case 'pindah_sekolah':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-600',
        };
      case 'failed':
      case 'belum bayar':
      case 'belum dibayar':
      case 'calon siswa':
      case 'gagal':
        return {
          bg: 'bg-error1',
          text: 'text-tertiary',
        };
      case 'tamat':
        return {
          bg: 'bg-bgColor',
          text: 'text-primary',
        };
      case 'dropout':
        return {
          bg: 'bg-neutral-100',
          text: 'text-neutral-500',
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
