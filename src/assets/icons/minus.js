import React from 'react';

export default function Minus({ size = [12, 13], fill = '#9B9C9D' }) {
  return (
    <div>
      <svg
        width={size[0]}
        height={size[1]}
        viewBox="0 0 12 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5 5.82129H0.5C0.223858 5.82129 0 6.04515 0 6.32129C0 6.59744 0.223858 6.82129 0.5 6.82129H11.5C11.7761 6.82129 12 6.59744 12 6.32129C12 6.04515 11.7761 5.82129 11.5 5.82129Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
