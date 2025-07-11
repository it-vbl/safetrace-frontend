import React from 'react';

const Indonesian = ({ size = 42, fill = '#E80505', stroke = '#DEDEDE' }) => {
  return (
    <div>
      <svg
        width={size}
        height={size}
        viewBox="0 0 42 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_68_13826)">
          <path
            d="M21.0004 35.2223C13.1457 35.2223 6.77821 28.8548 6.77821 21.0001C6.77821 13.1453 13.1457 6.77783 21.0004 6.77783C28.8552 6.77783 35.2227 13.1453 35.2227 21.0001C35.2227 28.8548 28.8551 35.2223 21.0004 35.2223Z"
            fill="white"
          />
          <path
            d="M6.52821 21.0001C6.52821 28.9928 13.0076 35.4723 21.0004 35.4723C28.9932 35.4723 35.4727 28.9928 35.4727 21.0001C35.4727 13.0073 28.9932 6.52783 21.0004 6.52783C13.0076 6.52783 6.52821 13.0073 6.52821 21.0001Z"
            stroke={stroke}
            stroke-width="0.5"
          />
        </g>
        <path
          d="M21.0004 6.77783C13.1457 6.77783 6.77821 13.1453 6.77821 21.0001L35.2227 21.0001C35.2227 13.1453 28.8552 6.77783 21.0004 6.77783Z"
          fill={fill}
        />
        <defs>
          <filter
            id="filter0_d_68_13826"
            x="0.27832"
            y="0.277832"
            width="41.4443"
            height="41.4443"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="3" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_68_13826" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_68_13826"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default Indonesian;
