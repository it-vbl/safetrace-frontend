import PropTypes from 'prop-types';

import { cn } from '@/utils/cn';

import Paragraph from '../Typography/Paragraph';

const RowData = ({ label = '', value = '', className = '' }) => {
  return (
    <div className='flex items-center justify-between gap-x-2 break-all'>
      <Paragraph level={3} className='text-neutral-600 shrink-0 font-medium'>
        {label || '-'}
      </Paragraph>
      <Paragraph level={2} className={cn(`text-neutral-900 text-end font-bold`, className)}>
        {value || '-'}
      </Paragraph>
    </div>
  );
};

RowData.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

export default RowData;
