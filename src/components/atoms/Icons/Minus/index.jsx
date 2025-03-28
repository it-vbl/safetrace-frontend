const Minus = ({ size = 12, color = "#9B9C9D", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.5 5.5H0.5C0.223858 5.5 0 5.72386 0 6C0 6.27615 0.223858 6.50001 0.5 6.50001H11.5C11.7761 6.50001 12 6.27615 12 6C12 5.72386 11.7761 5.5 11.5 5.5Z"
      fill={color}
    />
  </svg>
);

export default Minus;
