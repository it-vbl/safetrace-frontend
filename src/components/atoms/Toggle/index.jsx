import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { cn } from '@/utils/cn';

const Toggle = ({ value = false, onChange = (e) => {}, disabled = false, className = '' }) => {
  const [isActive, setIsActive] = useState(value);

  const handleOnChange = (e) => {
    if (!disabled) {
      setIsActive(!isActive);
      onChange(!isActive);
    }
  };

  return (
    <div className='flex items-center gap-2' data-testid='toggle-wrapper'>
      <label
        data-testid='label'
        className={cn('relative inline-flex cursor-pointer items-center', disabled && 'cursor-not-allowed', className)}
      >
        <input
          type='checkbox'
          checked={value}
          onChange={handleOnChange}
          disabled={disabled}
          className='peer sr-only'
          data-testid='toggle'
        />
        <div
          data-testid='toggle-background'
          className={cn(
            "h-4 w-8 rounded-full bg-error6 after:absolute after:start-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-4 rtl:peer-checked:after:-translate-x-4",
            value && !disabled && 'bg-green6',
            disabled && 'bg-neutral3',
            'after:border after:border-error6 peer-checked:after:border-green6',
            disabled && 'after:border-neutral3'
          )}
        />
      </label>
    </div>
  );
};

Toggle.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Toggle;
