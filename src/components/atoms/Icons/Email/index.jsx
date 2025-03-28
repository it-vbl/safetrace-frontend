const Email = ({ color = "#F9FEFF", size = 27 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 27 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.95703"
        y="1.77698"
        width="22.75"
        height="16.25"
        rx="2"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M1.95703 5.02698L12.3398 10.96C12.9546 11.3113 13.7094 11.3113 14.3243 10.96L24.707 5.02698"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
};

export default Email;
