import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import './LabelledCheckbox.module.css';
import { cn } from '@/utils/cn';

import Label from '../../atoms/Label';

const LabelledCheckbox = ({
  value = false,
  onChange,
  label = '',
  disabled = false,
  inputClassName = '',
  containerClassName = '',
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

  return (
    <div className={cn('flex items-center gap-2 py-1', containerClassName)}>
      <input
        type='checkbox'
        checked={isChecked}
        onChange={handleOnChange}
        disabled={disabled}
        className={cn('size-4', inputClassName)}
      />
      <Label className={cn('font-normal', labelClassName)}>{label}</Label>
    </div>
  );
};

LabelledCheckbox.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

export default LabelledCheckbox;
