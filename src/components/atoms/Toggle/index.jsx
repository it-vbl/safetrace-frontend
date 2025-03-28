import React from 'react';
import PropTypes from 'prop-types';

import Paragraph from '@/components/atoms/Typography/Paragraph';
import { cn } from '@/utils/cn';

const Toggle = ({ value = false, onChange = () => {}, disabled = false, className = '' }) => {
  const handleOnChange = (e) => {
    if (!disabled) {
      onChange(e);
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
            "bg-error6 h-4 w-8 rounded-full after:absolute after:start-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-4 rtl:peer-checked:after:-translate-x-4",
            value && !disabled && 'bg-green6',
            disabled && 'bg-neutral3',
            'after:border-error6 peer-checked:after:border-green6 after:border',
            disabled && 'after:border-neutral3'
          )}
        />
      </label>
      <Paragraph level={3} className={cn(disabled && 'text-neutral6', !disabled && 'text-blue10')}>
        {value ? 'Aktif' : 'Nonaktif'}
      </Paragraph>
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
