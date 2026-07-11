import theme from '@/utils/tailwindTheme';

const Chevron = ({ size = 16, color = '#FFFFFF', position = 'down' }) => {
  const _position = {
    up: 'rotate-180',
    down: 'rotate-0',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={_position[position]}
    >
      <path d='M4 6L8 10L12 6' stroke={color} strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
};

export default Chevron;
