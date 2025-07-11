const Japan = ({ width = 45, height = 44, fill = ['#FCFCFC', '#D90026'], stroke = '#DEDEDE' }) => {
  return (
    <div>
      <svg
        width={width}
        height={height}
        viewBox="0 0 43 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_68_13829)">
          <path
            d="M35.8663 21.0001C35.8663 28.8548 29.4988 35.2223 21.6441 35.2223C13.7894 35.2223 7.42188 28.8548 7.42188 21.0001C7.42188 13.1453 13.7894 6.77783 21.6441 6.77783C29.4988 6.77783 35.8663 13.1453 35.8663 21.0001Z"
            fill={fill[0]}
          />
          <path
            d="M27.6885 21.0001C27.6885 24.3383 24.9824 27.0445 21.6441 27.0445C18.3058 27.0445 15.5997 24.3383 15.5997 21.0001C15.5997 17.6618 18.3058 14.9556 21.6441 14.9556C24.9824 14.9556 27.6885 17.6618 27.6885 21.0001Z"
            fill={fill[1]}
          />
          <path
            d="M21.6441 35.4723C29.6369 35.4723 36.1163 28.9928 36.1163 21.0001C36.1163 13.0073 29.6369 6.52783 21.6441 6.52783C13.6513 6.52783 7.17188 13.0073 7.17188 21.0001C7.17188 28.9928 13.6513 35.4723 21.6441 35.4723Z"
            stroke={stroke}
            stroke-width="0.5"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_68_13829"
            x="0.921875"
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
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_68_13829" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_68_13829"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default Japan;
