import React from "react";

const ArrowRight = ({ color = "currentColor", size = 20, ...props }) => {
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
        d="M15.832 12.5L10.832 17.5L9.6487 16.3167L12.6404 13.3334H3.33203V3.33337H4.9987V11.6667H12.6404L9.6487 8.68337L10.832 7.50004L15.832 12.5Z"
        fill={color}
      />
    </svg>
  );
};

export default ArrowRight;
