import ColData from '@/components/atoms/ColData';

const BorderBottomColData = ({ label = '', value = '', className = '' }) => {
  return (
    <div className='border-spacing-2 border-b border-dashed border-b-gray-300 py-4 pr-4'>
      <ColData className={className} label={label} value={value} />
    </div>
  );
};

export default BorderBottomColData;
