const Close = ({ size = 20, color = "#1D1B20", ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.33317 15.8334L4.1665 14.6667L8.83317 10.0001L4.1665 5.33341L5.33317 4.16675L9.99984 8.83341L14.6665 4.16675L15.8332 5.33341L11.1665 10.0001L15.8332 14.6667L14.6665 15.8334L9.99984 11.1667L5.33317 15.8334Z"
        fill={color}
      />
    </svg>
  );
};

export default Close;
