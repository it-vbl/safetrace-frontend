import theme from '@/utils/tailwindTheme';

const Check = ({ size = 20, color = theme.colors.primary, ...props }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M7.95825 14.9998L3.20825 10.2498L4.39575 9.06234L7.95825 12.6248L15.6041 4.979L16.7916 6.1665L7.95825 14.9998Z'
        fill={color}
      />
    </svg>
  );
};

Check.displayName = 'Check';
export default Check;
