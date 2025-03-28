import theme from '@/utils/tailwindTheme';

const Update = ({ size = 16, color = theme.colors.neutral9 }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M7.33333 5.33333V8.66667L10.1667 10.3467L10.68 9.49333L8.33333 8.1V5.33333H7.33333ZM14 6.66667V2L12.24 3.76C11.16 2.67333 9.66 2 8 2C4.68667 2 2 4.68667 2 8C2 11.3133 4.68667 14 8 14C11.3133 14 14 11.3133 14 8H12.6667C12.6667 10.5733 10.5733 12.6667 8 12.6667C5.42667 12.6667 3.33333 10.5733 3.33333 8C3.33333 5.42667 5.42667 3.33333 8 3.33333C9.28667 3.33333 10.4533 3.86 11.3 4.7L9.33333 6.66667H14Z'
        fill={color}
      />
    </svg>
  );
};

export default Update;
