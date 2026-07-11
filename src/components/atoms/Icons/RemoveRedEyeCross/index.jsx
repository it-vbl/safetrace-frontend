import theme from '@/utils/tailwindTheme';

const RemoveRedEyeCross = ({ size = 24, color = theme.colors.neutral[600], ...props }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <g clipPath='url(#clip0_498_8778)'>
        <path
          d='M16.455 16.455C15.1729 17.4323 13.6118 17.9736 12 18C6.75 18 3.75 12 3.75 12C4.68292 10.2614 5.97685 8.74246 7.545 7.545M10.425 6.18C10.9412 6.05916 11.4698 5.99875 12 6C17.25 6 20.25 12 20.25 12C19.7947 12.8517 19.2518 13.6536 18.63 14.3925M13.59 13.59C13.384 13.8111 13.1356 13.9884 12.8596 14.1113C12.5836 14.2343 12.2857 14.3004 11.9836 14.3058C11.6815 14.3111 11.3814 14.2555 11.1012 14.1424C10.821 14.0292 10.5665 13.8608 10.3529 13.6471C10.1392 13.4335 9.97079 13.179 9.85763 12.8988C9.74447 12.6186 9.68889 12.3185 9.69422 12.0164C9.69956 11.7143 9.76568 11.4164 9.88866 11.1404C10.0116 10.8644 10.1889 10.616 10.41 10.41M3.75 3.75L20.25 20.25'
          stroke={color}
          strokeWidth='1.6'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_498_8778'>
          <rect width='18' height='18' fill='white' transform='translate(3 3)' />
        </clipPath>
      </defs>
    </svg>
  );
};

export default RemoveRedEyeCross;
