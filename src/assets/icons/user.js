const User = ({ size = 18, fill = '#9B9C9D' }) => (
  <div className="ml-[2px]">
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_720_12060)">
        <path
          d="M6 8C8.20914 8 10 6.20914 10 4C10 1.79086 8.20914 0 6 0C3.79086 0 2 1.79086 2 4C2 6.20914 3.79086 8 6 8Z"
          fill={fill}
        />
        <path
          d="M8.69533 9.33374H3.30467C2.42854 9.3348 1.5886 9.68331 0.969084 10.3028C0.349568 10.9223 0.00105855 11.7623 0 12.6384L0 16.0004H12V12.6384C11.9989 11.7623 11.6504 10.9223 11.0309 10.3028C10.4114 9.68331 9.57146 9.3348 8.69533 9.33374Z"
          fill={fill}
        />
        <path
          d="M14.0013 6.66626V4.66626H12.668V6.66626H10.668V7.99959H12.668V9.99958H14.0013V7.99959H16.0013V6.66626H14.0013Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_720_12060">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </div>
);

export default User;
