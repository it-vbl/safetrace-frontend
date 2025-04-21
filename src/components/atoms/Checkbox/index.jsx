import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './Checkbox.module.css';

const Checkbox = ({ value = false, onChange = (e) => {}, name = '', disabled = false, size = 18, label = '' }) => {
  const [isChecked, setIsChecked] = useState(value);

  useEffect(() => {
    setIsChecked(value);
  }, [value]);

  const handleOnChange = (e) => {
    setIsChecked(e.target.checked);
    onChange(e);
  };

  return (
    <div className='flex items-center gap-2'>
      <div
        className={` bg-red-300 ${
          disabled ? 'cursor-not-allowed border-gray-300 bg-gray-200' : 'cursor-pointer'
        } flex items-start items-center`}
      >
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
          data-testd='checkbox'
        />
        <span className='' />
      </div>
      {label}
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
