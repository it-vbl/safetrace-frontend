const Chevron = ({ size = 12, fill = '#9B9C9D', position = 'down' }) => {
  const _position = {
    down: '',
    top: 'rotate-180',
  };

  return (
    <div className={`transform ${_position[position]}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.2929 2.96436L6.35343 7.90386C6.25836 7.9951 6.1317 8.04605 5.99993 8.04605C5.86816 8.04605 5.7415 7.9951 5.64643 7.90386L0.70993 2.96686L0.00292969 3.67386L4.93943 8.61086C5.22536 8.88337 5.60519 9.03538 6.00018 9.03538C6.39517 9.03538 6.775 8.88337 7.06093 8.61086L11.9999 3.67136L11.2929 2.96436Z"
          fill={fill}
        />
      </svg>
    </div>
  );
};

export default Chevron;
