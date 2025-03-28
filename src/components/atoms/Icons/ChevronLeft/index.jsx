import theme from '@/utils/tailwindTheme';

const ChevronLeft = ({ size = 16, color = theme.colors.blue8, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d='M10 12L6 8L10 4' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
};

export default ChevronLeft;
