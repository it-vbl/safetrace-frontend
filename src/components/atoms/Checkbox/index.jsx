'use client'

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './Checkbox.module.css';

const Checkbox = ({
  value = false,
  onChange = (e) => {},
  name = '',
  disabled = false,
  size = 18,
  label = '',
  labelClassName = '',
}) => {
  const [isChecked, setIsChecked] = useState(value);

  useEffect(() => {
    setIsChecked(value);
  }, [value]);

  const handleOnChange = (e) => {
    setIsChecked(e.target.checked);
    onChange(e);
  };

  const handleClickLabel = () => {
    if (!disabled) {
      setIsChecked(!isChecked);
      onChange({ target: { checked: !isChecked, name } });
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <div className={` ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-start items-center`}>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={handleOnChange}
          disabled={disabled}
          style={{
            width: size,
            height: size,
          }}
          name={name}
          id={name}
          data-testid='checkbox'
        />
        <label htmlFor={name} onClick={handleClickLabel} className={` ml-2 cursor-pointer ${labelClassName}`}>
          {label}
        </label>
      </div>
    </div>
  );
};

Checkbox.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.number,
};

export default Checkbox;
