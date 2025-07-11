const Plus = ({ size = 15, fill = '#2E4967' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_645_5248)">
        <path d="M11.5827 0L3.41602 0V2.91667H11.5827V0Z" fill={fill} />
        <path d="M11 8.75H4V14H11V8.75Z" fill={fill} />
        <path
          d="M12.75 4.08301H2.25C1.78587 4.08301 1.34075 4.26738 1.01256 4.59557C0.684374 4.92376 0.5 5.36888 0.5 5.83301L0.5 11.6663H2.83333V7.58301H12.1667V11.6663H14.5V5.83301C14.5 5.36888 14.3156 4.92376 13.9874 4.59557C13.6592 4.26738 13.2141 4.08301 12.75 4.08301ZM11.5833 6.41634H9.25V5.24967H11.5833V6.41634Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_645_5248">
          <rect width="14" height="14" fill="white" transform="translate(0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Plus;
