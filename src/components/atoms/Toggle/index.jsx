import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { cn } from '@/utils/cn';

const Toggle = ({
  value = false,
  onChange = (e) => {},
  disabled = false,
  className = '',
}) => {
  const [isActive, setIsActive] = useState(value);

  useEffect(() => {
    setIsActive(value);
  }, [value]);

  const handleOnChange = (e) => {
    if (!disabled) {
      const newValue = !isActive;
      setIsActive(newValue);
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center gap-2" data-testid="toggle-wrapper">
      <label
        data-testid="label"
        className={cn(
          'relative inline-flex cursor-pointer items-center',
          disabled && 'cursor-not-allowed',
          className
        )}
      >
        <input
          type="checkbox"
          checked={value}
          onChange={handleOnChange}
          disabled={disabled}
          className="peer sr-only !hidden"
          data-testid="toggle"
        />
        <div
          data-testid="toggle-background"
          className={cn(
            "relative border border-black border-[2px] h-[14px] w-[22px] rounded-full transition-colors duration-200 after:absolute after:start-[2px] after:top-[2px] after:h-[6px] after:w-[6px] after:rounded-full after:bg-black after:transition-all after:duration-200 after:content-['']",
            value
              ? 'bg-primary after:bg-white border-primary after:translate-x-[8px]'
              : 'bg-white after:translate-x-0',
            disabled && 'bg-neutral-100'
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
