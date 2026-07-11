import theme from '@/utils/tailwindTheme';

const ChevronsLeft = ({ size = 16, color = theme.colors.primary }) => {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M7.33333 11.3332L4 7.99984L7.33333 4.6665M12 11.3332L8.66667 7.99984L12 4.6665'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default ChevronsLeft;
