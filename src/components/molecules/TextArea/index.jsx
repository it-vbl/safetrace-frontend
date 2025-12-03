import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { cn } from '@/utils/cn';

import ErrorOutline from '../../atoms/Icons/ErrorOutline';
import Label from '../../atoms/Label';
import LabelledCheckbox from '../LabelledCheckbox';

const TextArea = ({
  label = '',
  placeholder = '',
  value = '',
  onChange,
  isChecked = false,
  maxChar = 200,
  helperText = '',
  hasError = false,
  disabled = false,
  isRequired,
  isCheckable = false,
  isFullWidth = false,
  checkboxLabel = 'Label',
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isCheckedValue, setIsCheckedValue] = useState(isChecked);

  useEffect(() => {
    setIsCheckedValue(isChecked);
  }, [isChecked]);

  const handleOnChange = (e) => {
    if (e.target.value === ' ') return;
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;
    if (emojiRegex.test(e.target.value)) {
      return;
    }

    const notAllowingTwoSpace = / {2}/;
    if (notAllowingTwoSpace.test(e.target.value)) return;

    const trimmedText = e.target.value.substring(0, maxChar);
    setInputValue(maxChar ? trimmedText : e.target.value);
    onChange(e);
  };

  const handleOnChecked = (e) => {
    setIsCheckedValue(e.target.checked);
  };

  const inputStyles = cn(
    'w-full px-3 w-full h-[100px] py-2.5 border rounded-[4px] hover:outline-none focus:border-blue6 focus:outline-none placeholder:text-neutral6',
    {
      '!border-error5': hasError,
      'border-[#D9D9D9]': !hasError,
      'border-neutral6': inputValue !== '',
      'bg-white hover:border-blue6': !disabled,
      'bg-neutral4 !border-neutral6 text-neutral7 cursor-not-allowed': disabled,
      'w-full': isFullWidth,
      'placeholder:text-neutral7': disabled,
    }
  );

  useEffect(() => {
    value && setInputValue(value);
  }, [value]);

  return (
    <div className="flex w-full min-w-0 flex-col gap-1">
      <div className="flex justify-between">
        <Label
          isRequired={isRequired}
          className="text-[12px] font-bold  text-gray-500"
        >
          {label}
        </Label>

        {isCheckable && (
          <LabelledCheckbox
            label={checkboxLabel}
            onChange={handleOnChecked}
            value={isCheckedValue}
            disabled={disabled}
          />
        )}
      </div>
      <textarea
        value={inputValue}
        onChange={handleOnChange}
        placeholder={placeholder}
        disabled={disabled}
        className={inputStyles}
        maxLength={maxChar}
        {...props}
      />
      {hasError ? (
        <div className="relative">
          <div className="absolute right-4 top-[-40px]">
            <ErrorOutline />
          </div>
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span
            className={cn('text-xs text-neutral7', {
              'text-error5': hasError,
              'opacity-0': !helperText,
            })}
          >
            {helperText || ''}
          </span>
        </div>
        {maxChar && (
          <span className="text-xs text-neutral7">
            {inputValue.length}/{maxChar}
          </span>
        )}
      </div>
    </div>
  );
};

TextArea.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isChecked: PropTypes.bool,
  maxChar: PropTypes.number,
  helperText: PropTypes.string,
  hasError: PropTypes.bool,
  disabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isCheckable: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  checkboxLabel: PropTypes.string,
};

export default TextArea;
