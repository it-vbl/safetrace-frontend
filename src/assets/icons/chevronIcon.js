import React from 'react';

const ChevronIcon = ({ direction = 'right', size = '12' }) => {
  const _direction = {
    right: '',
    left: 'rotate-180',
  };

  return (
    <div className={`transform ${_direction[direction]}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 7 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.17583 11.5895L0 10.4111L4.40749 6.0003L0 1.58947L1.17916 0.411133L5.58332 4.82197C5.89578 5.13451 6.0713 5.55836 6.0713 6.0003C6.0713 6.44224 5.89578 6.86609 5.58332 7.17863L1.17583 11.5895Z"
          fill="#4C79AB"
        />
      </svg>
    </div>
  );
};

export default ChevronIcon;
