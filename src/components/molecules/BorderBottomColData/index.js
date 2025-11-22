import ColData from '@/components/atoms/ColData';

const BorderBottomColData = ({
  label = '',
  value = '',
  className = '',
  isBordered = true,
}) => {
  const containerClass = `${
    isBordered ? 'border-b border-b-gray-300' : ''
  } border-spacing-2 py-4 pr-4`;
  return (
    <div className={containerClass}>
      <ColData className={className} label={label} value={value} />
    </div>
  );
};

export default BorderBottomColData;
