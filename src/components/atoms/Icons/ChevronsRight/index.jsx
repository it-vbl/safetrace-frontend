import theme from '@/utils/tailwindTheme';

const ChevronsRight = ({ size = 16, color = theme.colors.blue8 }) => {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M8.66667 11.3332L12 7.99984L8.66667 4.6665M4 11.3332L7.33333 7.99984L4 4.6665'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default ChevronsRight;
