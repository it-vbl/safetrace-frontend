import React from 'react';
import ReactSwitch from 'react-switch';

const Switch = ({
  onChange,
  checked,
  onColor,
  onHandleColor,
  handleDiameter,
  uncheckedIcon,
  checkedIcon,
  boxShadow,
  activeBoxShadow,
  height,
  width,
  className,
  id,
}) => {
  const handleChange = (checked) => {
    onChange(checked);
  };

  return (
    <label htmlFor={id} className='flex items-center'>
      <ReactSwitch
        checked={checked}
        onChange={handleChange}
        onColor={onColor}
        onHandleColor={onHandleColor}
        handleDiameter={24}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow={boxShadow}
        activeBoxShadow={activeBoxShadow}
        height={16}
        width={32}
        boxShadow={4}
        className={className}
        id={id}
      />
    </label>
  );
};

export default Switch;
