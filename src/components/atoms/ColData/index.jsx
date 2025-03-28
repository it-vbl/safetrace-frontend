import PropTypes from 'prop-types';

import { cn } from '@/utils/cn';

import Paragraph from '../Typography/Paragraph';

const ColData = ({ label = '', value = '', className = '' }) => {
  return (
    <div className='flex flex-col gap-y-[2px]'>
      <Paragraph level={3} className='text-neutral8 line-clamp-1 font-medium'>
        {label || '-'}
      </Paragraph>
      <Paragraph level={2} className={cn(`text-neutral10 line-clamp-1 font-bold`, className)}>
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
