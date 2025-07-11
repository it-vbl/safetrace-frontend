const ChevronDown = ({ fill = '#615A5A', width = 17, height = 16 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.55719 5.52997L4.61719 6.46997L8.61719 10.47L12.6172 6.46997L11.6772 5.52997L8.61719 8.5833L5.55719 5.52997Z"
        fill={fill}
      />
    </svg>
  );
};

export default ChevronDown;
