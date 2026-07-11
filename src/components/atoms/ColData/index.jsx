import PropTypes from 'prop-types';

import { cn } from '@/utils/cn';

import Paragraph from '../Typography/Paragraph';

const ColData = ({ label = '', value = '', className = '' }) => {
  return (
    <div className='flex flex-col gap-y-[2px]'>
      <Paragraph level={3} className='line-clamp-1 text-[12px] font-bold text-neutral-500'>
        {label || '-'}
      </Paragraph>
      <Paragraph level={3} className={cn(`line-clamp-1 text-neutral-900`, className)}>
        {value || '-'}
      </Paragraph>
    </div>
  );
};

ColData.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

export default ColData;
